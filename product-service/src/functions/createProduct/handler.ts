import createError from "http-errors";
import middy from "@middy/core";
import errorLogger from "@middy/error-logger";
import httpErrorHandler from "@middy/http-error-handler";
import httpJsonBodyParser from "@middy/http-json-body-parser";
import validator from "@middy/validator";
import { transpileSchema } from "@middy/validator/transpile";
import {
  formatJSONResponse,
  ValidatedEventAPIGatewayProxyEvent,
} from "@libs/api-gateway";
import BookRepository from "@libs/BookRepository";
import { eventLogger } from "@libs/event-logger.middleware";

import schema from "./schema";

const bookRepository = new BookRepository();

const createProduct: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  try {
    const result = await bookRepository.create(event.body);
    return formatJSONResponse(result as unknown as Record<string, unknown>);
  } catch (error) {
    throw createError(500, `Internal error: ${error}`, { expose: true });
  }
};

export const main = middy(createProduct)
  .use(eventLogger())
  .use(httpJsonBodyParser())
  .use(
    validator({
      eventSchema: transpileSchema({
        type: "object",
        properties: { body: schema },
        required: ["body"],
      }),
    })
  )
  .use(httpErrorHandler())
  .use(errorLogger());
