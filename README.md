# Boilerplate for NodeJs HTTP + Websocket back-ends

## Set up

### environment variables

Create a .env file in the root directory with the following variables for mongodb:
DB_NAME
DB_URL
DB_PORT

### Launch the mongo service

Make sure to have the mongo service up and running.
For more information check out the following link: https://docs.mongodb.com/manual/installation/

## Launching the server :rocket:

After creating the .env file and launching the mongo service just run `npm server` to launch the server!

### Notes :orange_book:

Babel is used to work with es6 in a Node environment. The only file containing old syntax is server/index.js which contains the `@babel/register` command.

Jest was chosen as a testing framework because it is easy to set up and already includes the necessary mocking and asserting functions.
All services and models are fully tested with 100% test coverage.

This project contains a demo model, controller and service to show how it would work on production.
