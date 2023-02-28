import { handlerPath } from '@libs/handler-resolver';

// TODO: check if schema is correct?
export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      httpApi: {
        method: 'get',
        path: '/products',
        documentation: {
          summary: "Returns list of products",
          description: "Returns an array containing all existing products.",
          tags: ["products"],
          methodResponses: [{
            statusCode: 200,
            responseBody: {
              description: "An array of Product objects"
            },
            responseModels: {
              "application/json": "getProductsListResponse"
            }
          }]
        }
      },
    },
  ],
};
