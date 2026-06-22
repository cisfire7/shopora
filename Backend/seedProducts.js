import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/modelOfProduct.js";
import User from "./models/userModel.js";
dotenv.config({ path: "./config/config.env", debug: true });

console.log("ENV KEYS:", Object.keys(process.env));
console.log("DB_URI:", process.env.DB_URI);
const products = [
    // --- Instant Food & Snacks ---
    { name: "Maggi Noodles", description: "Maggi 2-Minute Masala Noodles, instant cooking noodles with tastemaker", price: 14, category: "Food", stock: 200 },
    { name: "Maggi Noodles Family Pack", description: "Maggi 2-Minute Noodles family pack of 12", price: 156, category: "Food", stock: 80 },
    { name: "Yippee Noodles", description: "Sunfeast Yippee Magic Masala instant noodles", price: 12, category: "Food", stock: 150 },
    { name: "Cup Noodles", description: "Nissin Cup Noodles Mazedaar Masala flavor", price: 45, category: "Food", stock: 100 },
    { name: "Lays Classic Salted", description: "Lays Classic Salted potato chips 52g pack", price: 20, category: "Snacks", stock: 300 },
    { name: "Lays Magic Masala", description: "Lays Magic Masala potato chips 52g pack", price: 20, category: "Snacks", stock: 250 },
    { name: "Kurkure Masala Munch", description: "Kurkure Masala Munch crispy puffed snack 80g", price: 20, category: "Snacks", stock: 200 },
    { name: "Haldiram Bhujia", description: "Haldiram's Bhujia Sev 200g traditional namkeen", price: 65, category: "Snacks", stock: 120 },
    { name: "Haldiram Aloo Bhujia", description: "Haldiram's Aloo Bhujia 200g crispy potato namkeen", price: 70, category: "Snacks", stock: 100 },
    { name: "Bingo Mad Angles", description: "Bingo Mad Angles Achari Masti flavor 66g", price: 20, category: "Snacks", stock: 180 },

    // --- Beverages ---
    { name: "Coca Cola 750ml", description: "Coca Cola refreshing cold drink 750ml bottle", price: 40, category: "Beverages", stock: 300 },
    { name: "Coca Cola 2L", description: "Coca Cola cold drink 2 litre party pack", price: 95, category: "Beverages", stock: 100 },
    { name: "Pepsi 750ml", description: "Pepsi refreshing cola cold drink 750ml", price: 40, category: "Beverages", stock: 250 },
    { name: "Sprite 750ml", description: "Sprite clear lemon lime flavored drink 750ml", price: 40, category: "Beverages", stock: 200 },
    { name: "Thumbs Up 750ml", description: "Thumbs Up strong taste cola drink 750ml", price: 40, category: "Beverages", stock: 180 },
    { name: "Maaza Mango 600ml", description: "Maaza mango fruit drink 600ml refreshing taste", price: 35, category: "Beverages", stock: 200 },
    { name: "Real Fruit Juice Mixed Fruit", description: "Real Fruit Power Mixed Fruit juice 1L tetra pack", price: 110, category: "Beverages", stock: 80 },
    { name: "Paper Boat Aam Panna", description: "Paper Boat Aam Panna traditional drink 200ml", price: 30, category: "Beverages", stock: 100 },
    { name: "Red Bull Energy Drink", description: "Red Bull Energy Drink 250ml can for instant energy", price: 125, category: "Beverages", stock: 60 },
    { name: "Bisleri Water 1L", description: "Bisleri mineral water 1 litre packaged drinking water", price: 20, category: "Beverages", stock: 500 },

    // --- Dairy ---
    { name: "Amul Taza Milk 500ml", description: "Amul Taza homogenized toned milk 500ml", price: 28, category: "Dairy", stock: 150 },
    { name: "Amul Gold Milk 1L", description: "Amul Gold full cream milk 1 litre pouch", price: 68, category: "Dairy", stock: 120 },
    { name: "Amul Butter 100g", description: "Amul Pasteurised Butter 100g smooth and creamy", price: 56, category: "Dairy", stock: 200 },
    { name: "Amul Butter 500g", description: "Amul Pasteurised Butter 500g family pack", price: 270, category: "Dairy", stock: 80 },
    { name: "Mother Dairy Curd 400g", description: "Mother Dairy fresh dahi 400g pack", price: 35, category: "Dairy", stock: 100 },
    { name: "Amul Cheese Slices", description: "Amul processed cheese slices 200g 10 slices", price: 120, category: "Dairy", stock: 90 },
    { name: "Paneer 200g", description: "Fresh cottage cheese paneer 200g for cooking", price: 80, category: "Dairy", stock: 100 },
    { name: "Amul Dark Chocolate", description: "Amul Dark Chocolate 150g rich cocoa taste", price: 130, category: "Dairy", stock: 70 },
    { name: "Eggs Tray (12 pcs)", description: "Farm fresh eggs tray of 12 pieces protein rich", price: 84, category: "Dairy", stock: 200 },
    { name: "Eggs Tray (30 pcs)", description: "Farm fresh eggs tray of 30 pieces value pack", price: 195, category: "Dairy", stock: 100 },

    // --- Grocery Staples ---
    { name: "Aashirvaad Atta 5kg", description: "Aashirvaad Superior MP Whole Wheat Atta 5kg", price: 280, category: "Grocery", stock: 50 },
    { name: "Fortune Rice Bran Oil 1L", description: "Fortune Rice Bran Health Oil 1 litre", price: 175, category: "Grocery", stock: 80 },
    { name: "Saffola Gold Oil 1L", description: "Saffola Gold blended edible oil 1 litre heart healthy", price: 199, category: "Grocery", stock: 60 },
    { name: "Tata Salt 1kg", description: "Tata Salt iodized refined salt 1kg pack", price: 24, category: "Grocery", stock: 300 },
    { name: "India Gate Basmati Rice 5kg", description: "India Gate Classic Basmati Rice 5kg aged rice", price: 450, category: "Grocery", stock: 40 },
    { name: "Toor Dal 1kg", description: "Premium Toor Dal Arhar dal 1kg unpolished", price: 140, category: "Grocery", stock: 100 },
    { name: "Moong Dal 1kg", description: "Yellow Moong Dal 1kg split and washed", price: 130, category: "Grocery", stock: 80 },
    { name: "Sugar 1kg", description: "Refined white sugar 1kg for daily cooking", price: 45, category: "Grocery", stock: 200 },
    { name: "MDH Garam Masala", description: "MDH Garam Masala 100g blend of aromatic spices", price: 72, category: "Grocery", stock: 120 },
    { name: "Everest Turmeric Powder 100g", description: "Everest Turmeric Haldi Powder 100g pure spice", price: 38, category: "Grocery", stock: 150 },

    // --- Personal Care ---
    { name: "Vicks VapoRub 50ml", description: "Vicks VapoRub 50ml topical cough suppressant for cold relief", price: 145, category: "Healthcare", stock: 100 },
    { name: "Vicks Action 500", description: "Vicks Action 500 Advanced tablets for cold and headache", price: 32, category: "Healthcare", stock: 200 },
    { name: "Dettol Soap 75g", description: "Dettol Original antibacterial soap 75g germ protection", price: 42, category: "Personal Care", stock: 250 },
    { name: "Dove Soap 100g", description: "Dove Cream Beauty Bathing Bar 100g moisturizing", price: 55, category: "Personal Care", stock: 200 },
    { name: "Colgate MaxFresh Toothpaste", description: "Colgate MaxFresh Peppermint Ice toothpaste 150g", price: 95, category: "Personal Care", stock: 180 },
    { name: "Listerine Mouthwash 250ml", description: "Listerine Cool Mint Mouthwash 250ml fresh breath", price: 120, category: "Personal Care", stock: 80 },
    { name: "Head & Shoulders Shampoo 340ml", description: "Head & Shoulders Cool Menthol anti-dandruff shampoo 340ml", price: 250, category: "Personal Care", stock: 70 },
    { name: "Nivea Body Lotion 200ml", description: "Nivea Nourishing Body Milk Lotion 200ml dry skin", price: 199, category: "Personal Care", stock: 90 },
    { name: "Gillette Guard Razor", description: "Gillette Guard razor with cartridge smooth shave", price: 45, category: "Personal Care", stock: 150 },
    { name: "Whisper Ultra Soft Pads", description: "Whisper Ultra Soft sanitary pads XL wings 15 count", price: 145, category: "Personal Care", stock: 100 },

    // --- Household ---
    { name: "Umbrella Full Size", description: "Full size 3-fold umbrella windproof with UV protection", price: 350, category: "Household", stock: 50 },
    { name: "Umbrella Compact", description: "Compact mini umbrella for travel lightweight foldable", price: 250, category: "Household", stock: 60 },
    { name: "Surf Excel Detergent 1kg", description: "Surf Excel Easy Wash detergent powder 1kg", price: 110, category: "Household", stock: 100 },
    { name: "Vim Dishwash Gel 500ml", description: "Vim Dishwash Gel Lemon 500ml for sparkling dishes", price: 95, category: "Household", stock: 120 },
    { name: "Harpic Toilet Cleaner 500ml", description: "Harpic Power Plus disinfectant toilet cleaner 500ml", price: 89, category: "Household", stock: 100 },
    { name: "Hit Cockroach Spray", description: "Hit Anti Roach Gel and cockroach killer spray 200ml", price: 150, category: "Household", stock: 80 },
    { name: "Scotch Brite Scrub Pad", description: "Scotch Brite antibacterial scrub pad for utensils pack of 3", price: 45, category: "Household", stock: 200 },
    { name: "Room Freshener Odonil", description: "Odonil Room Freshener Lavender blocks 50g pack of 3", price: 99, category: "Household", stock: 100 },
    { name: "Garbage Bags Large (30 pcs)", description: "Large black garbage bags 19x21 inches 30 pieces", price: 80, category: "Household", stock: 150 },
    { name: "Lizol Floor Cleaner 500ml", description: "Lizol Disinfectant Surface Cleaner Citrus 500ml", price: 115, category: "Household", stock: 90 },

    // --- Bread & Bakery ---
    { name: "Bread White", description: "Fresh white sandwich bread 400g sliced", price: 35, category: "Bakery", stock: 150 },
    { name: "Bread Brown Whole Wheat", description: "Brown whole wheat bread 400g healthy fiber rich", price: 45, category: "Bakery", stock: 100 },
    { name: "Britannia Good Day Cashew", description: "Britannia Good Day Cashew cookies 200g", price: 40, category: "Bakery", stock: 150 },
    { name: "Parle-G Biscuits", description: "Parle-G Original Glucose Biscuits 250g pack", price: 22, category: "Bakery", stock: 300 },
    { name: "Dark Fantasy Choco Fills", description: "Sunfeast Dark Fantasy Choco Fills 75g premium cookie", price: 40, category: "Bakery", stock: 120 },
    { name: "Britannia Cake Rusk", description: "Britannia Toastea Premium Cake Rusk 200g", price: 38, category: "Bakery", stock: 100 },

    // --- Fruits & Vegetables ---
    { name: "Banana (1 dozen)", description: "Fresh ripe bananas 1 dozen natural energy fruit", price: 40, category: "Fruits", stock: 100 },
    { name: "Apple (1 kg)", description: "Fresh red apples 1kg premium quality Kashmir", price: 180, category: "Fruits", stock: 80 },
    { name: "Onion (1 kg)", description: "Fresh onions 1kg essential for Indian cooking", price: 35, category: "Vegetables", stock: 200 },
    { name: "Tomato (1 kg)", description: "Fresh red tomatoes 1kg for curries and salads", price: 30, category: "Vegetables", stock: 200 },
    { name: "Potato (1 kg)", description: "Fresh potatoes 1kg versatile vegetable for all dishes", price: 25, category: "Vegetables", stock: 250 },
    { name: "Green Chilli (100g)", description: "Fresh green chillies 100g for spicy cooking", price: 10, category: "Vegetables", stock: 300 },
    { name: "Ginger (250g)", description: "Fresh ginger 250g aromatic root for cooking and tea", price: 30, category: "Vegetables", stock: 150 },
    { name: "Garlic (250g)", description: "Fresh garlic 250g essential kitchen ingredient", price: 45, category: "Vegetables", stock: 150 },
    { name: "Coriander Leaves", description: "Fresh coriander leaves bunch for garnishing", price: 10, category: "Vegetables", stock: 200 },
    { name: "Spinach (250g)", description: "Fresh spinach palak leaves 250g iron rich greens", price: 20, category: "Vegetables", stock: 150 },

    // --- Tea & Coffee ---
    { name: "Tata Tea Gold 500g", description: "Tata Tea Gold 500g premium blend for strong tea", price: 265, category: "Beverages", stock: 80 },
    { name: "Nescafe Classic Coffee 100g", description: "Nescafe Classic Instant Coffee 100g rich aroma", price: 240, category: "Beverages", stock: 70 },
    { name: "Bru Instant Coffee 100g", description: "Bru Instant Coffee 100g smooth taste", price: 210, category: "Beverages", stock: 60 },
    { name: "Green Tea Lipton 25 bags", description: "Lipton Pure and Light Green Tea 25 bags antioxidant", price: 130, category: "Beverages", stock: 90 },

    // --- Baby Products ---
    { name: "Cerelac Baby Food 300g", description: "Nestle Cerelac Baby Cereal with Milk Wheat 300g", price: 220, category: "Baby Care", stock: 50 },
    { name: "Pampers Diapers (Medium 20pcs)", description: "Pampers Active Baby Diapers Medium size 20 count", price: 350, category: "Baby Care", stock: 60 },
    { name: "Johnson Baby Shampoo 200ml", description: "Johnson's Baby No More Tears Shampoo 200ml gentle", price: 160, category: "Baby Care", stock: 70 },
    { name: "Johnson Baby Powder 200g", description: "Johnson's Baby Powder 200g smooth and gentle", price: 130, category: "Baby Care", stock: 80 },
    { name: "Baby Wipes (72 pcs)", description: "Mee Mee Gentle baby wipes with aloe vera 72 count", price: 140, category: "Baby Care", stock: 90 },

    // --- Cooking Essentials ---
    { name: "Ghee Amul 500ml", description: "Amul Pure Ghee 500ml rich aroma for cooking", price: 310, category: "Grocery", stock: 60 },
    { name: "Tomato Ketchup Kissan 500g", description: "Kissan Fresh Tomato Ketchup 500g bottle", price: 99, category: "Food", stock: 100 },
    { name: "Soy Sauce Ching's 200ml", description: "Ching's Secret Dark Soy Sauce 200ml for Chinese cooking", price: 55, category: "Food", stock: 80 },
    { name: "Peanut Butter Pintola 350g", description: "Pintola All Natural Peanut Butter Creamy 350g protein rich", price: 250, category: "Food", stock: 50 },
    { name: "Honey Dabur 500g", description: "Dabur Honey 500g pure and natural honey", price: 230, category: "Food", stock: 70 },
    { name: "Oats Quaker 1kg", description: "Quaker Oats 1kg rolled oats for healthy breakfast", price: 180, category: "Food", stock: 60 },
    { name: "Cornflakes Kelloggs 475g", description: "Kellogg's Corn Flakes Original 475g breakfast cereal", price: 175, category: "Food", stock: 50 },
    { name: "Poha (Flattened Rice) 500g", description: "Medium Poha flattened rice 500g for quick breakfast", price: 35, category: "Grocery", stock: 120 },
    { name: "Besan (Gram Flour) 500g", description: "Besan gram flour 500g for pakoras and sweets", price: 55, category: "Grocery", stock: 100 },
    { name: "Rava (Semolina) 500g", description: "Fine Rava Sooji 500g for upma and halwa", price: 40, category: "Grocery", stock: 100 },

    // --- Dry Fruits & Protein ---
    { name: "Almonds 250g", description: "California almonds badam 250g premium quality brain food", price: 280, category: "Dry Fruits", stock: 50 },
    { name: "Cashew Nuts 250g", description: "Whole cashew nuts kaju 250g premium W320 grade", price: 320, category: "Dry Fruits", stock: 40 },
    { name: "Protein Bar Yoga Bar", description: "Yoga Bar Protein Bar Chocolate Brownie 60g", price: 80, category: "Health Food", stock: 80 },
    { name: "Whey Protein Powder 500g", description: "MuscleBlaze Whey Active Chocolate 500g protein supplement", price: 850, category: "Health Food", stock: 30 },
    { name: "Mixed Seeds 200g", description: "Mixed seeds pack sunflower pumpkin flax chia 200g", price: 180, category: "Health Food", stock: 50 },
];

const seedProducts = async () => {
    try {
        await mongoose.connect(process.env.DB_URI);
        console.log("MongoDB connected for seeding...");

        // Get an admin user to assign as product creator
        let adminUser = await User.findOne({ role: "admin" });
        if (!adminUser) {
            adminUser = await User.findOne();
        }

        if (!adminUser) {
            console.log("ERROR: No user found in database. Please create a user first.");
            process.exit(1);
        }

        console.log(`Using user: ${adminUser.name} (${adminUser.email}) as product creator`);

        // Prepare products with user reference and placeholder image
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

        // Insert all products
        const inserted = await Product.insertMany(productsToInsert);
        console.log(`\n✅ Successfully seeded ${inserted.length} products!\n`);

        // Print summary by category
        const categories = {};
        inserted.forEach(p => {
            categories[p.category] = (categories[p.category] || 0) + 1;
        });
        console.log("Products by category:");
        Object.entries(categories).sort().forEach(([cat, count]) => {
            console.log(`  ${cat}: ${count} products`);
        });

        process.exit(0);
    } catch (error) {
        console.error("Seeding failed:", error.message);
        process.exit(1);
    }
};

seedProducts();
