import { jest, describe, test, expect, afterEach } from "@jest/globals";
import { main } from "./handler";
import { defaultContext, defaultEvent, TestEvent } from "@libs/test-helpers";
import { BookStock } from "src/model/product";

let mockMethod = jest.fn(() => Promise.resolve(mockData));
const mockData: BookStock = {
  id: "100",
  title: "To Kill a Mockingbird",
  author: "Harper Lee",
  publisher: "J. B. Lippincott & Co.",
  publicationDate: "1960-07-11",
  description: "To Kill a Mockingbird is a novel...",
  price: 10,
  count: 1,
};

jest.mock("@libs/BookRepository", () => {
  return function () {
    return {
      getById: () => mockMethod(),
    };
  };
});

describe("getProductsById function", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("should find product by given id", async () => {
    const event: TestEvent<null> = {
      ...defaultEvent,
      body: null,
      httpMethod: "GET",
      resource: "/products",
      path: "/products/{productId}",
      pathParameters: {
        productId: "100",
      },
    };
    const result = await main(event, defaultContext);

    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual(JSON.stringify(mockData[0]));
  });

  test("should return 404 response if product could not be found", async () => {
    mockMethod = jest.fn(() => Promise.resolve(undefined));
    const event: TestEvent<null> = {
      ...defaultEvent,
      body: null,
      httpMethod: "GET",
      resource: "/products",
      path: "/products/{productId}",
      pathParameters: {
        productId: "200",
      },
    };
    const result = await main(event, defaultContext);

    expect(result.statusCode).toBe(404);
    expect(result.body).toEqual("Product not found");
  });

  test("should return 500 response on internal errors", async () => {
    const errorMessage = "Test error";
    mockMethod = jest.fn(() => {
      throw new Error(errorMessage);
    });
    const event: TestEvent<null> = {
      ...defaultEvent,
      body: null,
      httpMethod: "GET",
      resource: "/products",
      path: "/products/{productId}",
      pathParameters: {
        productId: "200",
      },
    };
    const result = await main(event, defaultContext);

    expect(result.statusCode).toBe(500);
    expect(result.body).toEqual(`Internal error: Error: ${errorMessage}`);
  });
});
