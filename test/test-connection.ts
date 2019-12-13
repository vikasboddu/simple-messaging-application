import { createPool, PoolConfig } from 'mysql';

export default () => createPool(config);

const config: PoolConfig = {
  host: 'localhost',
  port: 3336,
  user: 'test',
  password: 'secret',
  database: 'test',
};
