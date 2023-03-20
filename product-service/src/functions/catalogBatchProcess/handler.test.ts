import { jest, describe, test, expect, afterEach, beforeEach } from "@jest/globals";
import { main } from "./handler";
import { defaultContext } from "@libs/test-helpers";

let baseSQSEvent;
let baseRecord;
let payloadData;

jest.mock("@libs/sqsClient", () => ({
  sqsClient: {
    send: jest.fn().mockImplementation(() => ({
      Successful: [{ Id: baseRecord.messageId }],
    })),
  },
}));
jest.mock("@libs/snsClient", () => ({
  snsClient: {
    send: jest.fn(),
  },
}));

let mockSaveMethod = jest.fn((payload: Array<Record<string, string>>) => {
  return Promise.resolve(
    payload.map((item, index) => ({
      ...item,
      id: `${index}`,
    }))
  )
}
);

jest.mock("@libs/BookRepository", () => {
  return function () {
    return {
      createBatch: (payload) => mockSaveMethod(payload),
    };
  };
});

describe("catalogBatchProcess function", () => {
  beforeEach(() => {
    baseSQSEvent = {
      Records: [],
    };
    baseRecord = {
      messageId: "19dd0b57-b21e-4ac1-bd88-01bbb068cb78",
      receiptHandle: "MessageReceiptHandle",
      body: "",
      awsRegion: "us-east-1",
    };
    payloadData = [
      {
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        publisher: "J. B. Lippincott & Co.",
        publicationDate: "1960-07-11",
        description: "To Kill a Mockingbird is a novel...",
        price: 10,
        count: 1,
      },
      {
        title: "Slaughterhouse-Five",
        author: "Kurt Vonnegut",
        publisher: "Delacorte Press",
        publicationDate: "1969-03-31",
        description: "Slaughterhouse-Five is a satirical novel...",
        price: 8,
        count: 4,
      },
    ];
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("should create products from messages payload", async () => {
    const event = {
      ...baseSQSEvent,
    };
    event.Records = payloadData.map((payload) => ({
      ...baseRecord,
      body: JSON.stringify(payload),
    }));
    const result = await main(event, defaultContext);

    expect(result).toEqual(undefined);
    expect(mockSaveMethod).toHaveBeenCalledWith(payloadData);
  });

  test("should not use messages with malformed body", async () => {
    delete payloadData[0].author;
    const event = {
      ...baseSQSEvent,
    };
    event.Records = payloadData.map((payload) => ({
      ...baseRecord,
      body: JSON.stringify(payload),
    }));
    await main(event, defaultContext);

    expect(mockSaveMethod).toHaveBeenCalledWith([payloadData[1]]);
  });
});
