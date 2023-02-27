import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { getMockProducts } from '@libs/mock-data';

import schema from './schema';

// TODO: handle errors
const getProductsById: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const { productId } = event.pathParameters;
  const products = await getMockProducts();
  const product = products.find(product => product.id === Number(productId));
  
  return formatJSONResponse(product as unknown as Record<string, unknown>);
};

export const main = getProductsById;
