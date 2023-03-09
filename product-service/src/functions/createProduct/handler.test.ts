import { jest, describe, test, expect, afterEach } from "@jest/globals";
import { main } from "./handler";
import { defaultContext, defaultEvent } from "@libs/test-helpers";
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
const validBody =
  '{"title":"Test book","description":"Mock data to test createProduct lambda", "price": 100, "author":"John Doe","publisher":"Mock Publishing Ltd","publicationDate":"2000-01-01","count":80085}';
const invalidBody =
  '{"title":"Test book","description":"Mock data to test createProduct lambda", "author":"John Doe","publisher":"Mock Publishing Ltd","publicationDate":"2000-01-01","count":80085}';

jest.mock("@libs/BookRepository", () => {
  return function () {
    return {
      create: () => mockMethod(),
    };
  };
});

describe("createProduct function", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("should create product and return it in successful response", async () => {
    const event = {
      ...defaultEvent,
      body: JSON.parse(validBody),
      rawBody: validBody,
      httpMethod: "POST",
      resource: "/products",
      path: "/products",
    };
    const result = await main(event, defaultContext);

    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual(JSON.stringify(mockData));
  });

  test("should return 400 response if request data is invalid", async () => {
    const event = {
      ...defaultEvent,
      body: JSON.parse(invalidBody),
      rawBody: invalidBody,
      httpMethod: "POST",
      resource: "/products",
      path: "/products",
    };
    const result = await main(event, defaultContext);

    expect(result.statusCode).toBe(400);
    expect(result.body).toEqual("Event object failed validation");
  });

  test("should return 500 response on internal errors", async () => {
    const errorMessage = "Test error";
    mockMethod = jest.fn(() => {
      throw new Error(errorMessage);
    });
    const event = {
      ...defaultEvent,
      body: JSON.parse(validBody),
      rawBody: validBody,
      httpMethod: "POST",
      resource: "/products",
      path: "/products",
    };
    const result = await main(event, defaultContext);

    expect(result.statusCode).toBe(500);
    expect(result.body).toEqual(`Internal error: Error: ${errorMessage}`);
  });
});
