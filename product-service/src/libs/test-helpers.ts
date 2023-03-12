import { APIGatewayProxyEvent, Context } from "aws-lambda";

export const defaultEvent: Omit<APIGatewayProxyEvent, "body"> & { body: null } =
  {
    httpMethod: "POST",
    headers: { Authorization: "dummyToken" },
    body: null,
    isBase64Encoded: false,
    path: "/change-expiry-elapsed-days",
    multiValueQueryStringParameters: null,
    multiValueHeaders: null,
    pathParameters: null,
    queryStringParameters: null,
    stageVariables: null,
    requestContext: null,
    resource: "",
  };

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
