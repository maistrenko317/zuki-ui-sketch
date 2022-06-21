#!/bin/bash

#
# Specify paths for folder and files
#
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
docker run -e ZUKI_DB_URL -e ZUKI_DB_USER -e ZUKI_DB_PASSWORD  --network "host" --expose 8443 --expose 53306 zuki-admin:0.01