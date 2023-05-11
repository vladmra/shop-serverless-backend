import {
  BatchWriteCommand,
} from "@aws-sdk/lib-dynamodb";
import { readFile } from "fs/promises";
import { Product } from "src/model/product";
import { Stock } from "src/model/stock";
import { ddbDocClient } from "./dynamodb";

interface ProductData {
  id: string;
  title: string;
  description?: string;
  price: number;
  author: string;
  publisher: string;
  publicationDate: string;
  count: number;
}

export const writeData = async () => {
  const jsonFilePath = process.argv[2];
  const productsTableName = process.argv[3];
  const stocksTableName = process.argv[4];

  if (!jsonFilePath) {
    throw new Error("Please specify path to JSON file with product data");
  }

  if (!productsTableName) {
    throw new Error("Please specify products table name");
  }

  if (!stocksTableName) {
    throw new Error("Please specify stocks table name");
  }

  const productData = JSON.parse(await readFile(jsonFilePath, "utf8"));

  if (!productData || productData.length === 0) {
    throw new Error(
      "There is no data to upload"
    );
  }

  const products = [];
  const stocks = [];

  productData.forEach(({ id, count, ...rest }: ProductData) => {
    const product: Product = {
      id,
      ...rest,
    };
    const stock: Stock = {
      productId: id,
      count
    };
    products.push(product);
    stocks.push(stock);
  });

  try {
    while (products.length > 0) {
      const batchLength = 10;
      const batchProducts = products.splice(0, batchLength);
      const batchStocks = stocks.splice(0, batchLength);

      const params = {
        RequestItems: {
          [productsTableName]: batchProducts.map((product) => ({
            PutRequest: {
              Item: { ...product },
            },
          })),
          [stocksTableName]: batchStocks.map((stock) => ({
            PutRequest: {
              Item: { ...stock },
            },
          })),
        },
      };

      const output = await ddbDocClient.send(new BatchWriteCommand(params));
      console.log(output);
    }

    console.log("Success, tables updated.");
  } catch (error) {
    console.log("Error", error);
  }
};

writeData();
