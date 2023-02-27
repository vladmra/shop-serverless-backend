import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { getMockProducts } from '@libs/mock-data';

import schema from './schema';

const getProductsList: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async () => {
  // TODO: add error handling
  const products = await getMockProducts();
  
  // TODO: fix type declaration
  return formatJSONResponse(products as unknown as Record<string, unknown>);
};

export const main = getProductsList;
