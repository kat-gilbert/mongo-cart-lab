import * as functions from "firebase-functions";
import express from "express";
import cors from "cors";
import cartRoutes from "./routes/cart-items";

//import routes


const app = express();
app.use(cors());
app.use(express.json());

app.use("/", cartRoutes);


export const api = functions.https.onRequest(app);