import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import Product from './models/Product.js';

const sampleProducts = [
  { name: 'Wireless Mouse', category: 'Electronics', quantity: 24, price: 19.99, description: 'Ergonomic 2.4GHz wireless mouse' },
  { name: 'Cotton T-Shirt', category: 'Clothing', quantity: 5, price: 12.5, description: '100% cotton, unisex fit' },
  { name: 'Basmati Rice 5kg', category: 'Groceries', quantity: 40, price: 8.75, description: 'Premium long-grain basmati rice' },
  { name: 'Notebook Pack (5)', category: 'Stationery', quantity: 0, price: 4.99, description: 'A5 ruled notebooks, pack of 5' },
  { name: 'LED Desk Lamp', category: 'Home & Kitchen', quantity: 8, price: 24.0, description: 'Dimmable lamp with USB charging port' },
  { name: 'USB-C Cable 1m', category: 'Electronics', quantity: 60, price: 6.49, description: 'Fast charging braided cable' },
  { name: 'Running Shoes', category: 'Clothing', quantity: 12, price: 45.0, description: 'Lightweight breathable running shoes' },
  { name: 'Green Tea 100g', category: 'Groceries', quantity: 3, price: 5.25, description: 'Organic loose-leaf green tea' },
];

const run = async () => {
  await connectDB();
  const count = await Product.countDocuments();
  if (count > 0) {
    console.log(`Collection not empty (${count} products found). Seed skipped.`);
  } else {
    await Product.insertMany(sampleProducts);
    console.log(`Seeded ${sampleProducts.length} products.`);
  }
  await mongoose.connection.close();
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
