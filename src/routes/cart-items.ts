import express from "express";
import { CartItem } from "../models/cartItems";
import { getClient } from "../db";
import { ObjectId } from "mongodb";

const cartRoutes = express.Router();

cartRoutes.get("/cart-items", async(req, res) => {
    const maxPrice: number = parseFloat(req.query.maxPrice as string);
    const product: string = req.query.product as string;
    const client = await getClient();
    let pageSize: number = parseInt(req.query.pageSize as string);

    try {
    if (maxPrice){
        let results = await client.db().collection<CartItem>('cartItems')
        .find({price: {$lte: maxPrice} }).toArray();
        res.json(results);
    }

    if (product){
        let results = await client.db().collection<CartItem>('cartItems')
        .find({product: product }).toArray();
        res.json(results);
        }
    if (pageSize){
        let results = await client.db().collection<CartItem>('cartItems')
        .find().limit(pageSize).toArray();
        res.json(results);
        }

    else {
        let results = await client.db().collection<CartItem>('cartItems').find().toArray();
        res.json(results);
    }

} catch (err) {
    console.error("ERROR", err);
    res.status(500).json({massage: "Internal Server Error"});
}
});

cartRoutes.get("/cart-items/:id", async(req, res) => {
    const client = await getClient();
    const results = await client.db().collection<CartItem>('cartItems').find().toArray();

    for (let i = 0; i < results.length; i++) {
        if ((req.params.id) === (results[i]._id).toString()) {
            res.json(results[i]);
            break;
        }
    }
    res.status(404);
    res.send({"error": "ID Not Found"});
    });

cartRoutes.post("/cart-items", async (req, res) => {
    const item = req.body as CartItem;

    const client = await getClient();
    await client.db().collection<CartItem>('cartItems').insertOne(item);
    res.status(201).json(item);
} 
)

cartRoutes.put("/cart-items/:id", async (req, res) => {
    const id = req.params.id;
    const data = req.body as CartItem;
    delete data._id;

    try {
    const client = await getClient();
    const results = await client.db().collection<CartItem>('cartItems').replaceOne({_id: new ObjectId(id)}, data);
        if (results.modifiedCount === 0) {
            res.status(404).json({message: "Not Found"});
        } else {
            data._id = new ObjectId(id);
        res.json(data)        
    }
    } catch (err) {
        console.error("ERROR", err);
        res.status(500).json({massage: "Internal Server Error"});
    }
});

cartRoutes.delete("/cart-items/:id", async function(req, res) {
    let id: string = req.params.id;

    try {
        const client = await getClient();
        const results = await client.db().collection<CartItem>('cartItems')
        .deleteOne({_id: new ObjectId(id)});
            if (results.deletedCount === 0) {
                res.status(404).json({message: "Not Found"});
        }
            else{
                res.status(204).end();
        }
    }
    catch (err) {
        console.error("ERROR", err);
        res.status(500).json({massage: "Internal Server Error"});
    }
});

export default cartRoutes;