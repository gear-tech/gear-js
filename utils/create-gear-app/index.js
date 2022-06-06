#!/usr/bin/env node

'use strict';

const spawn = require('cross-spawn');

const args = process.argv.slice(2);
const [folder] = args;

const npxArgs = ['create-react-app', folder || 'gear-app', '--template', '@gear-js/cra-template-gear-app'];

spawn('npx', npxArgs, { stdio: 'inherit' });
