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
    rm -rf express/server express/dist docker/app/${RUNTYPE}/app docker/nginx/${TARGET_FOLDER}/html/static
    cp -R express docker/app/${RUNTYPE}/app
    cp -R express docker/nginx/${RUNTYPE}/html/static
    rm -rf docker/app/${RUNTYPE}/app/dist
    
    echo "come here"
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
