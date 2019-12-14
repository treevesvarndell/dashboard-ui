#!/bin/bash

sudo lsof -ti:5000 | xargs kill

npm install -g serve
npm install
npm run build

serve -s build
