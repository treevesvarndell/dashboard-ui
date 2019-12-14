#!/bin/bash

pgrep -f node | xargs kill

npm install -g serve
npm install
npm run build

serve -s build
