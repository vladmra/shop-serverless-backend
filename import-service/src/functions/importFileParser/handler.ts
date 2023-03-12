import createError from "http-errors";
import { S3Event } from "aws-lambda";
import { formatJSONResponse } from "@libs/api-gateway";
import { eventLogger } from "@libs/event-logger.middleware";
import middy from "@middy/core";
import { CopyObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "@libs/s3client";
import { Readable } from "stream";
import * as csv from 'csv-parser';

const importFileParser = async (event: S3Event) => {
  try {
    const { bucket, object } = event.Records[0].s3;
    const getObjectCommand = new GetObjectCommand({
      Bucket: bucket.name,
      Key: object.key
    });

    const response = await s3Client.send(getObjectCommand);

    if (!response.Body || !(response.Body instanceof Readable)) {
      throw new Error('S3 response Body is not Readable');
    }

    (response.Body as Readable)
      .pipe(csv.default())
      .on('data', (data) => console.log(data));

    // After processing,
    // Moving object into "/parsed" folder
    const sourceFolder = "uploaded";
    const destinationFolder = "parsed";
    const copyObjectCommand = new CopyObjectCommand({
      Bucket: bucket.name,
      Key: object.key.replace(sourceFolder, destinationFolder),
      CopySource: `${bucket.name}/${object.key}`
    });

    const copyResponse = await s3Client.send(copyObjectCommand);
    console.log(copyResponse);

    const deleteObjectCommand = new DeleteObjectCommand({
      Bucket: bucket.name,
      Key: object.key
    });
    const deleteResponse = await s3Client.send(deleteObjectCommand);
    console.log(deleteResponse);
    
    return formatJSONResponse("Import file parser finished");
  } catch (error) {
    throw createError(500, `Internal error: ${error}`, { expose: true });
  }
};

export const main = middy(importFileParser)
  .use(eventLogger());
