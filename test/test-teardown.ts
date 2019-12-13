import { promisify } from 'util';
import { exec } from 'child_process';

const teardown = async () => {
  const execute = promisify(exec);

  console.log('Tearing down database...');

  return execute('sh ./scripts/teardown-mysql.sh');
};

export default teardown;
