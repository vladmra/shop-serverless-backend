import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { BookService } from "@libs/BookService";
import { getMockProducts } from "@libs/mock-data";
import middy from "@middy/core";
import httpErrorHandler from "@middy/http-error-handler";
import createError from "http-errors";

import schema from "./schema";

const bookService = new BookService(getMockProducts);

const getProductsList: ValidatedEventAPIGatewayProxyEvent<
  typeof schema
> = async () => {
  try {
    const products = await bookService.getBooks();

    if (!products || products.length === 0) {
      throw createError.NotFound();
    }

    return formatJSONResponse(products as unknown as Record<string, unknown>);
  } catch (error) {
    throw createError(500, `Internal error: ${error}`, { expose: true });
  }
};

export const main = middy(getProductsList).use(httpErrorHandler());
