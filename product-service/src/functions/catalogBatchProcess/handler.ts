import middy from "@middy/core";
import errorLogger from "@middy/error-logger";
import httpErrorHandler from "@middy/http-error-handler";
import { eventLogger } from "@libs/event-logger.middleware";
import { SQSHandler } from "aws-lambda";
import { validate } from "@functions/createProduct/schema";
import BookRepository from "@libs/BookRepository";
import {
  DeleteMessageBatchCommand,
  DeleteMessageBatchCommandInput,
} from "@aws-sdk/client-sqs";
import { PublishCommand, PublishCommandInput } from "@aws-sdk/client-sns";
import { sqsClient } from "@libs/sqsClient";
import { snsClient } from "@libs/snsClient";
import { BookStock } from "src/model/product";

const bookRepository = new BookRepository();

const catalogBatchProcess: SQSHandler = async (event) => {
  try {
    // Process messages
    const messages = event.Records;

    // Validate message data
    const validMessagesPayload = [];
    const invalidMessages = [];
    messages.forEach((message) => {
      const messageBody = JSON.parse(message.body);

      // Parse number fields
      messageBody.price = Number(messageBody.price);
      messageBody.count = Number(messageBody.count);

      const isValid = validate(messageBody);

      if (isValid) {
        validMessagesPayload.push(messageBody);
      } else {
        invalidMessages.push(message);
      }
    });

    // Handle invalid messages somehow, put them in DLQ maybe?
    if (invalidMessages.length > 0) {
      console.log("Some messages have malformed payload:", invalidMessages);
      console.log(validate.errors);
    }

    // Create products from valid messages
    const batchCreateResult = await bookRepository.createBatch(
      validMessagesPayload
    );

    const createdItems: Array<BookStock> = [];
    const failedItems = [];
    batchCreateResult.forEach((result) => {
      if (result.status === "fulfilled") {
        createdItems.push(result.value.item);
      } else {
        failedItems.push(result);
      }
    });
    console.log("New items created:", createdItems);

    if (failedItems.length > 0) {
      console.log("Items failed to be created:", failedItems);
    }

    // Notify subscribers about item creation
    const publishParams: PublishCommandInput = {
      Subject: `My shop new products`,
      Message: `
        ${createdItems.length} new products created, ${
        failedItems.length
      } failed to be created. \n
        New products: \n${createdItems
          .map((item) => ` - ${item.title}, ${item.author}, £${item.price}`)
          .join("\n")}
      `,
      TopicArn: process.env.SNS_TOPIC_ARN,
      MessageAttributes: {
        authors: {
          DataType: "String.Array",
          StringValue: `["${createdItems
            .map((item) => item.author)
            .join('", "')}"]`,
        },
      },
    };
    const sendResult = await snsClient.send(new PublishCommand(publishParams));
    console.log("Email notification sent", sendResult);

    // Delete processed messages from the queue to prevent duplicate processing
    const deleteCommand: DeleteMessageBatchCommandInput = {
      QueueUrl: process.env.SQS_QUEUE_URL,
      Entries: messages.map((message) => ({
        Id: message.messageId,
        ReceiptHandle: message.receiptHandle,
      })),
    };
    const deleteResult = await sqsClient.send(
      new DeleteMessageBatchCommand(deleteCommand)
    );
    console.log("SQS messages successfully deleted:", deleteResult.Successful);

    if (deleteResult.Failed && deleteResult.Failed.length > 0) {
      console.log(
        "Some SQS message deletions have failed:",
        deleteResult.Failed
      );
    }
  } catch (error) {
    console.log(error);
  }
};

export const main = middy(catalogBatchProcess)
  .use(eventLogger())
  .use(httpErrorHandler())
  .use(errorLogger());
