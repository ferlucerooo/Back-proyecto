import fs from "fs";

class CartManager{
    constructor(productsPath, cartsPath){
        this.productsPath = productsPath;
        this.cartsPath = cartsPath;
        this.carts = this.loadCarts();
    }
    loadCarts(){
        try{
            const cartsData = fs.readFileSync(this.cartsPath, "utf-8");
            return JSON.parse(cartsData);
        } catch (error){
            console.error("Error reading carts file:", error);
            return [];
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

