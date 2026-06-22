import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/modelOfProduct.js";
import User from "./models/userModel.js";

dotenv.config({ path: "./config/config.env" });

const products = [
    { name: "Bicycle Pump", description: "Portable bicycle tire air pump with pressure gauge", price: 250, category: "Sports", stock: 30 },
    { name: "Table Tennis Balls (Pack of 6)", description: "White table tennis ping pong balls 40mm pack of 6", price: 120, category: "Sports", stock: 50 },
    { name: "Candles Pack of 10", description: "White wax candles pack of 10 for home and emergencies", price: 50, category: "Household", stock: 100 },
    { name: "Matchbox (Pack of 10)", description: "Safety matchbox pack of 10 boxes kitchen essential", price: 20, category: "Household", stock: 200 },
    { name: "Aluminium Foil 9m", description: "Aluminium foil roll 9 meters food grade for wrapping", price: 85, category: "Kitchen", stock: 80 },
    { name: "Cling Wrap 30m", description: "Food grade cling film stretch wrap 30 meters", price: 99, category: "Kitchen", stock: 60 },
];

const seedProducts = async () => {
    try {
        await mongoose.connect(process.env.DB_URI);
        console.log("MongoDB connected...");

        let adminUser = await User.findOne({ role: "admin" });
        if (!adminUser) adminUser = await User.findOne();

        const productsToInsert = products.map(product => ({
            ...product,
            user: adminUser._id,
            image: [{
                public_id: `seed_product_${product.name.toLowerCase().replace(/\s+/g, '_')}`,
                url: "https://res.cloudinary.com/dbi0ijysf/image/upload/v1700000000/products/placeholder_product.png"
            }],
            ratings: 0,
            numOfReviews: 0,
            reviews: []
        }));

        const inserted = await Product.insertMany(productsToInsert);
        console.log(`✅ Seeded ${inserted.length} more products!`);

        const totalCount = await Product.countDocuments();
        console.log(`📦 Total products in database: ${totalCount}`);
        process.exit(0);
    } catch (error) {
        console.error("Seeding failed:", error.message);
        process.exit(1);
    }
};

seedProducts();
