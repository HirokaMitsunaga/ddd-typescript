import { BookId } from "Domain/models/Book/BookId/BookId";
import { IBookRepository } from "Domain/models/Book/IBookRepository";

export class ISBNDuplicationCheckDomainService {
  constructor(private readonly iBookRepository: IBookRepository) {}
  async execute(isbn: BookId): Promise<boolean> {
    //DBに問い合わせて重複があるかを確認する
    return (await this.iBookRepository.find(isbn)) !== null;
  }
}
