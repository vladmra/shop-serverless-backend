import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { BookService } from "@libs/BookService";
import { getMockProducts } from "@libs/mock-data";
import middy from "@middy/core";
import httpErrorHandler from "@middy/http-error-handler";
import createError from "http-errors";

import schema from "./schema";

const bookService = new BookService(getMockProducts);

const getProductsById: ValidatedEventAPIGatewayProxyEvent<
  typeof schema
> = async (event) => {
  try {
    const { productId } = event.pathParameters;
    const product = await bookService.getBookById(Number(productId));

    if (product) {
      return formatJSONResponse(product as unknown as Record<string, unknown>);
    }
  } catch (error) {
    throw createError(500, `Internal error: ${error}`, { expose: true });
  }

  throw createError.NotFound("Product not found");
};

export const main = middy(getProductsById).use(httpErrorHandler());
