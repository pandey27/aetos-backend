const mongoose = require("mongoose");

const MONGO_URI = "mongodb+srv://aetosuser:Mypass123@cluster0.rzmxomb.mongodb.net/aetos-orders?retryWrites=true&w=majority&appName=Cluster0";

const productSchema = new mongoose.Schema({
  name: String,
  slug: { type: String, unique: true },
  price: Number,
  category: String,
  image: String,
  description: String,
  createdAt: { type: Date, default: Date.now }
});
const Product = mongoose.model("Product", productSchema);

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(async () => {
  const products = await Product.find({});
  const baseUrl = "https://aetosoriginal.com";

  for (const p of products) {
    if (p.image.startsWith("/uploads")) {
      p.image = `${baseUrl}${p.image}`;
      await p.save();
      console.log(`✅ Updated image for: ${p.slug}`);
    }
  }

  console.log("🎉 All product image paths updated.");
  process.exit();
})
.catch(err => {
  console.error("❌ Update error:", err);
  process.exit(1);
});
