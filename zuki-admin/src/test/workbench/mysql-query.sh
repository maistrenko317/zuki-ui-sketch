#!/bin/bash

INPUT_FILE=$1
mysql -u ${ZUKI_DB_USER} --password=${ZUKI_DB_PASSWORD}  -h 127.0.0.1 -P 53306 --ssl-mode=DISABLED < ${INPUT_FILE} | sed "s/'/\'/;s/\t/\",\"/g;s/^/\"/;s/$/\"/;s/\n//g"
