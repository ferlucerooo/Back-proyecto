const fs = require ('fs');

class ProductManager {

    constructor (path) {
        this.nextProductId = 1;
        this.path = path;
        if (fs.existsSync(path)){
            try {
                let dataProduct = fs.readFileSync(path, "utf-8");
                this.products = JSON.parse(dataProduct);
                this.nextProductId = this.getNextProductId(this.products);
            } catch (error){
                this.products = [];
            }
        } else {
            this.products = [];
        }
    }

    async saveFile(data){
        try{
            await fs.promises.writeFile(
                this.path, JSON.stringify(data, null ,"\t")
            );
            return true;
        }catch (error){
            console.log(error);
            return false;
        }
    }

    async addProduct(product) {
        const {title, description, price, thumbnail, code, stock} = product;
        //busca que todos los campos sean obligatorios
        if(!title || !description || !price || !thumbnail || !code || !stock){
            console.log("Error: Todos los campos son obligatorios");
            return;
        }
        // busca que el code no se repita
        if(this.products.some((p)=> p.code === code)) {
            console.log("Error: El codigo ya existe");
            return;
        }
        const newProduct = new Product(title, description, price, thumbnail, code, stock);
        // Id autoincrementable
        newProduct.id = this.nextProductId++;
        //se agrega al array de products
        this.products.push(newProduct);
        // Guarda los cambios en el arcgivo
        await this.saveFile(this.products);
    }

    async updateProduct (id, updatedProduct){
        const productIndex = this.products.findIndex((p)=> p.id === id);
        if(productIndex !== -1){
            this.products[productIndex] = {
                ...this.products[productIndex], ...updatedProduct};
                await this.saveFile(this.products);
            } 
        }
    async deleteProduct (id){
        const productIndex = this.products.findIndex((p)=> p.id === id);
        if(productIndex !== -1){
            this.products.splice(productIndex, 1);
            await this.saveFile(this.products);
        }
    }

    getProducts() {
        return this.products;
    }

    getProductById (id){
        const product = this.products.find((p)=> p.id === id);
        if(product){
            return product;
        } else {
            console.log(`Error: Producto ${id} no encontrado`);
        }
    }
}

class Product {
    constructor (title, description , price, thumbnail, code, stock) {
        this.title = title;
        this.description = description;
        this.price = price;
        this.thumbnail = thumbnail;
        this.code = code;
        this.stock = stock;
    }
}


const productManager = new ProductManager('productos.json');

//test
productManager.addProduct({
    title: "Producto 1",
    description: "Descripcion del producto 1",
    price: 100,
    thumbnail: "imagen1.jpg",
    code: "P001",
    stock: 10
});
productManager.addProduct({
    title: "Producto 2",
    description: "Descripcion del producto 2",
    price: 150,
    thumbnail: "imagen2.jpg",
    code: "P002",
    stock: 20
});
productManager.addProduct({
    title: "Producto 3",
    description: "Descripcion del producto 3",
    price: 200,
    thumbnail: "imagen3.jpg",
    code: "P003",
    stock: 30
});

console.log("Todos los productos:", productManager.getProducts());

const foundProduct = productManager.getProductById(1);
console.log("Producto encontrado 1:", foundProduct);

const foundProduct2 = productManager.getProductById(2);
console.log("Producto encontrado 2:", foundProduct2);

const foundProduct3 = productManager.getProductById(3);
console.log("Producto encontrado 3:", foundProduct3);

const notFoundProduct = productManager.getProductById(4);
console.log("Producto 4 no encontrado ", notFoundProduct);

// actualiza el producto
productManager.updateProduct(1, {price: 300, stock: 300});
console.log("Producto 1 actualizado:",productManager.getProductById(1));

// elimina 1 producto

productManager.deleteProduct(2);
console.log("Producto 2 eliminado");

console.log("Todos los productos estan actualizados", productManager.getProducts());

