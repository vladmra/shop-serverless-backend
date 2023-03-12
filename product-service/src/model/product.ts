export interface Product {
  id: number;
  title: string;
  description?: string;
  price: number;
}

export interface Book extends Product {
  author: string;
  publisher: string;
  publicationDate: string;
}
