import databaseConnection from '../database/connection';
import { getServer, initializeServer } from './server';

const server = getServer();
initializeServer(server);
