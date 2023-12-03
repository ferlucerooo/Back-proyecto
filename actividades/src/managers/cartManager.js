import fs from "fs";

class CartManager {
  constructor(path) {
    this.path = path;
    this.carts = this.getCarts();

  }

  async getCarts() {
    try {
      const fileContent = await fs.promises.readFile(this.path);
      this.carts = JSON.parse(fileContent);
      return this.carts || [];  // Devolver un array vacío si this.carts es undefined
  } catch (error) {
      console.error('Error reading carts file:', error);
      return [];
  }
  }

  async addCart() {
    const cart = new Cart();
  cart.id = this.carts.length === 0 ? 1 : this.carts[this.carts.length - 1].id + 1;
  cart.products = [];
  this.carts.push(cart);
  await fs.promises.writeFile(this.path, JSON.stringify(this.carts));
  return cart;
  }

  getProducts(id) {
    const cart = this.carts.find((e) => e.id === id);
    if (cart && cart.products && Array.isArray(cart.products)) {
      console.log(`Products found in cart ${id}:`, cart.products);
      return cart.products;
    } else {
      console.log(`Cart with ID ${id} not found or empty. Cart:`, cart);
      return [];
    }
  }

  async addProductsToCart(cartId, productId) {
     // Buscar el carrito correspondiente al ID
     let cartIndex = this.carts.findIndex(element => element.id == cartId);
     console.log('cartIndex:', cartIndex);  // Agrega este log
     if (cartIndex === -1) {
         return { error: "Carrito inexistente" };
     }
 
     let cart = this.carts[cartIndex];

     if (!Array.isArray(cart.products)) {
      console.error('Products array is not defined or not an array.');
      return { error: 'Products array is not defined or not an array.' };
  }
 
     // Verificar si el producto ya existe en el carrito
     let existingProductIndex = cart.products.findIndex(element => element.product == productId);
 
     if (existingProductIndex === -1) {
         // Si el producto no existe en el carrito, agregarlo con cantidad 1
        
         cart.products.push({ "product": productId, "quantity": 1 });
     } else {
         // Si el producto ya existe, incrementar la cantidad
         cart.products[existingProductIndex].quantity += 1;
     }
 
     // Actualizar el carrito en la lista de carritos
     this.carts[cartIndex] = cart;
 
     // Escribir la lista actualizada de carritos en el archivo
     await fs.promises.writeFile(this.path, JSON.stringify(this.carts));
 
     // Devolver el carrito actualizado
     return this.carts[cartIndex];



    /* const cartIndex = this.carts.findIndex((e) => e.id === cartId);
  
    if (cartIndex === -1) {
      console.log(`Cart with ID ${cartId} not found`);
      return { error: "Nonexistent cart" };
    }
  
    const cart = this.carts[cartIndex];
  
    console.log(`Cart before operation:`, cart);
  
    if (!cart.products.find((e) => e.product === productId)) {
      console.log(`Adding product ${productId} to cart ${cartId}`);
      cart.products.push({ product: productId, quantity: 1 });
    } else {
      console.log(`Incrementing quantity for product ${productId} in cart ${cartId}`);
      const existingProduct = cart.products.find((e) => e.product === productId);
      existingProduct.quantity += 1;
    }
  
    this.carts[cartIndex] = cart;
    await fs.promises.writeFile(this.path, JSON.stringify(this.carts));
    console.log(`Cart after operation:`, cart);
    return cart; */
  }
}

class Cart {
  constructor() {
    this.products = [];
  }
}

export { CartManager };