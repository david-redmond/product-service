// Define MongoDB schema for product model
import { Document, Model, Schema, model } from "mongoose";

interface ProductDocument extends Document {
  title: string;
  description: string;
  image: string;
  price: number;
  duration: string;
  available: boolean;
}

const productSchema: Schema<ProductDocument> = new Schema<ProductDocument>({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: false,
  },
  price: {
    type: Number,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  available: {
    type: Boolean,
    required: true,
  },
});

// Create Product model
const Product: Model<ProductDocument> = model<ProductDocument>(
  "Products",
  productSchema,
);

export default Product