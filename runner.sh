#!/bin/bash

echo "Enter d for dev and p for production"
read mode
[[ $mode = d* ]] && npm run dev
[[ $mode = p* ]] && npm start
