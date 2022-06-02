#!/usr/bin/env node

'use strict';

const args = process.argv.slice(2);
const [folder] = args;

const spawn = require('cross-spawn');
const npxArgs = ['create-react-app', folder || 'gear-app', '--template', 'create-gear-app'];

spawn('npx', npxArgs, { stdio: 'inherit' });
