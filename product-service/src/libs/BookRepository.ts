import {
  AttributeValue,
  BatchGetItemCommand,
  ScanCommand,
  TransactWriteItemsCommand,
  TransactWriteItemsCommandInput,
} from "@aws-sdk/client-dynamodb";
import {
  BatchGetCommandInput,
  DynamoDBDocumentClient,
  ScanCommandInput,
} from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";
import { BookStock } from "src/model/product";
import { ddbDocClient } from "./dynamodb";

interface Repository<T, K> {
  list(): Promise<Array<T>>;
  getById(id: K): Promise<T>;
  create(item: T): Promise<T>;
  update(item: T): Promise<T>;
  delete(item: T): Promise<boolean>;
}

function attrValuesToProduct(dataFromAWS: Record<string, AttributeValue>): BookStock {
  return {
    id: dataFromAWS.id.S,
    title: dataFromAWS.title.S,
    description: dataFromAWS.description.S,
    price: Number(dataFromAWS.price.N),
    author: dataFromAWS.author.S,
    publisher: dataFromAWS.publisher.S,
    publicationDate: dataFromAWS.publicationDate.S,
    count: 0,
  };
}

// TODO: fix unit tests
export class BookRepository implements Repository<BookStock, string> {
  private dbClient: DynamoDBDocumentClient;
  private productsTableName: string;
  private stocksTableName: string;

  constructor() {
    this.dbClient = ddbDocClient;
    this.productsTableName = process.env.PRODUCTS_TABLE_NAME;
    this.stocksTableName = process.env.STOCKS_TABLE_NAME;
  }

  async list() {
    // TODO: handle pagination
  
    // Get all product data from products table
    const scanParams: ScanCommandInput = {
      TableName: this.productsTableName,
      Select: "ALL_ATTRIBUTES",
    };

    const productsData = await this.dbClient.send(new ScanCommand(scanParams));
    const products = productsData.Items;

    if (productsData.ScannedCount === 0) {
      return [];
    }

    // Get all stock data from stocks table
    const stocksGetItemParams: BatchGetCommandInput = {
      RequestItems: {
        [this.stocksTableName]: {
          Keys: products.map((product) => ({
            productId: product.id,
          })),
        },
      },
    };

    const stocksData = await this.dbClient.send(
      new BatchGetItemCommand(stocksGetItemParams)
    );
    const stocks = stocksData.Responses[this.stocksTableName];
    const countMap = new Map(
      stocks.map((stockItem) => [
        stockItem.productId.S,
        Number(stockItem.count.N),
      ])
    );

    // Combine product and stock information
    return products.map((product) => {
      const stockProduct = attrValuesToProduct(product);
      stockProduct.count = countMap.has(stockProduct.id)
        ? countMap.get(stockProduct.id)
        : 0;

      return stockProduct;
    });
  }

  async getById(productId: string) {
    if (!productId) {
      return undefined;
    }

    // Retrieve data from both stocks and products tables using productId
    const getItemParams: BatchGetCommandInput = {
      RequestItems: {
        [this.productsTableName]: {
          Keys: [
            {
              id: { S: productId },
            },
          ],
        },
        [this.stocksTableName]: {
          Keys: [
            {
              productId: { S: productId },
            },
          ],
        },
      },
    };

    const productData = await this.dbClient.send(
      new BatchGetItemCommand(getItemParams)
    );

    if (
      !productData.Responses[this.productsTableName] ||
      productData.Responses[this.productsTableName].length === 0
    ) {
      return undefined;
    }

    // Combine product and stock data
    const product = attrValuesToProduct(
      productData.Responses[this.productsTableName][0]
    );
    product.count = Number(
      productData.Responses[this.stocksTableName][0].count.N
    );

    return product;
  }

  async create(payload: Omit<BookStock, "id">) {
    const {
      title,
      description,
      price,
      author,
      publisher,
      publicationDate,
      count,
    } = payload;
    const productData = {
      title,
      description,
      price,
      author,
      publisher,
      publicationDate,
    };
    const stockData = { count };
    const productId = uuidv4();
    const transactParams: TransactWriteItemsCommandInput = {
      TransactItems: [
        {
          Put: {
            TableName: this.productsTableName,
            Item: {
              id: { S: productId },
              title: { S: productData.title },
              description: { S: productData.description },
              price: { N: productData.price.toString() },
              author: { S: productData.author },
              publisher: { S: productData.publisher },
              publicationDate: { S: productData.publicationDate },
            },
          },
        },
        {
          Put: {
            TableName: this.stocksTableName,
            Item: {
              productId: { S: productId },
              count: { N: stockData.count.toString() },
            },
          },
        },
      ],
    };

    await this.dbClient.send(
      new TransactWriteItemsCommand(transactParams)
    );

    const createdItem: BookStock = {
      id: productId,
      ...productData,
      ...stockData,
    };

    return createdItem;
  }

  async update() {
    return Promise.reject("Method not implemented yet");
  }

  async delete() {
    return Promise.reject("Method not implemented yet");
  }
}
