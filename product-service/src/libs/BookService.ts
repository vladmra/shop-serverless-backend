import { Book } from "src/model/product";

// TODO: replace later with db interface or something relevant
type DataSource = () => Promise<Array<Book>>;

export class BookService {
  constructor(private dataSource: DataSource) {
    this.dataSource = dataSource;
  }

  async getBooks(): Promise<Array<Book>> {
    return this.dataSource();
  }

  async getBookById(productId: number): Promise<Book | undefined> {
    const products = await this.dataSource();
    return products.find((product) => product.id === productId);
  }
}
