import { APIGatewayProxyEvent, Context } from "aws-lambda";

export type TestEvent<T> = Omit<APIGatewayProxyEvent, "body"> & { body: T };

export const defaultContext: Context = {
  callbackWaitsForEmptyEventLoop: false,
  functionName: "test",
  functionVersion: "1",
  invokedFunctionArn: "arn",
  memoryLimitInMB: "1",
  awsRequestId: "aws",
  logGroupName: "log",
  logStreamName: "stream",
  getRemainingTimeInMillis: () => 0,
  done: () => {},
  fail: () => {},
  succeed: () => {},
};

export const defaultEvent =
  {
    httpMethod: "POST",
    headers: { Authorization: "dummyToken" },
    isBase64Encoded: false,
    path: "/change-expiry-elapsed-days",
    multiValueQueryStringParameters: null,
    multiValueHeaders: {},
    pathParameters: null,
    queryStringParameters: null,
    stageVariables: null,
    requestContext: null,
    resource: "",
  };
