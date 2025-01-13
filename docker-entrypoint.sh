#!/usr/bin/env bash
set -ue pipefail

while true; do
  cd /equinoxe/api
  git pull
  cd src
  npm install
  node index.js
  sleep 5
done
