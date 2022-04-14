#! /usr/bin/env node
const { readFileSync, writeFileSync } = require('fs');
const path = require('path');

const reg = new RegExp(/\[[.\s\S]*\]/);

const replaceWorkspaces = (workspacesList, pathToPackageJson) => {
  let packageJsonData = readFileSync(pathToPackageJson).toString();
  const match = packageJsonData.match(reg)[0];
  packageJsonData = packageJsonData.replace(match, JSON.stringify(workspacesList));
  writeFileSync(pathToPackageJson, packageJsonData, { encoding: 'utf-8' });
};

const workspaces = {
  apiGateway: 'website/api-gateway',
  dataStorage: 'website/data-storage',
  eventsListener: 'website/events-listener',
  frontend: 'website/frontend',
  testBalance: 'website/test-balance',
  interfaces: 'website/interfaces',
  jsonrpcErrors: 'website/jsonrpc-errors',
};

const args = process.argv.slice(2);
const pathToPackageJson = path.resolve(args[1]);
const serviceName = args[0];
let neccessary = undefined;
switch (serviceName) {
  case 'data-storage':
    neccessary = [workspaces.dataStorage, workspaces.interfaces, workspaces.jsonrpcErrors];
    break;
  case 'api-gateway':
    neccessary = [workspaces.apiGateway, workspaces.interfaces, workspaces.jsonrpcErrors];
    break;
  case 'events-listener':
    neccessary = [workspaces.eventsListener, workspaces.interfaces];
    break;
  case 'test-balance':
    neccessary = [workspaces.testBalance, workspaces.jsonrpcErrors];
    break;
  case 'frontend':
    neccessary = [workspaces.frontend];
    break;
  case 'backend':
    neccessary = Object.values(workspaces).filter((value) => value === workspaces.frontend);
    break;
  case 'all':
    neccessary = Object.values(workspaces);
    break;
}

replaceWorkspaces(neccessary, pathToPackageJson);
