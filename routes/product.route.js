import express from 'express';

import { addMultipleProducts, addProduct, deleteProduct, getProduct, updateProduct } from "../controllers/product.controller.js";
import { auntheticationMiddleware } from '../middlewares/auntheticationMiddleware.js';

const productRouter = express.Router();

productRouter.get('/:keywords', getProduct);
productRouter.get('/', getProduct);
productRouter.post('/', auntheticationMiddleware, addProduct);
productRouter.post('/products', auntheticationMiddleware, addMultipleProducts);
productRouter.patch('/:productId', auntheticationMiddleware, updateProduct);
productRouter.delete('/:productId', auntheticationMiddleware, deleteProduct);

export default productRouter;

