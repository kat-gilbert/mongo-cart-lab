import * as functions from "firebase-functions";
import { MongoClient } from "mongodb";

const uri: string = functions.config().mongodb.uri;
// going to functions and taking mongodb.uri connection string from .runtimecongif.json hidden file

const client:MongoClient = new MongoClient(uri);

export const getClient = async () => {
    await client.connect();
    return client;
};