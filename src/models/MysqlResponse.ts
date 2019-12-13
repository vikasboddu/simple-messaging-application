export type MysqlRawResults = any;

export interface MysqlOperationResult {
  insertId: number;
  affectedRows: number;
}
