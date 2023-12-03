import {Router} from "express";
import {CartManager} from "../managers/cartManager.js"
import{ProductManager} from "../managers/productManager.js";



const router = Router();



const cartManager = new CartManager("./src/data/carrito.json");
const productManager = new ProductManager("./src/data/productos.json")

//

router.post("/", async (req,res)=>{
    try {
        const newCart = await cartManager.addCart();
        res.json(newCart);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
});

router.get("/:cid", (req, res)=>{
  try {
    const { cid } = req.params;
    console.log(`Attempting to get products for cart with ID ${cid}`);
    const productsInCart = cartManager.getProducts(Number(cid));
    console.log(`Products in cart with ID ${cid}:`, productsInCart);
    
    // Verifica si se encontraron productos en el carrito o no
    if (productsInCart.length > 0) {
      res.json(productsInCart);
    } else {
      res.status(404).json({ error: "Carrito no encontrado o vacío" });
    }
  } catch (err) {
    console.error("Error en la ruta GET /api/carts/:cid", err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/:cid/product/:pid",async (req, res)=> {
  try {
    const { cid, pid } = req.params;
    const product = productManager.getProductById(Number(pid));

    if (product === 'Not found') {
      return res.status(404).json({ error: "Producto no presente en la base de datos" });
    }

    const addedProduct = await cartManager.addProductsToCart(Number(cid), Number(pid));

    if (addedProduct?.error) {
      return res.status(404).json(addedProduct.error);
    }

    res.status(200).json(addedProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
