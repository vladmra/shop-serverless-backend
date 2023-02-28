import { Book } from "src/model/product";

export async function getMockProducts(): Promise<Array<Book>> {
  const data = require("./mock-products.json");

  return data;
}
