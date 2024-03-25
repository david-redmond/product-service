import * as express from "express";
import * as bodyParser from "body-parser";
import * as dotenv from "dotenv";
import Product from "./models/product";
import {mongoConnection} from "./database/connection";

const app = express();
app.use(bodyParser.json());

dotenv.config();
// Connect to MongoDB
mongoConnection();
// Get all products
app.get("/product/:productId", async (req: express.Request, res: express.Response) => {
  try {
    const products = await Product.findById(req.params.productId);
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create a new product
app.post("/product", async (req: express.Request, res: express.Response) => {
  try {
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update a product
app.put("/product/:productId", async (req: express.Request, res: express.Response) => {
  try {
    const productId = req.params.productId;
    const updatedProduct = await Product.findOneAndUpdate(
      { productId },
      req.body,
      { new: true },
    );
    res.json(updatedProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete a product
app.delete("/product/:productId", async (req: express.Request, res: express.Response) => {
  try {
    const productId = req.params.productId;
    await Product.findOneAndDelete({ productId });
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Search products by query
app.get("/search", async (req: express.Request, res: express.Response) => {
  try {
    const query: string = req.query.q as string;
    const results = await Product.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ],
    });
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start server
const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
