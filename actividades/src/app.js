import express from "express";
import  {ProductManager} from "./productManager.js";

const app = express ();

const PORT = 8080;

const productManager = new ProductManager('productos.json');


app.use(express.urlencoded({ extended: true }));


app.get("/", async (req, res)=> {

    res.send ("Bienvenidos a mi server con express!!");

});

// muestra los productos en formato json
app.get("/products",  async (req, res)=> {

    const { limit } = req.query;
    

	try{	
		console.log("Getting products...");
		let products =  productManager.getProducts();

		if (limit) {
			const parsedLimit = parseInt(limit, 10);
			products = products.slice(0, parsedLimit);
			console.log("en limit");
		}
			console.log("sin limit");
			console.log("Sending response:", { products });
			res.json({ products });

	} catch (error){
        console.error("Unhandled error:", error);
		res.json({error: "Internal server error"})
	}
    

});

// muestra los productos por id, por parametros
app.get("/products/:pid",  (req, res)=> {

    const { pid } = req.params;
    
    
    try {
        const product = productManager.getProductById(Number(pid));

        if (product) {
            res.json({ product });
        } else {
            res.json({ error: "Product not found" });
        }
    } catch (error) {
        console.error("Error in /products route:", error);
        res.json({ error: "Internal Server Error" });
    }

});

import {test} from './productManager.js';

app.listen(PORT, ()=> console.log(`Server listening on port ${PORT}`));


/* test(); */
