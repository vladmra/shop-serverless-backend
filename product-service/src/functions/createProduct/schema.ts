import Ajv from "ajv";
import addFormats from "ajv-formats";

const schema = {
  type: "object",
  properties: {
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
      minimum: 0
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
      format: "date"
    },
    count: {
      description: "Number of items in stock",
      type: "number",
      minimum: 0
    }
  },
  required: ["title", "price", "author", "publisher", "publicationDate", "count"],
} as const;

const ajv = new Ajv();
addFormats(ajv);
export const validate = ajv.compile(schema);

export default schema;
