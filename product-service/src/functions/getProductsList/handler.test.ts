import { jest, describe, test, expect, afterEach } from "@jest/globals";
import { main } from "./handler";
import * as dataModule from "@libs/mock-data";
import { defaultContext, defaultEvent } from "@libs/test-helpers";

jest.mock("@libs/mock-data");

// TODO: update unit tests
describe("getProductsList function", () => {
  const mockData = [
    {
      id: 100,
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      publisher: "J. B. Lippincott & Co.",
      publicationDate: "1960-07-11",
      description: "To Kill a Mockingbird is a novel...",
      price: 10,
    },
    {
      id: 101,
      title: "1984",
      author: "George Orwell",
      publisher: "Secker & Warburg",
      publicationDate: "1949-06-08",
      description: "1984 is a dystopian novel by George...",
      price: 10,
    },
  ];

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("should return a list of products", async () => {
    jest
      .spyOn(dataModule, "getMockProducts")
      .mockImplementation(() => Promise.resolve(mockData));
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
    jest.spyOn(dataModule, "getMockProducts").mockImplementation(() => {
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
