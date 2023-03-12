import { Stock } from "./stock";

// TODO: infer types from JSON schema instead?
export interface Product {
  id: string;
  title: string;
  description?: string;
  price: number;
}

export interface Book extends Product {
  author: string;
  publisher: string;
  publicationDate: string;
}

export type BookStock = Book & Omit<Stock, 'productId'>;
