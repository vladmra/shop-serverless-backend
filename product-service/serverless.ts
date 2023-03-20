import type { AWS } from "@serverless/typescript";

import getProductsList from "@functions/getProductsList";
import getProductsById from "@functions/getProductsById";
import createProduct from "@functions/createProduct";
import catalogBatchProcess from "@functions/catalogBatchProcess";

import documentation from "./serverless.doc";

const serverlessConfiguration: AWS = {
  service: "product-service",
  frameworkVersion: "3",
  plugins: ["serverless-esbuild", "serverless-openapi-documenter"],
  useDotenv: true,
  provider: {
    name: "aws",
    deploymentMethod: "direct",
    runtime: "nodejs14.x",
    region: "eu-west-1",
    stage: "dev",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",

      REGION: "${self:provider.region}",
      PRODUCTS_TABLE_NAME: "products-table",
      STOCKS_TABLE_NAME: "stocks-table",
    },
    httpApi: {
      cors: {
        allowedOrigins: ["${env:CLOUDFRONT_ORIGIN}", "http://localhost:3000"],
        allowedHeaders: ["Content-Type", "Authorization"],
        allowedMethods: ["GET", "POST"],
        maxAge: 6000,
      },
    },
    iam: {
      role: {
        statements: [
          {
            Effect: "Allow",
            Action: [
              "dynamodb:DescribeTable",
              "dynamodb:Query",
              "dynamodb:Scan",
              "dynamodb:GetItem",
              "dynamodb:BatchGetItem",
              "dynamodb:PutItem",
            ],
            Resource: "arn:aws:dynamodb:${self:provider.region}:*:*",
          },
          {
            Effect: "Allow",
            Action: ["sqs:ReceiveMessage", "sqs:DeleteMessage"],
            Resource: { "Fn::GetAtt": ["catalogItemsQueue", "Arn"] },
          },
          {
            Effect: "Allow",
            Action: ["sns:Publish"],
            Resource: { "Fn::GetAtt": ["createProductTopic", "TopicArn"] },
          },
        ],
      },
    },
  },
  functions: {
    getProductsList,
    getProductsById,
    createProduct,
    catalogBatchProcess,
  },
  resources: {
    Description: "Product service stack for My Shop app",
    Resources: {
      catalogItemsQueue: {
        Type: "AWS::SQS::Queue",
        Properties: {
          QueueName: "catalogItemsQueue",
        },
      },
      createProductTopic: {
        Type: "AWS::SNS::Topic",
        Properties: {
          TopicName: "createProductTopic",
        },
      },
      createProductSubscription: {
        Type: "AWS::SNS::Subscription",
        Properties: {
          Protocol: "email",
          TopicArn: { Ref: "createProductTopic" },
          Endpoint: "${env:SUBSCRIPTION_EMAIL}"
        },
      },
      createProductSubscriptionSpecial: {
        Type: "AWS::SNS::Subscription",
        Properties: {
          Protocol: "email",
          TopicArn: { Ref: "createProductTopic" },
          Endpoint: "${env:SUBSCRIPTION_EMAIL_SPECIAL}",
          FilterPolicy: {
            authors: ["J.R.R. Tolkien"]
          }
        },
      }
    },
    Outputs: {
      ImportProductsQueueURL: {
        Description: "URL of the SQS queue to get import product data from",
        Value: { Ref: "catalogItemsQueue" },
        Export: {
          Name: "ImportProductsQueueURL-${self:provider.stage}",
        },
      },
      ImportProductsQueueArn: {
        Description: "Arn of the SQS queue to get import product data from",
        Value: { "Fn::GetAtt": ["catalogItemsQueue", "Arn"] },
        Export: {
          Name: "ImportProductsQueueArn-${self:provider.stage}",
        },
      },
    },
  },
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
    documentation,
  },
};

module.exports = serverlessConfiguration;
