import createProductProps from '@functions/createProduct/schema';

// TODO: update product model according to TS definition. Is there a way to get JSON model from type or interface?
const productStockProps = {
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
      minimum: 0,
      exclusiveMinimum: true
    },
    author: {
      description: "Author",
      type: "string",
    },
    publisher: {
      description: "Publisher",
      type: "string",
    },
    publicationDate: {
      description: "Date of publiscation in the YYYY-MM-DD format",
      type: "string",
    },
    count: {
      description: "Number of items in stock",
      type: "number",
      minimum: 0
    },
  },
  required: ["id", "title", "price", "author", "publisher", "publicationDate", "count"],
};
const productSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: "https://example.com/product.schema.json",
  title: "Product",
  description: "An item from the shop",
  ...productStockProps,
};

const createProductSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: "https://example.com/product.schema.json",
  title: "Data to create new Product",
  description: "Data to create new Product with stock info",
  ...createProductProps,
};

const productListSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: "https://example.com/product.schema.json",
  title: "ProductList",
  description: "A list of Products",
  type: "array",
  items: {
    ...productStockProps,
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
      name: "createProductRequest",
      description: "Request to create new Product",
      contentType: "application/json",
      schema: createProductSchema,
    },
    {
      name: "createProductResponse",
      description: "Response to successful Product creation, contains new Product object",
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
    {
      name: "badRequestErrorResponse",
      description: "Error response model for malformed or incorrect request data",
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
