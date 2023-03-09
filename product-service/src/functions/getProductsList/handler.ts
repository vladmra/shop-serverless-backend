import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import BookRepository from "@libs/BookRepository";
import { eventLogger } from "@libs/event-logger.middleware";
import middy from "@middy/core";
import httpErrorHandler from "@middy/http-error-handler";
import createError from "http-errors";

import schema from "./schema";

const bookRepository = new BookRepository();

const getProductsList: ValidatedEventAPIGatewayProxyEvent<
  typeof schema
> = async () => {
  try {
    const products = await bookRepository.list();

    if (!products || products.length === 0) {
      throw createError.NotFound();
    }

    return formatJSONResponse(products as unknown as Record<string, unknown>);
  } catch (error) {
    throw createError(500, `Internal error: ${error}`, { expose: true });
  }
};

export const main = middy(getProductsList)
  .use(eventLogger())
  .use(httpErrorHandler());
