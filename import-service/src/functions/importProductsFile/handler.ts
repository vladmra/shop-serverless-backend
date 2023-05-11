import createError from "http-errors";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { eventLogger } from "@libs/event-logger.middleware";
import middy from "@middy/core";
import errorLogger from "@middy/error-logger";
import httpErrorHandler from "@middy/http-error-handler";
import cors from "@middy/http-cors";
import { s3Client } from "@libs/s3client";

import schema from "./schema";

const importProductsFile: ValidatedEventAPIGatewayProxyEvent<
  typeof schema
> = async (event) => {
  try {
    const fileName = event.queryStringParameters.name;
    const command = new PutObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: `uploaded/${fileName}`,
    });
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    
    return formatJSONResponse(signedUrl);
  } catch (error) {
    throw createError(500, `Internal error: ${error}`, { expose: true });
  }
};

export const main = middy(importProductsFile)
  .use(eventLogger())
  .use(httpErrorHandler())
  .use(errorLogger())
  // TODO: does it make sense to restrict returned allowed origin to requests's origin and not just send * back?
  .use(cors({ methods: "GET" }));
