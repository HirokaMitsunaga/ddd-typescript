import { Book } from "./Book";
import { BookId } from "./BookId/BookId";
import { Price } from "./Price/Price";
import { QuantityAvailable } from "./Stock/QuantityAvailable/QuantityAvailable";
import { Status, StatusEnum } from "./Stock/Status/Status";
import { Stock } from "./Stock/Stock";
import { StockId } from "./Stock/StockId/StockId";
import { Title } from "./Title/Title";

// nanoid() をモックする
jest.mock("nanoid", () => ({
  nanoid: () => "testIdWithExactLength",
}));

describe("Book", () => {
  //在庫用
  const stockId = new StockId("abc");
  const quantityAvailable = new QuantityAvailable(100);
  const status = new Status(StatusEnum.InStock);
  const stock = Stock.reconstruct(stockId, quantityAvailable, status);
  //Book用
  const bookId = new BookId("9784167158057");
  const title = new Title("test");
  const price = new Price({ amount: 1000, currency: "JPY" });

  describe("作成", () => {
    it("デフォルトの在庫で作成する", () => {
      const book = Book.create(bookId, title, price);
      expect(book).toBeInstanceOf(Book);
    });
    it("既存の在庫で作成する", () => {
      const stock = Stock.create();
      const book = Book.reconstruct(bookId, title, price, stock);
      expect(book).toBeInstanceOf(Book);
    });
  });

  describe("削除", () => {
    it("在庫0の状態で削除", () => {
      //在庫の初期値は０なので在庫のステータスを変えなくていい。
      const book = Book.create(bookId, title, price);
      expect(() => book.delete()).not.toThrow();
    });
  });

  describe("販売可能かどうか", () => {
    it("販売可能:在庫があり、在庫ステータスもOutOfStockでない", () => {
      const book = Book.reconstruct(bookId, title, price, stock);
      expect(() => book.isSaleable()).not.toThrow();
    });
    it("販売不可:在庫がなく、在庫ステータスもOutOfStock", () => {
      const book = Book.create(bookId, title, price);
      expect(book.isSaleable()).toBe(false);
    });
  });

  describe("increaseStock", () => {
    it("stock.increaseQuantityが呼ばれる", () => {
      const book = Book.reconstruct(bookId, title, price, stock);
      const spy = jest.spyOn(stock, "increaseQuantity");
      book.increaseStock(10);
      expect(spy).toHaveBeenCalled();
    });
  });

  describe("decreaseStock", () => {
    it("stock.decreaseQuantityが呼ばれる", () => {
      const book = Book.reconstruct(bookId, title, price, stock);
      const spy = jest.spyOn(stock, "decreaseQuantity");
      book.decreaseStock(10);
      expect(spy).toHaveBeenCalled();
    });
  });

  describe("changeTitle", () => {
    it("titleを変更する", () => {
      const book = Book.reconstruct(bookId, title, price, stock);
      const newTitle = new Title("坊ちゃん");
      book.changeTitle(newTitle);
      expect(book.title.equals(newTitle)).toBeTruthy();
    });
  });

  describe("changePrice", () => {
    it("priceを変更する", () => {
      const book = Book.reconstruct(bookId, title, price, stock);
      const newPrice = new Price({
        amount: 880,
        currency: "JPY",
      });
      book.changePrice(newPrice);
      expect(book.price.equals(newPrice)).toBeTruthy();
    });
  });
});
