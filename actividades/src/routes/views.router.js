import { Router } from "express";
import { ProductManager } from "../managers/productManager.js";

const router = Router();

const productManager = new ProductManager("./src/data/productos.json");

router.get("/home", (req, res) => {
  const products = productManager.getProducts(); // Asume que hay un método getAllProducts en tu productManager

  // Renderiza la vista home y pasa los productos como contexto
  res.render('home', { products, fileCss: "style.css" });
});

// Form
router.get("/realtimeproducts", (req, res) => {
  const products = productManager.getProducts();
  res.render("realTimeProducts", {
    title: "Real Time Products",
    filecss: "styles.css",
    products,
  });
});



export default router;