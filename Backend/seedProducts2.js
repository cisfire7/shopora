import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/modelOfProduct.js";
import User from "./models/userModel.js";

dotenv.config({ path: "./config/config.env" });

const products = [
    // --- Electronics & Gadgets ---
    { name: "boAt Airdopes 141", description: "boAt Airdopes 141 TWS earbuds with 42H playtime Bluetooth 5.1", price: 1299, category: "Electronics", stock: 40 },
    { name: "Noise ColorFit Pulse Watch", description: "Noise ColorFit Pulse smartwatch 1.4 inch display SpO2 monitor", price: 1799, category: "Electronics", stock: 30 },
    { name: "Ambrane Power Bank 10000mAh", description: "Ambrane 10000mAh Li-Polymer Power Bank fast charging dual USB", price: 699, category: "Electronics", stock: 50 },
    { name: "Portronics Bluetooth Speaker", description: "Portronics SoundDrum portable wireless Bluetooth speaker 10W", price: 999, category: "Electronics", stock: 35 },
    { name: "USB C Charging Cable", description: "USB Type-C fast charging cable 1.5m braided nylon durable", price: 199, category: "Electronics", stock: 200 },
    { name: "Mobile Phone Stand", description: "Adjustable mobile phone stand holder for desk foldable", price: 149, category: "Electronics", stock: 100 },
    { name: "Wireless Mouse Logitech", description: "Logitech M235 wireless mouse 2.4GHz optical ergonomic", price: 795, category: "Electronics", stock: 45 },
    { name: "LED Desk Lamp", description: "Rechargeable LED desk lamp with 3 brightness modes study lamp", price: 450, category: "Electronics", stock: 60 },

    // --- Stationery & Office ---
    { name: "Classmate Notebook 200 pages", description: "Classmate single line notebook 200 pages A4 size", price: 65, category: "Stationery", stock: 200 },
    { name: "Cello Butterflow Pen (Pack of 10)", description: "Cello Butterflow ball pen blue pack of 10 smooth writing", price: 90, category: "Stationery", stock: 150 },
    { name: "Camlin Marker Set (12 colors)", description: "Camlin permanent marker set 12 assorted colors", price: 180, category: "Stationery", stock: 80 },
    { name: "Fevicol Glue 200g", description: "Fevicol SH synthetic resin adhesive 200g multipurpose glue", price: 75, category: "Stationery", stock: 120 },
    { name: "Scotch Tape", description: "3M Scotch transparent tape 1 inch x 25m stationery tape", price: 35, category: "Stationery", stock: 200 },
    { name: "A4 Printing Paper (500 sheets)", description: "JK Copier A4 size 75 GSM printing paper 500 sheets ream", price: 320, category: "Stationery", stock: 40 },
    { name: "Stapler with Pins", description: "Kangaro mini stapler with 1000 staple pins for office use", price: 85, category: "Stationery", stock: 100 },
    { name: "Scissors Stainless Steel", description: "Stainless steel scissors 8 inch sharp multipurpose", price: 60, category: "Stationery", stock: 100 },

    // --- Kitchen & Cookware ---
    { name: "Milton Water Bottle 1L", description: "Milton Thermosteel 1 litre flask hot and cold water bottle", price: 650, category: "Kitchen", stock: 50 },
    { name: "Prestige Tawa Non-Stick", description: "Prestige Omega Deluxe non-stick tawa 250mm for roti", price: 599, category: "Kitchen", stock: 30 },
    { name: "Pigeon Pressure Cooker 3L", description: "Pigeon Favourite aluminium pressure cooker 3 litre", price: 899, category: "Kitchen", stock: 25 },
    { name: "Cello Lunch Box 3 Container", description: "Cello Max Fresh click stainless steel lunch box 3 containers", price: 450, category: "Kitchen", stock: 40 },
    { name: "Tupperware Water Jug 2L", description: "Tupperware premium water pitcher jug 2 litre with lid", price: 380, category: "Kitchen", stock: 35 },
    { name: "Knife Set (3 pieces)", description: "Stainless steel kitchen knife set 3 pieces chef knife paring knife", price: 299, category: "Kitchen", stock: 50 },
    { name: "Cutting Board Wooden", description: "Premium wooden chopping cutting board for vegetables and fruits", price: 250, category: "Kitchen", stock: 40 },
    { name: "Gas Lighter", description: "Crystal gas lighter for kitchen stove long lasting piezo", price: 40, category: "Kitchen", stock: 150 },

    // --- Fitness & Sports ---
    { name: "Yoga Mat 6mm", description: "Anti-slip yoga mat 6mm thick EVA foam for exercise fitness", price: 399, category: "Fitness", stock: 40 },
    { name: "Skipping Rope Adjustable", description: "Adjustable skipping jump rope with counter for cardio", price: 199, category: "Fitness", stock: 60 },
    { name: "Dumbbell 5kg (Pair)", description: "Rubber coated dumbbell 5kg pair for home gym workout", price: 1200, category: "Fitness", stock: 20 },
    { name: "Resistance Band Set", description: "Resistance bands set of 5 for strength training and stretching", price: 350, category: "Fitness", stock: 45 },
    { name: "Sports Water Bottle 750ml", description: "BPA free sports sipper water bottle 750ml leak proof", price: 199, category: "Fitness", stock: 80 },
    { name: "Cricket Tennis Ball (Pack of 6)", description: "Light weight cricket tennis ball pack of 6 for practice", price: 120, category: "Sports", stock: 100 },
    { name: "Badminton Shuttlecock (Pack of 10)", description: "Yonex Mavis 200i nylon shuttlecock pack of 10", price: 450, category: "Sports", stock: 40 },
    { name: "Football Size 5", description: "Nivia Storm football size 5 for training and matches", price: 550, category: "Sports", stock: 25 },

    // --- Clothing & Accessories ---
    { name: "Cotton T-Shirt Round Neck", description: "Men's plain cotton round neck t-shirt casual wear comfortable", price: 299, category: "Clothing", stock: 100 },
    { name: "Track Pants Men", description: "Men's polyester track pants with zip pockets joggers", price: 450, category: "Clothing", stock: 80 },
    { name: "Cotton Socks (Pack of 5)", description: "Unisex cotton ankle socks pack of 5 pairs breathable", price: 199, category: "Clothing", stock: 120 },
    { name: "Cap Baseball Style", description: "Adjustable baseball cap unisex cotton sun protection", price: 250, category: "Clothing", stock: 60 },
    { name: "Sunglasses UV Protection", description: "Polarized sunglasses UV400 protection unisex stylish", price: 499, category: "Accessories", stock: 40 },
    { name: "Wrist Watch Analog", description: "Sonata analog wrist watch for men water resistant", price: 799, category: "Accessories", stock: 30 },
    { name: "Wallet Leather Men", description: "Genuine leather bifold wallet for men RFID blocking", price: 399, category: "Accessories", stock: 50 },
    { name: "Backpack 30L", description: "American Tourister 30L casual backpack laptop bag water resistant", price: 999, category: "Accessories", stock: 30 },

    // --- Medicines & Wellness ---
    { name: "Crocin Pain Relief", description: "Crocin Pain Relief tablets for headache body ache 15 tablets", price: 30, category: "Healthcare", stock: 200 },
    { name: "Digene Antacid Gel 200ml", description: "Digene Acidity and Gas Relief gel mint flavor 200ml", price: 95, category: "Healthcare", stock: 100 },
    { name: "Band-Aid Flexible Fabric", description: "Band-Aid flexible fabric adhesive bandages 100 count", price: 150, category: "Healthcare", stock: 80 },
    { name: "Dettol Antiseptic Liquid 250ml", description: "Dettol Antiseptic Disinfectant Liquid 250ml for first aid", price: 110, category: "Healthcare", stock: 90 },
    { name: "ORS Electral Powder (Pack of 10)", description: "Electral ORS Oral Rehydration Salts powder sachets 10 pack", price: 60, category: "Healthcare", stock: 150 },
    { name: "Multivitamin Tablets (60 tabs)", description: "Revital H multivitamin with minerals and ginseng 60 capsules", price: 350, category: "Healthcare", stock: 50 },
    { name: "Moov Pain Relief Spray 80g", description: "Moov spray instant pain relief for muscles and joints 80g", price: 180, category: "Healthcare", stock: 70 },
    { name: "Cotton Roll 100g", description: "Absorbent surgical cotton roll 100g for first aid", price: 45, category: "Healthcare", stock: 120 },

    // --- Spices & Condiments ---
    { name: "Red Chilli Powder 200g", description: "Kashmiri red chilli powder 200g vibrant color mild heat", price: 65, category: "Spices", stock: 120 },
    { name: "Coriander Powder 200g", description: "Pure dhaniya coriander powder 200g aromatic ground spice", price: 45, category: "Spices", stock: 130 },
    { name: "Cumin Seeds 100g", description: "Whole cumin seeds jeera 100g essential Indian spice", price: 40, category: "Spices", stock: 150 },
    { name: "Mustard Seeds 100g", description: "Black mustard seeds rai 100g for tempering and pickles", price: 25, category: "Spices", stock: 150 },
    { name: "Black Pepper Powder 50g", description: "Pure black pepper kali mirch powder 50g freshly ground", price: 55, category: "Spices", stock: 100 },
    { name: "Cinnamon Sticks 50g", description: "Whole cinnamon dalchini sticks 50g aromatic bark", price: 60, category: "Spices", stock: 80 },
    { name: "Bay Leaves 25g", description: "Dried bay leaves tej patta 25g for biryani and curries", price: 20, category: "Spices", stock: 120 },
    { name: "Kitchen King Masala 100g", description: "MDH Kitchen King Masala 100g all purpose seasoning", price: 68, category: "Spices", stock: 100 },
    { name: "Pav Bhaji Masala 100g", description: "Everest Pav Bhaji Masala 100g authentic street food spice", price: 55, category: "Spices", stock: 90 },
    { name: "Pickle Mango 500g", description: "Mother's Recipe Mango Pickle 500g tangy and spicy", price: 95, category: "Spices", stock: 70 },

    // --- Frozen & Ready to Eat ---
    { name: "Frozen Peas 500g", description: "Safal frozen green peas 500g IQF fresh taste", price: 65, category: "Frozen Food", stock: 80 },
    { name: "Frozen Mixed Vegetables 500g", description: "Safal frozen mixed vegetables 500g carrot peas beans corn", price: 85, category: "Frozen Food", stock: 60 },
    { name: "Frozen Chicken Nuggets 300g", description: "ITC Master Chef frozen chicken nuggets 300g crispy", price: 180, category: "Frozen Food", stock: 40 },
    { name: "Ice Cream Vanilla 1L", description: "Amul vanilla ice cream 1 litre family pack creamy", price: 180, category: "Frozen Food", stock: 30 },
    { name: "Frozen Momos (12 pcs)", description: "Frozen vegetable momos steamed 12 pieces with chutney", price: 120, category: "Frozen Food", stock: 50 },
    { name: "Ready to Eat Dal Makhani", description: "MTR Ready to Eat Dal Makhani 300g microwave in 3 min", price: 85, category: "Ready to Eat", stock: 60 },
    { name: "Ready to Eat Rajma", description: "MTR Ready to Eat Rajma Masala 300g instant meal", price: 85, category: "Ready to Eat", stock: 60 },
    { name: "Instant Upma Mix 200g", description: "MTR Instant Upma breakfast mix 200g just add water", price: 50, category: "Ready to Eat", stock: 80 },

    // --- Pet Supplies ---
    { name: "Pedigree Dog Food 1.2kg", description: "Pedigree Adult Dry Dog Food Chicken and Vegetables 1.2kg", price: 250, category: "Pet Supplies", stock: 30 },
    { name: "Whiskas Cat Food 480g", description: "Whiskas Adult Dry Cat Food Tuna flavor 480g", price: 180, category: "Pet Supplies", stock: 25 },
    { name: "Dog Biscuits 800g", description: "Pedigree Biscrok dog biscuits 800g crunchy treat", price: 200, category: "Pet Supplies", stock: 30 },
    { name: "Pet Shampoo 200ml", description: "Himalaya Erina coat cleanser pet shampoo 200ml gentle", price: 150, category: "Pet Supplies", stock: 35 },

    // --- Sweets & Desserts ---
    { name: "Rasgulla Tin 1kg", description: "Haldiram's Rasgulla tin 1kg soft spongy Bengali sweet", price: 180, category: "Sweets", stock: 40 },
    { name: "Gulab Jamun Tin 1kg", description: "Haldiram's Gulab Jamun tin 1kg classic Indian dessert", price: 195, category: "Sweets", stock: 40 },
    { name: "Soan Papdi 500g", description: "Bikaner Soan Papdi 500g flaky layered sweet", price: 120, category: "Sweets", stock: 50 },
    { name: "Dairy Milk Silk Chocolate", description: "Cadbury Dairy Milk Silk chocolate bar 150g smooth and creamy", price: 160, category: "Sweets", stock: 100 },
    { name: "KitKat Wafer Bar (Pack of 6)", description: "Nestle KitKat 4 finger chocolate wafer bar pack of 6", price: 120, category: "Sweets", stock: 80 },
    { name: "5 Star Chocolate (Pack of 10)", description: "Cadbury 5 Star chocolate bar pack of 10 caramel nougat", price: 100, category: "Sweets", stock: 100 },

    // --- Ayurveda & Herbal ---
    { name: "Chyawanprash Dabur 500g", description: "Dabur Chyawanprash 500g Ayurvedic immunity booster", price: 210, category: "Ayurveda", stock: 50 },
    { name: "Ashwagandha Capsules", description: "Himalaya Ashwagandha tablets 60 count stress relief", price: 200, category: "Ayurveda", stock: 40 },
    { name: "Triphala Tablets", description: "Himalaya Triphala digestive wellness 60 tablets", price: 165, category: "Ayurveda", stock: 45 },
    { name: "Aloe Vera Gel 150ml", description: "Patanjali Aloe Vera Gel 150ml skin moisturizer", price: 80, category: "Ayurveda", stock: 70 },
    { name: "Tulsi Drops 30ml", description: "Organic India Tulsi drops 30ml immunity and wellness", price: 180, category: "Ayurveda", stock: 50 },
    { name: "Coconut Oil Parachute 500ml", description: "Parachute 100% pure coconut oil 500ml for hair and cooking", price: 125, category: "Ayurveda", stock: 80 },

    // --- Cleaning & Laundry ---
    { name: "Colin Glass Cleaner 500ml", description: "Colin Glass and Surface Cleaner Spray 500ml sparkling shine", price: 99, category: "Cleaning", stock: 70 },
    { name: "Domex Toilet Cleaner 1L", description: "Domex Fresh Guard disinfectant toilet cleaner 1 litre", price: 130, category: "Cleaning", stock: 60 },
    { name: "Comfort Fabric Conditioner 860ml", description: "Comfort After Wash fabric conditioner morning fresh 860ml", price: 160, category: "Cleaning", stock: 50 },
    { name: "Rin Detergent Bar 250g", description: "Rin Advanced detergent bar 250g bright white clothes", price: 22, category: "Cleaning", stock: 200 },
    { name: "Pril Dishwash Liquid 500ml", description: "Pril Perfect Active dishwash liquid lime 500ml", price: 105, category: "Cleaning", stock: 80 },
    { name: "Floor Mop Scotch Brite", description: "Scotch Brite flat floor mop with refill easy cleaning", price: 550, category: "Cleaning", stock: 25 },

    // --- Travel & Outdoor ---
    { name: "Sunscreen SPF 50 100ml", description: "Lakme Sun Expert SPF 50 sunscreen lotion 100ml UV protection", price: 350, category: "Personal Care", stock: 50 },
    { name: "Mosquito Repellent Cream 50ml", description: "Odomos Advanced mosquito repellent cream 50ml DEET free", price: 55, category: "Healthcare", stock: 100 },
    { name: "Hand Sanitizer 500ml", description: "Lifebuoy Total 10 hand sanitizer 500ml pump bottle", price: 175, category: "Healthcare", stock: 60 },
    { name: "Face Mask N95 (Pack of 5)", description: "N95 respiratory face mask 5 layer protection pack of 5", price: 150, category: "Healthcare", stock: 80 },
    { name: "Rain Coat Adult", description: "Full length PVC raincoat with hood adult size waterproof", price: 299, category: "Household", stock: 30 },
    { name: "Torch LED Rechargeable", description: "LED rechargeable torch flashlight long range high power", price: 350, category: "Electronics", stock: 40 },
];

const seedProducts = async () => {
    try {
        await mongoose.connect(process.env.DB_URI);
        console.log("MongoDB connected for seeding...");

        let adminUser = await User.findOne({ role: "admin" });
        if (!adminUser) {
            adminUser = await User.findOne();
        }

        if (!adminUser) {
            console.log("ERROR: No user found in database. Please create a user first.");
            process.exit(1);
        }

        console.log(`Using user: ${adminUser.name} (${adminUser.email}) as product creator`);

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
        console.log(`\n✅ Successfully seeded ${inserted.length} more products!\n`);

        const categories = {};
        inserted.forEach(p => {
            categories[p.category] = (categories[p.category] || 0) + 1;
        });
        console.log("New products by category:");
        Object.entries(categories).sort().forEach(([cat, count]) => {
            console.log(`  ${cat}: ${count} products`);
        });

        // Total count
        const totalCount = await Product.countDocuments();
        console.log(`\n📦 Total products in database: ${totalCount}`);

        process.exit(0);
    } catch (error) {
        console.error("Seeding failed:", error.message);
        process.exit(1);
    }
};

seedProducts();
