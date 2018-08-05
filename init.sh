#!/bin/bash

while getopts t:a:s:r:v:h:m: option
do
case "${option}"
  in
  t) RUNTYPE=${OPTARG};; # localhost, production
  a) AWS_ACCESS_KEY=${OPTARG};; # optional - required production
  s) AWS_SECRET_KEY=${OPTARG};; # optional - required production
  r) REPO=${OPTARG};; # optional
  v) TAG_VERSION=${OPTARG};; # optional
  h) SSH_PORT=${OPTARG};; # optional
  m) MYSQL_PORT=${OPTARG};; # optional
  esac
done

# START SCRIPTS
if [ -z "$*" ] ; then
  echo "Please, insert an args / -t runtype"
  exit 1
else
  echo "### START PROCESS : ${RUNTYPE}"
  # set repo
  if [ "${RUNTYPE}" == "local" ] ; then
    REPO="app"
    TARGET_FOLDER="localhost"
  elif [ "${RUNTYPE}" == "prod" ] ; then
    REPO="***.ecr.ap-northeast-1.amazonaws.com"
    TARGET_FOLDER="production"
  fi
  echo "#### REPO : ${REPO}"

  # set repo
  if [ "" == "${TAG_VERSION}" ] ; then
    TAG_VERSION="init"
  fi
  echo "#### TAG_VERSION : ${TAG_VERSION}"

  # DEFAULT SSH PORT IS 50
  if [ "" == "${SSH_PORT}" ] ; then
    SSH_PORT="50"
  fi
  echo "#### ssh port : ${SSH_PORT}"

  # DEFAULT MYSQL PORT IS 3307
  if [ "" == "${MYSQL_PORT}" ] ; then
    MYSQL_PORT="3310"
  fi
  echo "#### mysql port : ${MYSQL_PORT}"

  if [ "${RUNTYPE}" == "local" ] ; then
    # react-typescript
    rm -rf express/server express/dist docker/app/${TARGET_FOLDER}/app docker/nginx/${TARGET_FOLDER}/html/static
    mkdir -p docker/app/${TARGET_FOLDER}/app docker/nginx/${TARGET_FOLDER}/html/static
    cd react-typescript
    yarn install
    yarn run ssr:localhost-deploy
    cd ..

    # static
    cp -R express/dist/static docker/nginx/${TARGET_FOLDER}/html

    # server
    cp express/package.json docker/app/${TARGET_FOLDER}/app/package.json
    cp express/assets.json docker/app/${TARGET_FOLDER}/app/assets.json
    cp express/manifest.json docker/app/${TARGET_FOLDER}/app/manifest.json
    cp express/sw.js docker/app/${TARGET_FOLDER}/app/sw.js
    cp -R express/pm2 docker/app/${TARGET_FOLDER}/app/pm2
    cp -R express/server docker/app/${TARGET_FOLDER}/app/server
    
    # docker local start

    # express

  elif [ "${RUNTYPE}" == "prod" ] ; then
    if [ "" == "${AWS_ACCESS_KEY}" ] && [ "" == "${AWS_SECRET_KEY}" ] ; then
      echo "there is no AWS Keys -a, -s args: access_key and secret_key"
      exit 1
    else
      # react-typescript
      rm -rf express/server express/dist docker/nginx/${TARGET_FOLDER}/html/app
      # express

    fi
  else
    echo "there is no -t args: localhost, production"
  fi
  echo "### END PROCESS : ${RUNTYPE}"
fi
