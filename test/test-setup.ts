import { promisify } from 'util';
import { exec } from 'child_process';

import create from './test-connection';

const setup = async () => {
  const execute = promisify(exec);

  console.log('\nSetting up database...');

  return execute('sh ./scripts/setup-mysql.sh').then(
    () =>
      // keep querying DB until it is successful
      new Promise(resolve => {
        // @ts-ignore
        const tryConnect = (re: { (value?: unknown): void; (): any }) => {
          const conn = create();
          const query = promisify(conn.query).bind(conn);
          return (
            query('SELECT * FROM users;')
              // on success, close connection and resolve promise
              .then(() => (conn.end(), re()))
              .catch(
                // on error, close connection, wait 1 sec and retry
                () => (conn.end(), setTimeout(tryConnect.bind(null, re), 1000))
              )
          );
        };
        tryConnect(resolve);
      })
  );
};

export default setup;
