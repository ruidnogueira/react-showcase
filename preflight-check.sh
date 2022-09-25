#!/bin/bash
set -e

export CI=1

npm ci
npm run lint
npm run test
npm run e2e
npm run build

GREEN='\033[0;32m'
echo -e "\n${GREEN}preflight-check success"
