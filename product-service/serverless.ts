import type { AWS } from "@serverless/typescript";

// TODO: restrict other function methods
// TODO: update README
import getProductsList from "@functions/getProductsList";
import getProductsById from "@functions/getProductsById";

import documentation from './serverless.doc';

const serverlessConfiguration: AWS = {
  service: "product-service",
  frameworkVersion: "3",
  plugins: ["serverless-esbuild", "serverless-openapi-documenter"],
  provider: {
    name: "aws",
    runtime: "nodejs14.x",
    region: "eu-west-1",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
    },
    httpApi: {
      cors: {
        // TODO: pass correct origin for the deployed client from env variable
        allowedOrigins: [
          "https://d1ote0jlsfuczu.cloudfront.net",
          "http://localhost:3000",
        ],
        allowedHeaders: ["Content-Type", "Authorization"],
        allowedMethods: ["GET", "POST"],
        maxAge: 6000,
      },
    },
  },
  // import the function via paths
  functions: { getProductsList, getProductsById },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk"],
      target: "node14",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10,
    },
    documentation
  },
};

module.exports = serverlessConfiguration;
