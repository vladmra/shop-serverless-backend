import type { AWS } from '@serverless/typescript';

import basicAuthorizer from '@functions/basicAuthorizer';

const serverlessConfiguration: AWS = {
  service: 'authorization-service',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild'],
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
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
  },
  // import the function via paths
  functions: { basicAuthorizer },
  resources: {
    Description: "Authorization service stack for My Shop app",
    Outputs: {
      BasicAuthorizerArn: {
        Description: "Arn of the basic authorizer function",
        Value: { "Fn::GetAtt": ["BasicAuthorizerLambdaFunction", "Arn"] },
        Export: {
          Name: "BasicAuthorizerArn-${self:provider.stage}",
        },
      },
    }
  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;
