#!/bin/bash

#
# Specify paths for folder and files
#
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
TARGET_DIR="${SCRIPT_DIR}/target"
ARTIFACT="${TARGET_DIR}/zuki-admin.jar"
POM="${SCRIPT_DIR}/pom.xml"
DOCKER_FILE=${SCRIPT_DIR}/Dockerfile
DOCKER_IMAGE_TAG="zuki-admin:0.05"
DOCKER_REGISTRY="zuki-scm.shoutgameplay.com:5000"
DOCKER_IMAGE_REMOTE_TAG="${DOCKER_REGISTRY}/${DOCKER_IMAGE_TAG}"
#
# Build service
#
mvn -f ${POM} clean compile package

#
# Wipes all docker images
#
IMAGE_ID=$(docker image ls | grep 'zuki-admin' | awk '{print $3}')
docker image rmi ${IMAGE_ID}

#
# Build docker images
#
docker build $DOCKER_OPTS -t "${DOCKER_IMAGE_REMOTE_TAG}" --file "${DOCKER_FILE}" --pull=false  .

echo "FjClPWK4e6yHpaC4a2PcVk40s2sASyLwJJHkQd26" | docker login ${DOCKER_REGISTRY} --username zuki --password-stdin
docker push ${DOCKER_IMAGE_REMOTE_TAG}