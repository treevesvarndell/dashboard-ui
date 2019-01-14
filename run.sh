#!/bin/bash

npm install -g serve
npm install
npm run build
serve -s build
