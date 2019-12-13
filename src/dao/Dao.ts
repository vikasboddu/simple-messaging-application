import { Pool } from 'mysql';
import { promisify } from 'util';
import { MysqlRawResults } from '../models/MysqlResponse';

export class Dao {
  protected executeQuery: (
    query: string,
    args?: Array<string | number>
  ) => Promise<MysqlRawResults>;

  constructor(protected connectionPool: Pool) {
    this.executeQuery = promisify(connectionPool.query).bind(
      this.connectionPool
    );
  }
}
