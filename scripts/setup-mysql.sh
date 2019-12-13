#!/usr/bin/env bash

if ! [ $(type -P docker) ] ; then
 echo “You do not have docker in your PATH”
 exit 1
fi

docker pull mysql:5.7

INIT=$(pwd)/src/sql/migrations

docker run \
   --rm \
   --name test-db \
   --env "MYSQL_DATABASE=test" \
   --env "MYSQL_USER=test" \
   --env "MYSQL_PASSWORD=secret" \
   --env "MYSQL_ROOT_PASSWORD=secret" \
   --mount type=bind,source=${INIT},target=/docker-entrypoint-initdb.d,readonly \
   --publish 3336:3306 \
   -d mysql:5.7