import fs from 'fs';


class ProductManager {

    constructor (path) {
        this.nextProductId = 1;
        this.path = path;
        console.log("ProductManager constructor called with path:", this.path);
        if (fs.existsSync(path)){
            try {
                let dataProduct = fs.readFileSync(path, "utf-8");
                this.products = JSON.parse(dataProduct);
                this.nextProductId = this.getNextProductId(this.products);
            } catch (error){
                this.products = [];
                console.error("Error reading products file:", error);
            }
        } else {
            this.products = [];
        }
    }

    async saveFile(data){
        try{
            console.log("Saving file:", this.path);
            console.log("Data to save:", data);
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
            console.log("Error: Producto no encontrado");
        }
    }
    getNextProductId(products) {
        // Verifica si no hay productos o si el array de productos está vacío
        if (!products || products.length === 0) {
            // Si no hay productos, devuelve 1 como el próximo ID
            return 1;
        }
        // Si hay productos en el array, encuentra el ID más grande
        const maxId = products.reduce((max, product) => {
            // Compara cada ID de producto con el valor máximo actual
            // y devuelve el nuevo valor máximo
            if (product.id > max) {
                return product.id;
            } else {
                return max;
            }
        }, 0);
        // Devuelve el próximo ID disponible, que es el máximo encontrado más 1
        return maxId + 1;
    }
};

export  {ProductManager};


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


//test
const test = async () => {
    const productManager = new ProductManager('productos.json');
// agregamos productos 

await productManager.addProduct({
    title: "Producto 1",
    description: "Descripcion del producto 1",
    price: 100,
    thumbnail: "imagen1.jpg",
    code: "P001",
    stock: 10
});
await productManager.addProduct({
    title: "Producto 2",
    description: "Descripcion del producto 2",
    price: 150,
    thumbnail: "imagen2.jpg",
    code: "P002",
    stock: 20
});
await productManager.addProduct({
    title: "Producto 3",
    description: "Descripcion del producto 3",
    price: 200,
    thumbnail: "imagen3.jpg",
    code: "P003",
    stock: 30
});
await productManager.addProduct({
    title: "Producto 4",
    description: "Descripcion del producto 4",
    price: 400,
    thumbnail: "imagen4.jpg",
    code: "P004",
    stock: 40
});
await productManager.addProduct({
    title: "Producto 5",
    description: "Descripcion del producto 5",
    price: 500,
    thumbnail: "imagen5.jpg",
    code: "P005",
    stock: 50
});
await productManager.addProduct({
    title: "Producto 6",
    description: "Descripcion del producto 6",
    price: 600,
    thumbnail: "imagen6.jpg",
    code: "P006",
    stock: 60
});
await productManager.addProduct({
    title: "Producto 7",
    description: "Descripcion del producto 7",
    price: 700,
    thumbnail: "imagen7.jpg",
    code: "P007",
    stock: 70
});
console.log("Todos los productos:", productManager.getProducts());

const foundProduct = productManager.getProductById(1);
console.log("Producto encontrado:", foundProduct);

const foundProduct2 = productManager.getProductById(2);
console.log("Producto encontrado:", foundProduct2);

const foundProduct3 = productManager.getProductById(3);
console.log("Producto encontrado:", foundProduct3);

const notFoundProduct = productManager.getProductById(8);
console.log("Producto no encontrado", notFoundProduct);

// actualiza el producto
/* await productManager.updateProduct(1, {price: 300, stock: 300});
console.log("Producto 1 actualizado:",productManager.getProductById(1)); */

// elimina 1 producto

/* await productManager.deleteProduct(2);
console.log("Producto 2 eliminado"); */

console.log("Todos los productos estan actualizados", productManager.getProducts());
};
//ejecutamos los test 
export {test};






