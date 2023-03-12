import { jest, describe, test, expect, afterEach } from "@jest/globals";
import { main } from "./handler";
import { defaultContext, defaultEvent, TestEvent } from "@libs/test-helpers";
import * as s3Presigner from "@aws-sdk/s3-request-presigner";

jest.mock("@aws-sdk/s3-request-presigner");
jest.mock("@libs/s3client", () => ({
  s3Client: jest.fn(),
}));

describe("importProductsFile function", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("should respond with presigned URL for the right operation", async () => {
    const uploadedFileName = "test-file.csv";
    const mockSignedURL = "test-signed-url";
    const getSignedUrlSpy = jest
      .spyOn(s3Presigner, "getSignedUrl")
      .mockImplementation(() => {
        return Promise.resolve(mockSignedURL);
      });
    const event: TestEvent<null> = {
      ...defaultEvent,
      body: null,
      httpMethod: "GET",
      resource: "/import",
      path: "/import",
      queryStringParameters: {
        name: uploadedFileName,
      },
    };
    const result = await main(event, defaultContext);
    const putObjectParams = getSignedUrlSpy.mock.calls[0][1].input as {
      Bucket: string;
      Key: string;
    };

    expect(putObjectParams.Bucket).toEqual(process.env.BUCKET_NAME);
    expect(putObjectParams.Key).toEqual(`uploaded/${uploadedFileName}`);
    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual(JSON.stringify(mockSignedURL));
  });

  test("should return 500 response on internal errors", async () => {
    const errorMessage = "Test error";
    jest.spyOn(s3Presigner, "getSignedUrl").mockImplementation(() => {
      throw new Error(errorMessage);
    });
    const event: TestEvent<null> = {
      ...defaultEvent,
      body: null,
      httpMethod: "GET",
      resource: "/import",
      path: "/import",
      queryStringParameters: {
        name: "test-file.csv",
      },
    };
    const result = await main(event, defaultContext);

    expect(result.statusCode).toBe(500);
    expect(result.body).toEqual(`Internal error: Error: ${errorMessage}`);
  });
});
