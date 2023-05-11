import { handlerPath } from "@libs/handler-resolver";
import { AWS } from "@serverless/typescript";

const functionConfig: AWS["functions"]["string"] = {
  handler: `${handlerPath(__dirname)}/handler.main`,
  environment: {
    SQS_QUEUE_URL: { 'Fn::ImportValue': 'ImportProductsQueueURL-${self:provider.stage}' }
  },
  events: [
    {
      s3: {
        bucket: "${self:provider.environment.BUCKET_NAME}",
        existing: true,
        event: "s3:ObjectCreated:*",
        rules: [{
          prefix: "uploaded/"
        }]
      }
    }    
  ],
};

export default functionConfig;
