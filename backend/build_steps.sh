#!/bin/bash

set -e # Stops script if failure

echo "build"
npm install
npm run lint
npm run test
npm run build
npm run start-prod &
SERVER_PID=$! 
npm run test:e2e
kill $SERVER_PID
