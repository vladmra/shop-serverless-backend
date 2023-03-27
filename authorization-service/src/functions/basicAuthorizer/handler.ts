import { APIGatewayAuthorizerResult, APIGatewayTokenAuthorizerEvent, Handler } from 'aws-lambda';

// Help function to generate an IAM policy
const generateResponse = function(principalId: string, effect: 'Allow' | 'Deny', resource: string): APIGatewayAuthorizerResult {
  return {
    principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [{
        Action: 'execute-api:Invoke',
        Effect: effect,
        Resource: resource
      }]
    }
  };
}

const basicAuthorizer: Handler<APIGatewayTokenAuthorizerEvent, APIGatewayAuthorizerResult> = async (event) => {
  console.log(event);

  const { methodArn, authorizationToken } = event;
  const encodedToken = authorizationToken.split(' ')[1];
  const decodedToken = Buffer.from(encodedToken, 'base64').toString();
  const [username, password] = decodedToken.split(':');

  let response;

  if (!!process.env.CREDENTIALS_REF && `${username}=${password}` === process.env.CREDENTIALS_REF) {
    response = generateResponse('test-user', 'Allow', methodArn);
  } else {
    response = generateResponse('test-user', 'Deny', methodArn);
  }

  console.log('Basic authorizer response:', response);

  return response;
};

export const main = basicAuthorizer;
