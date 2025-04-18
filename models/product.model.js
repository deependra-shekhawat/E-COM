import mongoose from "mongoose";
import { removeSpecialCharacters } from "../utils/removeSpecialCharacters.js";
import productTokenModel from "./productToken.model.js";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Please provide product name"],
      maxlength: [100, "Name can no be more than 100 characters"],
    },
    price: {
      type: Number,
      required: [true, "Please provide product price"],
      default: 0,
    },
    description: {
      type: String,
      required: [true, "Please provide product description"],
      maxlength: [1000, "Name can no be more than 1000 characters"],
    },
    image: {
      type: String,
      default: "../public/uploads/example.jpeg",
    },
    company: {
      type: String,
      enum: {
        values: ["ikea", "liddy", "caressa", "marcos"],
        message: "{VALUE} is not supported",
      },
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

productSchema.post("insertMany", function (docs) {
  docs.map(async (docs) => {
    let name = removeSpecialCharacters(docs.name).toLowerCase();
    let brand = removeSpecialCharacters(docs.company).toLowerCase();
    let description = removeSpecialCharacters(docs.description).toLowerCase();

    const tokenArray = name
      .split(" ")
      .concat(brand.split(" "))
      .concat(description.split(" "));

    await productTokenModel.create({ productId: docs._id, tokenArray });
  });
});

productSchema.post("save", async function (docs) {
  let name = removeSpecialCharacters(docs.name).toLowerCase();
  let brand = removeSpecialCharacters(docs.company).toLowerCase();
  let description = removeSpecialCharacters(docs.description).toLowerCase();

  const tokenArray = name
    .split(" ")
    .concat(brand.split(" "))
    .concat(description.split(" "));

  await productTokenModel.create({ productId: docs._id, tokenArray });
});

const productModel = mongoose.model("Product", productSchema);

export default productModel;
