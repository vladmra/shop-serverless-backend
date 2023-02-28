import { handlerPath } from "@libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      httpApi: {
        method: "get",
        path: "/products",
        documentation: {
          summary: "Returns list of products",
          description: "Returns an array containing all existing products.",
          tags: ["products"],
          methodResponses: [
            {
              statusCode: 200,
              responseBody: {
                description: "An array of Product objects",
              },
              responseModels: {
                "application/json": "getProductsListResponse",
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
