#!/bin/bash

set -e # Stops script if failure

echo "build"
npm install
npm run lint
npm run test
npm run start &
npx playwright install-deps
SERVER_PID=$! 
npm run test:e2e
kill $SERVER_PID
