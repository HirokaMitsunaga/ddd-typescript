import { ITransactionManager } from "Application/shared/ITransactionManager";
import { Book } from "Domain/models/Book/Book";
import { BookId } from "Domain/models/Book/BookId/BookId";
import { IBookRepository } from "Domain/models/Book/IBookRepository";
import { Price } from "Domain/models/Book/Price/Price";
import { Title } from "Domain/models/Book/Title/Title";
import { ISBNDuplicationCheckDomainService } from "Domain/services/Book/ISBNDuplicationCheckDomainService/ISBNDuplicationCheckDomainService";

export type RegisterBookCommand = {
  isbn: string;
  title: string;
  priceAmount: number;
};

export class RegisterBookApplicationService {
  constructor(
    private bookRepository: IBookRepository,
    private transactionManager: ITransactionManager
  ) {}

  async execute(commnad: RegisterBookCommand): Promise<void> {
    await this.transactionManager.begin(async () => {
      const isDuplicateISBN = await new ISBNDuplicationCheckDomainService(
        this.bookRepository
      ).execute(new BookId(commnad.isbn));
      if (isDuplicateISBN) {
        throw new Error("すでに存在する書籍です");
      }

      const book = Book.create(
        new BookId(commnad.isbn),
        new Title(commnad.title),
        new Price({ amount: commnad.priceAmount, currency: "JPY" })
      );
      await this.bookRepository.save(book);
    });
  }
}
