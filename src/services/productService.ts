import { IProduct, productModel } from "../models/productModel"



interface IProductInput {
    title: string;
    image: string,
    price: number,
    stock: number
}


// Retreive all products
export const getAllProducts = async() =>{
    const findAllProducts = await productModel.find();
    return {data: findAllProducts, status: 200}
}


// Create new product
export const createNewProduct = async(data: IProductInput) =>{
    const findproduct = await productModel.findOne({title: data.title});

    if(findproduct){
        return {data: "This Product already exist", status: 400}
    }

    const newP = new productModel(data);
    await newP.save();
    return {data: "Creation Success", status: 201}
}

// Get Product by ID
export const getProductById = async (id: string) => {
    const product = await productModel.findById(id);

    if (!product) {
    return { data: "Product not found", status: 404 };
    }

    return { data: product, status: 200 };
};

// Update Product
export const updateProduct = async(id: string, data:IProductInput)=>{
    const findProduct = await productModel.findById(id);

    if(!findProduct){
        return {data: "Product not found", status: 404}
    }

    const update = await productModel.findByIdAndUpdate(id,data,{returnDocument: "after"});
    return {data: update, status: 200}
}


// Delete Product
export const deleteProduct = async (id: string)=>{
    const findProduct = await productModel.findById(id);
    if(!findProduct){
        return {data: "Product not found", status: 404}
    }

    return await productModel.findByIdAndDelete(id);

}