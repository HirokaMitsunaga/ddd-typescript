import { BookId } from "Domain/models/Book/BookId/BookId";

export class ISBNDuplicationCheckDomainService {
  async execute(isbn: BookId): Promise<boolean> {
    // 本来は、データベースに問い合わせて重複があるか確認する。この章では省略。
    const isDuplicateISBN = false;

    return isDuplicateISBN;
  }
}
