<p align="center">
  <a href="https://gear-tech.io">
    <img src="https://github.com/gear-tech/gear/blob/master/images/logo-grey.png" width="400" alt="GEAR">
  </a>
</p>
<p align=center>
    <a href="https://github.com/gear-tech/gear-js/blob/master/LICENSE"><img src="https://img.shields.io/badge/License-GPL%203.0-success"></a>
</p>
<hr>

## Description
This microservice is part of Gear Idea portal which is responsible for indexing Gear network and storing program and message data, as well as storing program metadata.

## Prerequisites
1. Install and run [RabbitMQ server](https://www.rabbitmq.com/#getstarted)
2. Install [PostgreSQL](https://www.postgresql.org/docs/15/tutorial-install.html) and create a database

## Usage
1. Specify environment variables in `.env` file. Example is in `.env.example` file
2. Run `yarn install` to install dependencies
3. Build the package using `yarn build` command
4. Run using `yarn start` command

