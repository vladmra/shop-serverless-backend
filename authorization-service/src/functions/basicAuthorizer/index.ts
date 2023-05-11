import { handlerPath } from "@libs/handler-resolver";
import { AWS } from "@serverless/typescript";

const functionConfig: AWS["functions"]["string"] = {
  handler: `${handlerPath(__dirname)}/handler.main`,
  environment: {
    CREDENTIALS_REF: "${env:CREDENTIALS_REF}",
  },
};

export default functionConfig;
