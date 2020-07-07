#!/bin/sh
set -e
npx tsc
npx babel --config-file=../../babel.config.js lib --out-dir dist &
set MODULES=true &
npx babel --config-file=../../babel.config.js lib --out-dir es
wait

if [ -f ./rollup.config.js ]
then
  npx rollup -c rollup.config.js
fi
