import {Router} from "express";
import {CartManager} from "../managers/cartManager.js";



const router = Router();



const cartManager = new CartManager("data/productos.json", "data/carrito.json");

//
router.post("/", (req,res)=>{
    const newCart = cartManager.createCart();
    res.json(newCart);
});

router.get("/:cid", (req, res)=>{
    const {cid}=  req.params;
    try{
        const cart = cartManager.getCart(Number(cid));

        if(cart){
            res.json(cart.products);
        }  else {
            res.status(404).json({ error: "Cart not found" });
        }
    }  catch (error){
        console.error("Error", error);
        res.status(500).json({ error: "Internal server error" });
    } 
});

router.post("/:cid/product/:pid", (req, res)=> {
    const { cid, pid} = req.params;
    const {quantity} = req.body;
try{
    const cart = cartManager.addProductToCart(Number(cid), Number(pid), quantity);
    res.json(cart.products);
} catch (error){
    console.error("Error", error);
    res.status(500).json({error: "Internal server error"});
}
    
});

export default router;
