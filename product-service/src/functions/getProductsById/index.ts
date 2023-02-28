import { handlerPath } from "@libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      httpApi: {
        method: "get",
        path: "/products/{productId}",
        documentation: {
          summary: "Returns a product by Id",
          description: "Returns a Product objecr by its Id.",
          pathParams: [{
            name: "productId",
            description: "Product Id",
            schema: {
              type: "string",
              pattern: "^[0-9_]+$"
            }
          }],
          tags: ["products"],
          methodResponses: [{
            statusCode: 200,
            responseBody: {
              description: "A Product objects"
            },
            responseModels: {
              "application/json": "getProductsByIdResponse"
            }
          }]
        }
      },
    },
  ],
};
