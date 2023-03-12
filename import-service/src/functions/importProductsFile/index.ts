import { handlerPath } from "@libs/handler-resolver";
import { AWS } from "@serverless/typescript";

const functionConfig: AWS["functions"]["string"] = {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: "get",
        path: "import",
        request: {
          parameters: {
            querystrings: {
              name: {
                required: true
              }
            }
          }
        },
        cors: {
          origins: ["${env:CLOUDFRONT_ORIGIN}", "http://localhost:3000"],
          headers: [
            "Content-Type",
            "Authorization",
            "Access-Control-Allow-Origin",
            "Access-Control-Request-Headers",
          ],
          methods: ["GET"],
        },
      },
    },
  ],
};

export default functionConfig;
