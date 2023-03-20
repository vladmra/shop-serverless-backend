import { handlerPath } from "@libs/handler-resolver";
import { FunctionConfig } from "src/model/aws";

const functionConfig: FunctionConfig = {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      sqs: {
        arn: { 'Fn::GetAtt': ['catalogItemsQueue', 'Arn'] },
        batchSize: 5
      }
    }
  ],
  environment: {
    SQS_QUEUE_URL: { 'Fn::ImportValue': 'ImportProductsQueueURL-${self:provider.stage}' },
    SNS_TOPIC_ARN: { "Fn::GetAtt": ["createProductTopic", "TopicArn"] }
  }
};

export default functionConfig;