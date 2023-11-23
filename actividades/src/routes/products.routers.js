import { Router } from "express";
import { ProductManager } from "../managers/productManager.js";

const router = Router();

const productManager = new ProductManager("data/productos.json");

router.get("/", async (req, res) => {
  console.log("GET /api/products");
  const { limit } = req.query;

  try {
    console.log("Getting products...");
    let products = productManager.getProducts();

    if (limit) {
      const parsedLimit = parseInt(limit, 10);
      products = products.slice(0, parsedLimit);
    }

    console.log("Sending response:", { products });
    res.json({ products });
  } catch (error) {
    console.error("Error", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:pid", (req, res) => {
  const { pid } = req.params;

  try {
    const product = productManager.getProductById(Number(pid));

    if (product) {
      res.json({ product });
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  } catch (error) {
    console.log("Error in product route:", error);
    res.status(500).json({ error: "Internal server Error" });
  }
});

// agregar productos
router.post("/", async (req, res) => {
  const product = req.body;
  try {
    const result = await productManager.addProduct(product);
    res.json(result);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//actualizacion del producto

router.put("/:pid", async (req, res) => {
  const productmodify = req.body;
  const productId = Number(req.params.pid);
  try {
    const result = await productManager.updateProduct(productId, productmodify);
    res.json({
      message: `Prduct with ID ${productId} updated successfully`,
      result,
    });
  } catch (error) {
    console.error("Error", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// eliminar productos

router.delete("/:pid", async (req, res) => {
  const productId = Number(req.params.pid);

  try {
    const result = await productManager.deleteProduct(productId);
    res.json({
      message: `Product wigt ID ${productId} deleted successfully`,
      result,
    });
  } catch (error) {
    console.error("Error", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
