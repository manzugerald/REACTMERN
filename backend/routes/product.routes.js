import express from 'express';
import mongoose from 'mongoose';
import Product from '../models/product.model.js';
const router = express.Router();

router.post("/", async (req, res)=>{
    const product = req.body; //user will send this data

    if (!product.name || !product.price || !product.image){
        return res.status(400).json({ success: false, message: "please provide all fields"});
    }

    const newProduct = new Product(product)
    try {
        await newProduct.save();
        res.status(201).json({ success: true, data: newProduct});
    } catch (error){
        console.error("Error in Create product:", error.message);
        res.status(500).json({ success: false, message: "Server Error"});
    }
});

router.get("/", async (req, res) =>{
    try {
        const products = await Product.find({});
        res.status(200).json({success: true, data: products})
    } catch (error){
        console.log("Error in fetching products:", error.message)
;  
res.status(500).json({success: false, message: "Server Error"});
}
});

router.delete("/:id", async (req, res)=> {
    const { id } = req.params;
    try {
        await Product.findByIdAndDelete(id);
        res.status(200).json({success:true, message: `The product with an ID: ${id} has been deleted`});
    } catch (error) {
        console.log("Error in deleting product: ", error.message);
        res.status(404).json({success: false, message: `There is no product with an id of ${id}`})
    }
});

router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const product = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({success:false, message:"Invalid Product ID"});
    }
    try {
        const updatedProduct = await Product.findByIdAndUpdate(id, product, {new:true});
        console.log(`The product with an ID of ${id} has been successfully updated`);
        res.status(200).json({success: true, data: updatedProduct})
    } catch(error) {
        console.log("The product could not be updated",error.message);
        res.status(500).json({success: false, message: "Internal Server Error"});
    }
});



export default router;