import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { BookRepository } from "@libs/BookRepository";
import { eventLogger } from "@libs/event-logger.middleware";
import middy from "@middy/core";
import httpErrorHandler from "@middy/http-error-handler";
import createError from "http-errors";

import schema from "./schema";

const bookRepository = new BookRepository();

const getProductsById: ValidatedEventAPIGatewayProxyEvent<
  typeof schema
> = async (event) => {
  try {
    const { productId } = event.pathParameters;
    const product = await bookRepository.getById(productId);

    if (product) {
      return formatJSONResponse(product as unknown as Record<string, unknown>);
    }
  } catch (error) {
    throw createError(500, `Internal error: ${error}`, { expose: true });
  }

  throw createError.NotFound("Product not found");
};

export const main = middy(getProductsById)
  .use(eventLogger())
  .use(httpErrorHandler());
