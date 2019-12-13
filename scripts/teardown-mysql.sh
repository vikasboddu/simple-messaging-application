#!/usr/bin/env bash

if ! [ $(type -P docker) ] ; then
 echo “You do not have docker in your PATH”
 exit 1
fi

docker kill test-db