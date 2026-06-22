import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/modelOfProduct.js";
import User from "./models/userModel.js";

dotenv.config({ path: "./config/config.env" });

const products = [
    // More Men Fashion
    { name: "Men Nehru Jacket", description: "Ethnic Nehru jacket for men cotton blend maroon festive", price: 999, category: "Men Fashion", stock: 25 },
    { name: "Men Chinos Pants Beige", description: "Slim fit chinos trousers beige cotton stretch formal casual", price: 799, category: "Men Fashion", stock: 50 },
    { name: "Men Thermal Wear Set", description: "Winter thermal inner wear set top and bottom black warm", price: 599, category: "Men Fashion", stock: 40 },
    { name: "Men Vest Cotton 3 Pack", description: "Cotton sleeveless vest pack of 3 white innerwear", price: 299, category: "Men Fashion", stock: 80 },

    // More Women Fashion
    { name: "Women Sharara Set", description: "Embroidered sharara set with kurta green festive wear", price: 1599, category: "Women Fashion", stock: 20 },
    { name: "Women Night Suit", description: "Cotton printed night suit pajama set comfortable sleep", price: 499, category: "Women Fashion", stock: 50 },
    { name: "Women Shrug Cardigan", description: "Long shrug cardigan for women grey open front light", price: 449, category: "Women Fashion", stock: 40 },
    { name: "Women Formal Trousers", description: "High waist formal trousers for women black slim fit office", price: 699, category: "Women Fashion", stock: 35 },

    // More Makeup
    { name: "Primer Lakme Absolute", description: "Lakme Absolute Blur Perfect makeup primer 30ml", price: 550, category: "Makeup", stock: 40 },
    { name: "Highlighter Stick", description: "Swiss Beauty highlighter stick golden glow shimmer", price: 250, category: "Makeup", stock: 50 },
    { name: "Makeup Brush Set 12pcs", description: "Professional makeup brush set 12 pieces with pouch", price: 399, category: "Makeup", stock: 30 },
    { name: "Beauty Blender Sponge", description: "Makeup sponge beauty blender for foundation blending", price: 149, category: "Makeup", stock: 70 },
    { name: "Lip Liner Pencil Set", description: "Matte lip liner pencil set of 6 nude shades", price: 299, category: "Makeup", stock: 40 },

    // More Medicine
    { name: "Disprin Tablets", description: "Disprin aspirin effervescent tablets pain relief strip of 10", price: 20, category: "Medicine", stock: 200 },
    { name: "Zandu Balm 25ml", description: "Zandu Ultra Power balm for headache and body pain 25ml", price: 60, category: "Medicine", stock: 100 },
    { name: "Burnol Cream 20g", description: "Burnol antiseptic burn cream first aid 20g", price: 45, category: "Medicine", stock: 80 },
    { name: "Strepsils Lozenges", description: "Strepsils sore throat lozenges honey lemon pack of 8", price: 50, category: "Medicine", stock: 120 },
    { name: "Pudin Hara Capsules", description: "Dabur Pudin Hara active capsules for gas acidity 10 caps", price: 30, category: "Medicine", stock: 100 },

    // More Watches
    { name: "Titan Edge Watch Men", description: "Titan Edge ultra slim analog watch for men leather strap", price: 5995, category: "Watches", stock: 10 },
    { name: "HMT Pilot Watch", description: "HMT Pilot hand winding mechanical watch vintage white dial", price: 1499, category: "Watches", stock: 15 },
    { name: "Timex Weekender", description: "Timex Weekender casual analog watch nylon strap unisex", price: 1995, category: "Watches", stock: 20 },

    // More Skincare
    { name: "Ponds Cold Cream 100ml", description: "Ponds moisturizing cold cream soft glowing skin 100ml", price: 145, category: "Skincare", stock: 60 },
    { name: "Aloe Vera Gel Wow 130ml", description: "WOW Skin Science 99% pure aloe vera gel 130ml multipurpose", price: 249, category: "Skincare", stock: 50 },
    { name: "Charcoal Face Wash", description: "Beardo Activated Charcoal face wash deep cleansing 100ml", price: 199, category: "Skincare", stock: 45 },

    // More Footwear
    { name: "Crocs Clog Unisex", description: "Classic clog comfortable lightweight unisex navy blue", price: 1495, category: "Footwear", stock: 30 },
    { name: "Woodland Shoes Men Brown", description: "Woodland outdoor casual shoes genuine leather brown", price: 2995, category: "Footwear", stock: 20 },
    { name: "Women Kolhapuri Chappal", description: "Traditional Kolhapuri leather chappal handcrafted", price: 599, category: "Footwear", stock: 35 },

    // More Hair Care
    { name: "Hair Dryer Philips", description: "Philips hair dryer 1000W compact foldable travel friendly", price: 899, category: "Hair Care", stock: 20 },
    { name: "Hair Straightener Mini", description: "Mini hair straightener flat iron ceramic plates portable", price: 499, category: "Hair Care", stock: 25 },

    // More Perfume
    { name: "Skinn Perfume Titan Men", description: "Skinn by Titan Raw EDP perfume for men 100ml long lasting", price: 1295, category: "Perfume", stock: 20 },
    { name: "Bella Vita Perfume Women", description: "Bella Vita Luxury CEO Woman EDP perfume 100ml", price: 499, category: "Perfume", stock: 25 },
    { name: "Body Mist Layer Shot", description: "Layerr Shot Gold body mist for men 135ml casual", price: 175, category: "Perfume", stock: 45 },
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
