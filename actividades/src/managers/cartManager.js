import fs from "fs";
import path from "path";

class CartManager{
    constructor(productsPath, cartsPath){
        this.productsPath = productsPath;
        this.cartsPath = cartsPath;
    
        if (fs.existsSync(productsPath) && fs.existsSync(cartsPath)) {
            try {
                let datacart = fs.readFileSync(cartsPath, "utf-8");
                let dataProduct = fs.readFileSync(productsPath, "utf-8");
                this.carts = JSON.parse(datacart);
                this.products = JSON.parse(dataProduct);
                console.log("Products loaded:", this.products);
            } catch (error) {
                this.products = [];
                console.error("Error reading products file:", error);
                console.error("Products path:", productsPath);
                console.error("Carts path:", cartsPath);
            }
        } else {
            this.products = [];
            this.carts = [];
        }
    }
    
    async saveCarts(){
        try{
            await fs.promises.writeFile(
                this.cartsPath, JSON.stringify(this.carts, null, "\t")
            );
        } catch(error){
            console.error("Error saving carts file:", error);
        }
    }

    createCart(){
        const newCart = {
            id: this.generateUniqueId(),
            products: [],
        }
        this.carts.push(newCart);
        this.saveCarts();
        return newCart;
    }

    getCart(cartId){
        return this.carts.find((cart)=> cart.id === cartId);
    }

    async addProductToCart(cartId, productId, quantity = 1){
        const cart =this.getCart(cartId);
        const productIndex = cart.products.findIndex((item)=> item.product === productId);

        if(productIndex !== -1){
            // 
            cart.products[productIndex].quantity += quantity;
        } else {
            //
            cart.products.push({
                product: productId,
                quantity,
            });
        }
        await this.saveCarts();
        return cart;
    }

    generateUniqueId(){
        const existingIds = this.carts.map((cart)=> cart.id);
        let newId = 1;
        while(existingIds.includes(newId)){
            newId += 1;
        }
        return newId;
    }

}


export {CartManager};

