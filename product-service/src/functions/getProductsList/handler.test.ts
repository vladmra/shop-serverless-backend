import { jest, describe, test, expect, afterEach } from "@jest/globals";
import { main } from "./handler";
import { defaultContext, defaultEvent } from "@libs/test-helpers";
import { BookStock } from "src/model/product";

let mockMethod = jest.fn(() => Promise.resolve(mockData));
const mockData: Array<BookStock> = [
  {
    id: "100",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    publisher: "J. B. Lippincott & Co.",
    publicationDate: "1960-07-11",
    description: "To Kill a Mockingbird is a novel...",
    price: 10,
    count: 1,
  },
  {
    id: "200",
    title: "1984",
    author: "George Orwell",
    publisher: "Secker & Warburg",
    publicationDate: "1949-06-08",
    description: "1984 is a dystopian novel by George...",
    price: 10,
    count: 2,
  },
];

jest.mock("@libs/BookRepository", () => {
  return function () {
    return {
      list: () => mockMethod(),
    };
  };
});

describe("getProductsList function", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("should return a list of products", async () => {
    const event = {
      ...defaultEvent,
      httpMethod: "GET",
      resource: "/products",
      path: "/products",
    };
    const result = await main(event, defaultContext);

    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual(JSON.stringify(mockData));
  });

  test("should return 500 response on internal errors", async () => {
    const errorMessage = "Test error";
    mockMethod = jest.fn(() => {
      throw new Error(errorMessage);
    });
    const event = {
      ...defaultEvent,
      httpMethod: "GET",
      resource: "/products",
      path: "/products",
    };
    const result = await main(event, defaultContext);

    expect(result.statusCode).toBe(500);
    expect(result.body).toEqual(`Internal error: Error: ${errorMessage}`);
  });
});
