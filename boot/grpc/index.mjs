/* grpc services */
import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';

// import functions
import {init} from './services/auth.mjs'
import { fileURLToPath } from "url";
import path, { dirname } from "path";
const __dirname = dirname(fileURLToPath(import.meta.url));

// Load the generated proto file
const packageDefinition = protoLoader.loadSync(__dirname + '/protos/auth.proto', {
    keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
 });
const grpcObject = grpc.loadPackageDefinition(packageDefinition).helloworld;

// Create a gRPC server
const serverGrpc = new grpc.Server();
const authenticationService = grpcObject.AuthenticationService.service;

serverGrpc.addService(authenticationService, { 
    init
 });

var grpcClient = {}
const initializeGrpc = () => {
    
    // Start the gRPC server
    serverGrpc.bindAsync(process.env.GRPC_URL_SERVER, grpc.ServerCredentials.createInsecure(), (err, port) => {
        if (err) {
            console.error('Failed to bind gRPC server:', err);
            return;
        }
        console.log('gRPC server is running on port', port);
        serverGrpc.start();
    });

    grpcClient = new grpcObject.AuthenticationService(process.env.GRPC_URL_CLIENT, grpc.credentials.createInsecure());
  
}

export {
    initializeGrpc,
    grpcClient
}