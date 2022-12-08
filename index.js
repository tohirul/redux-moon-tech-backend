require("dotenv").config();
const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
// const ObjectId = require("mongodb").ObjectId;
const app = express();
const port = process.env.PORT || 5000;

const cors = require("cors");

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3swn16q.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	serverApi: ServerApiVersion.v1,
});

const run = async () => {
	try {
		const db = client.db("moontech");
		const productCollection = db.collection("product");
		const cartItemsCollection = db.collection("cart");
		// GET ALL PRODUCTS
		app.get("/products", async (req, res) => {
			const cursor = productCollection.find({});
			const product = await cursor.toArray();

			res.send({ status: true, data: product });
		});

		// GET CART
		app.get("/cart", async (req, res) => {
			const cursor = cartItemsCollection.find({});
			const cart = await cursor.toArray();

			res.send({ status: true, data: cart });
		});

		// POST CART ITEMS
		app.post("/add_to_cart", async (req, res) => {
			const cartItem = req.body;
			const result = await cartItemsCollection.insertOne(cartItem);
			console.log(result);
			res.json(result);
		});

		// POST A Product
		app.post("/upload_product_details", async (req, res) => {
			const product = req.body;
			const result = await productCollection.insertOne(product);
			res.send({ status: true, result: result });
		});

		// DELETE CART ITEM
		app.delete("/remove_from_cart/:id", async (req, res) => {
			const itemId = req.params.id;
			const query = { _id: ObjectId(itemId) };
			const result = await cartItemsCollection.deleteOne(query);
			console.log(result, "Item deleted successfully", query);
			res.json(result);
		});
	} finally {
	}
};

run().catch((err) => console.log(err));

app.get("/", (req, res) => {
	res.send("Hello World!");
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
