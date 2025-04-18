import mongoose from 'mongoose';

import CustomError from "../errors/customError.js";
import productModel from "../models/product.model.js";
import productTokenModel from '../models/productToken.model.js';
import { removeSpecialCharacters } from '../utils/removeSpecialCharacters.js';

export const addProduct = async (req, res, next) =>{
    try{
        const { name, price, description, image } = req.body;
        const owner = req.user.id;
        const product = await productModel.create({name, price, description, image, owner});
        res.status(201).json({sucess: true, message: "product successfully added", data: {product}});
    }catch(err){
        next(err);
    }
}

export const addMultipleProducts = async (req, res, next) => {
    try {
        const products = req.body.products; // Array of product objects
        const owner = req.user.id; 

        // Add the owner property to each product object
        const productsWithOwner = products.map(product => ({
            ...product,
            owner,
        }));

        // Insert all products into the database
        const insertedProducts = await productModel.insertMany(productsWithOwner);

        res.status(201).json({
            success: true,
            message: "Products successfully added",
            data: { products: insertedProducts },
        });
    } catch (err) {
        next(err); // Pass errors to the error-handling middleware
    }
};


export const getProduct = async (req, res, next) =>{
    try{
        if (req.params.keywords) {
            let searchQuery = req.params.keywords.replaceAll('+', ' ');
            searchQuery = removeSpecialCharacters(searchQuery).toLowerCase();
            const serachTokens = searchQuery.split(' ');
            
            //console.log("serachTokens: " + serachTokens);
            const productTokens = await productTokenModel.find();
            const tokenMatchingScore = [];
        
            productTokens.forEach((productToken) => {
                let score = 0;
        
                productToken.tokenArray.forEach((matchingValue) => {
                    if (serachTokens.includes(matchingValue)) {
                        score++;
                    }
                });
        
                tokenMatchingScore.push({ productId: productToken.productId, score });
            });
        
            // Sort in descending order by score
            tokenMatchingScore.sort((a, b) => b.score - a.score);
            //console.log("tokenMatchingScore: "+JSON.stringify(tokenMatchingScore));

            // Select the top 5 products
            //const selectedProducts = tokenMatchingScore.slice(0, 5);
            //const productIds = selectedProducts.map((product) => product.productId);
            const productIds = tokenMatchingScore.map((product) => product.productId);

            let filterObject = {};
            if(req.query){
                //console.log("query: "+JSON.stringify(req.query));

                if(req.query.name){
                    filterObject.name = { $regex: req.query.name, $options: 'i' };
                }
                if(req.query.company){
                    filterObject.company = req.query.company;
                }
                if(req.query.numericFilters){
                    console.log("req.query.numericFilters: "+req.query.numericFilters);
                    let numericFilters = req.query.numericFilters;
                    const operatorMap = {
                        '>' : '$gt',
                        '<' : '$lt',
                        '=' : '$eq',
                        '>=': '$gte',
                        '<=': '$lte',
                    }

                    const regex = /\b(<|>|>=|=|<|<=)\b/g;
                    
                    let numfilter = (numericFilters).replace(regex, (match)=>{
                        return `-${operatorMap[match]}-`;
                    });

                    console.log("numfilter: "+numfilter);
                    
                    const checkValue = ['price', 'rating'];

                    numfilter = numfilter.split(',').forEach((items)=>{
                        const [field, operator, value] = items.split('-');
                        console.log([field, operator, value]);
                        if(checkValue.includes(field)){
                            filterObject[field] = {[operator] : Number([value])};
                        }
                    });

                }
            }
            
            console.log("filterObject: "+ JSON.stringify(filterObject));
            // Retrieve the products from the database
            const products = await productModel.find({ _id: { $in: productIds }, ...filterObject });
        
            if (!products || products.length === 0) {
                throw new CustomError('No products found', 404);
            }
            
            return res.status(200).json({
                success: true,
                message: 'Products retrieved successfully',
                data: { products },
            });
        }
        const products = await productModel.find({});
        if(!products){
            throw new CustomError("No products found", 404);
        }    
        res.status(200).json({success: true, message: "products retrived successfully", data: {products}})
    }catch(err){
        next(err);
    }
}

export const deleteProduct = async (req, res, next) =>{
    try{
        const productId = req.params.productId;
        //console.log(req.user.id);
        let product = await productModel.find({_id: new mongoose.Types.ObjectId(productId), owner: new mongoose.Types.ObjectId(req.user.id)});
        //console.log(product);

        if(!product){
            throw new CustomError(`product not found with product id: ${productId}`, 404);
        }else if(product.length > 1){
            throw new CustomError('Too Many products', 400)
        }

        await productModel.deleteOne({_id: new mongoose.Types.ObjectId(productId), owner: new mongoose.Types.ObjectId(req.user.id)});

        res.status(200).json({success: true, message: `product ${product[0].name} successfully deleted`})
        
    }catch(err){
        next(err);
    }
}

export const updateProduct = async (req, res, next) =>{
    try{
        const productId = req.params.productId;
        const  product = await productModel.findOneAndUpdate({_id: new mongoose.Types.ObjectId(productId), owner: new mongoose.Types.ObjectId(req.user.id)}, req.body, {new: true, runValidators: true});
        if(!product){
            throw new CustomError("product not found", 404);
        }
        res.status(201).json({success: true, message: "product updated successfully", data: {product}});
    }catch(err){
        next(err);
    }
}