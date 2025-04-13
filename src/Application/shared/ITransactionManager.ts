export interface ITransactionManager {
  bigin<T>(callback: () => Promise<T>): Promise<T | undefined>;
}
