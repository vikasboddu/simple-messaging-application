Docker needs to be installed and in terminal path

- `./scripts/setup-mysql.sh` to start local database
- `yarn install`
- `yarn build`
- `yarn start`
- `./scripts/teardown-mysql.sh` 

- `yarn test` needs to be run when the local database is down. The test DB is using the same config as the local DB