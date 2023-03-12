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

const documentation = {
  version: "1",
  title: "My shop API",
  models: [
    {
      name: "getProductsListResponse",
      description: "Response model with a list of Products",
      contentType: "application/json",
      schema: productListSchema,
    },
    {
      name: "getProductsByIdResponse",
      description: "Response model with a single Product",
      contentType: "application/json",
      schema: productSchema,
    },
    {
      name: "notFoundErrorResponse",
      description: "Error response model",
      contentType: "application/text",
      schema: {
        type: "string"
      },
    },
    {
      name: "internalErrorResponse",
      description: "Error response model",
      contentType: "application/text",
      schema: {
        type: "string"
      },
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
