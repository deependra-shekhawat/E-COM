import mongoose from "mongoose";

const productTokenSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product',
        required: true,
    },
    tokenArray: [{
        type: String,
    }]
})

const productTokenModel = mongoose.model('ProductToken', productTokenSchema);

export default productTokenModel;