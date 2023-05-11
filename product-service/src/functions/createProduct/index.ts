import { handlerPath } from "@libs/handler-resolver";
import { DocumentedFunctionConfig } from "src/model/aws";

const functionConfig: DocumentedFunctionConfig = {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      httpApi: {
        method: "POST",
        path: "/products",
        documentation: {
          summary: "Creates new product",
          description: "Creates new product with (optiona) specified stock number",
          tags: ["products"],
          requestBody: {
            description: "Product and stock data"
          },
          requestModels: {
            "application/json": "createProductRequest",
          },
          methodResponses: [
            {
              statusCode: 200,
              responseBody: {
                description: "A newly created Product object",
              },
              responseModels: {
                "application/json": "createProductResponse",
              },
            },
            {
              statusCode: 400,
              responseBody: {
                description: "Bad request error",
              },
              responseModels: {
                "application/text": "badRequestErrorResponse",
              },
            },
            {
              statusCode: 500,
              responseBody: {
                description: "Internal error",
              },
              responseModels: {
                "application/text": "internalErrorResponse",
              },
            },
          ],
        },
      },
    },
  ],
};

export default functionConfig;