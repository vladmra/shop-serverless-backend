// TODO: update product model according to TS definition. Is there a way to get JSON model from type or interface?
const productProps = {
  type: "object",
  properties: {
    id: {
      description: "The unique identifier for a product",
      type: "integer",
    },
    title: {
      description: "Name of the product",
      type: "string",
    },
    description: {
      description: "Description of the product",
      type: "string",
    },
    price: {
      description: "Price of the product",
      type: "number",
    },
  },
  required: ["id", "title", "price"],
};
const productSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: "https://example.com/product.schema.json",
  title: "Product",
  description: "An item from the shop",
  ...productProps,
};
const productListSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: "https://example.com/product.schema.json",
  title: "ProductList",
  description: "A list of Products",
  type: "array",
  items: {
    ...productProps,
  },
  uniqueItems: true,
};

// TODO: update response models with error responses
const documentation = {
  version: "1",
  title: "My shop API",
  models: [
    {
      name: "getProductsListResponse",
      description: "GET response model",
      contentType: "application/json",
      schema: productListSchema,
    },
    {
      name: "getProductsByIdResponse",
      description: "GET response model",
      contentType: "application/json",
      schema: productSchema,
    },
  ],
  servers: {
    url: "https://example.com",
    description: "The server",
  },
  tags: [
    {
      name: "products",
    },
  ],
};

export default documentation;
