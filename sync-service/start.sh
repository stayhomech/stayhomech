#!/usr/bin/env bash

if [ -f "/api/key.txt" ]; then
  export STAYHOME_API_TOKEN=$(cat /api/key.txt)
else
  echo "api key file not found"
  exit 1
fi

java -Djava.security.egd=file:/dev/./urandom -jar app.jar
