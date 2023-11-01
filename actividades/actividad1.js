class ProductManager {

    constructor () {
        this.products = [];
        this.nextProductId = 1;
    }

    addProduct(product) {
        //busca que todos los campos sean obligatorios
        if(!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock){
            console.log("Error: Todos los campos son obligatorios");
            return;
        }
        // busca que el code no se repita
        if(this.products.some((p)=> p.code === product.code)) {
            console.log("Error: El codigo ya existe");
            return;
        }

        // Id autoincrementable
        product.id = this.nextProductId++;
        //se agrega al array de products
        this.products.push(product);

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


const productManager = new ProductManager();

const product1 = {
    title: "Producto 1",
    description: "Descripción del producto 1",
    price: 100,
    thumbnail: "imagen1.jpg",
    code: "P001",
    stock: 10,
};

const product2 = {
    title: "Producto 2",
    description: "Descripción del producto 2",
    price: 150,
    thumbnail: "imagen2.jpg",
    code: "P002",
    stock: 20,
};

productManager.addProduct(product1);
productManager.addProduct(product2);

console.log("Todos los productos:", productManager.getProducts());

const foundProduct = productManager.getProductById(1);
console.log("Producto encontrado:", foundProduct);

const foundProduct2 = productManager.getProductById(2);
console.log("Producto encontrado:", foundProduct2);

const notFoundProduct = productManager.getProductById(3);

