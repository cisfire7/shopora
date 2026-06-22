import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/modelOfProduct.js";
import User from "./models/userModel.js";

dotenv.config({ path: "./config/config.env" });

const products = [
    // --- FASHION: Men's Clothing ---
    { name: "Men Slim Fit Casual Shirt", description: "Cotton slim fit casual shirt for men, comfortable daily wear", price: 599, category: "Men Fashion", stock: 60 },
    { name: "Men Formal White Shirt", description: "Premium cotton formal white shirt for office and meetings", price: 799, category: "Men Fashion", stock: 50 },
    { name: "Men Denim Jeans Slim", description: "Stretchable slim fit denim jeans dark blue wash", price: 999, category: "Men Fashion", stock: 70 },
    { name: "Men Cargo Pants", description: "6 pocket cargo pants for men olive green comfortable fit", price: 850, category: "Men Fashion", stock: 40 },
    { name: "Men Polo T-Shirt", description: "Classic polo collar t-shirt cotton blend navy blue", price: 499, category: "Men Fashion", stock: 80 },
    { name: "Men Hoodie Sweatshirt", description: "Fleece hoodie pullover sweatshirt with kangaroo pocket black", price: 899, category: "Men Fashion", stock: 45 },
    { name: "Men Kurta Pajama Set", description: "Cotton kurta pajama set ethnic wear white festive", price: 1199, category: "Men Fashion", stock: 30 },
    { name: "Men Blazer Slim Fit", description: "Single breasted slim fit blazer for formal occasions navy", price: 2499, category: "Men Fashion", stock: 20 },
    { name: "Men Bermuda Shorts", description: "Cotton bermuda shorts knee length casual wear grey", price: 450, category: "Men Fashion", stock: 60 },
    { name: "Men Leather Belt", description: "Genuine leather belt with auto-lock buckle brown", price: 399, category: "Men Fashion", stock: 80 },

    // --- FASHION: Women's Clothing ---
    { name: "Women Kurti Cotton", description: "Straight fit cotton kurti with block print blue daily wear", price: 549, category: "Women Fashion", stock: 70 },
    { name: "Women Anarkali Dress", description: "Flared anarkali kurta with dupatta maroon ethnic wear", price: 1299, category: "Women Fashion", stock: 35 },
    { name: "Women Saree Silk", description: "Banarasi silk saree with blouse piece golden border", price: 1899, category: "Women Fashion", stock: 25 },
    { name: "Women Palazzo Pants", description: "Wide leg palazzo pants rayon black comfortable", price: 450, category: "Women Fashion", stock: 60 },
    { name: "Women Leggings Cotton", description: "Ankle length cotton leggings stretchable pack of 2", price: 399, category: "Women Fashion", stock: 100 },
    { name: "Women Crop Top", description: "Solid crop top round neck half sleeve white casual", price: 349, category: "Women Fashion", stock: 80 },
    { name: "Women Denim Jacket", description: "Classic denim jacket button closure medium wash blue", price: 1199, category: "Women Fashion", stock: 30 },
    { name: "Women Maxi Dress", description: "Floral print maxi dress sleeveless summer wear", price: 899, category: "Women Fashion", stock: 40 },
    { name: "Women Sports Bra", description: "High support sports bra for gym workout padded black", price: 499, category: "Women Fashion", stock: 50 },
    { name: "Women Dupatta Chiffon", description: "Printed chiffon dupatta lightweight multicolor", price: 299, category: "Women Fashion", stock: 70 },

    // --- FASHION: Footwear ---
    { name: "Men Sneakers White", description: "Casual white sneakers lightweight comfortable daily wear", price: 1299, category: "Footwear", stock: 40 },
    { name: "Men Formal Shoes Black", description: "Leather formal shoes lace-up black office wear", price: 1799, category: "Footwear", stock: 30 },
    { name: "Men Sports Running Shoes", description: "Lightweight running shoes mesh breathable grey", price: 1499, category: "Footwear", stock: 45 },
    { name: "Men Sandals Leather", description: "Comfortable leather sandals daily wear brown", price: 699, category: "Footwear", stock: 50 },
    { name: "Women Heels Block", description: "Block heel sandals party wear golden 3 inch", price: 999, category: "Footwear", stock: 35 },
    { name: "Women Flats Bellies", description: "Pointed toe bellies flat shoes black comfortable", price: 599, category: "Footwear", stock: 50 },
    { name: "Women Sneakers Pink", description: "Casual sneakers lightweight pink and white", price: 1199, category: "Footwear", stock: 40 },
    { name: "Slippers Flip Flop Men", description: "Comfortable daily wear flip flops cushioned sole", price: 299, category: "Footwear", stock: 100 },
    { name: "Slippers Women", description: "Soft indoor outdoor slippers for women multicolor", price: 249, category: "Footwear", stock: 80 },
    { name: "Kids School Shoes Black", description: "Velcro school shoes for kids black uniform approved", price: 599, category: "Footwear", stock: 60 },

    // --- MAKEUP & BEAUTY ---
    { name: "Lakme Compact Powder", description: "Lakme 9 to 5 flawless matte compact powder natural", price: 225, category: "Makeup", stock: 70 },
    { name: "Maybelline Lipstick Red", description: "Maybelline Color Sensational creamy matte lipstick red carpet", price: 350, category: "Makeup", stock: 60 },
    { name: "Lakme Kajal Black", description: "Lakme Eyeconic kajal deep black smudge proof 22hr", price: 180, category: "Makeup", stock: 100 },
    { name: "Maybelline Mascara", description: "Maybelline Colossal Volume Express mascara waterproof black", price: 299, category: "Makeup", stock: 50 },
    { name: "Lakme Foundation", description: "Lakme Perfecting Liquid Foundation marble shade 27ml", price: 280, category: "Makeup", stock: 45 },
    { name: "Nykaa Nail Polish Red", description: "Nykaa salon shine gel nail lacquer cherry red", price: 199, category: "Makeup", stock: 80 },
    { name: "Faces Blush On", description: "Faces Canada baked blush warm apricot shimmer", price: 399, category: "Makeup", stock: 40 },
    { name: "Maybelline Concealer", description: "Maybelline Fit Me liquid concealer fair shade", price: 350, category: "Makeup", stock: 50 },
    { name: "Lakme Eyeliner Pen", description: "Lakme Absolute liner pen tip fine black waterproof", price: 275, category: "Makeup", stock: 60 },
    { name: "Maybelline BB Cream", description: "Maybelline Dream Fresh BB cream 8 in 1 skin perfector", price: 299, category: "Makeup", stock: 55 },
    { name: "Sugar Lip Crayon", description: "Sugar Matte As Hell crayon lipstick 01 Scarlett O Hara", price: 499, category: "Makeup", stock: 40 },
    { name: "Colorbar Eyeshadow Palette", description: "Colorbar 8 shade eyeshadow palette shimmer and matte", price: 699, category: "Makeup", stock: 30 },
    { name: "Plum Lip Gloss", description: "Plum juicy lip gloss hydrating berry pink shine", price: 325, category: "Makeup", stock: 50 },
    { name: "Makeup Remover Wipes", description: "Garnier micellar cleansing makeup remover wipes 25 count", price: 175, category: "Makeup", stock: 70 },
    { name: "Setting Spray Faces", description: "Faces Canada Ultime Pro setting spray long lasting 50ml", price: 450, category: "Makeup", stock: 35 },

    // --- SKINCARE ---
    { name: "Mamaearth Face Wash", description: "Mamaearth Vitamin C face wash for glowing skin 100ml", price: 299, category: "Skincare", stock: 60 },
    { name: "Neutrogena Sunscreen SPF50", description: "Neutrogena Ultra Sheer Dry-Touch sunblock SPF50 88ml", price: 499, category: "Skincare", stock: 40 },
    { name: "Biotique Face Cream", description: "Biotique Morning Nectar skin moisturizer 50g", price: 199, category: "Skincare", stock: 50 },
    { name: "The Ordinary Niacinamide", description: "The Ordinary Niacinamide 10% + Zinc 1% serum 30ml", price: 590, category: "Skincare", stock: 30 },
    { name: "Himalaya Neem Face Pack", description: "Himalaya Purifying Neem face pack 100ml", price: 120, category: "Skincare", stock: 70 },
    { name: "Dot & Key Moisturizer", description: "Dot & Key Cica calming moisturizer sensitive skin 60ml", price: 545, category: "Skincare", stock: 35 },
    { name: "Vaseline Body Lotion 400ml", description: "Vaseline Intensive Care deep moisture body lotion 400ml", price: 260, category: "Skincare", stock: 50 },
    { name: "Sheet Mask Garnier", description: "Garnier Skin Naturals hydra bomb sheet mask pack of 5", price: 350, category: "Skincare", stock: 40 },
    { name: "Under Eye Cream mCaffeine", description: "mCaffeine Coffee under eye cream dark circle removal 30ml", price: 449, category: "Skincare", stock: 35 },
    { name: "Lip Balm Nivea", description: "Nivea Essential Care lip balm SPF 10 moisturizing 4.8g", price: 120, category: "Skincare", stock: 90 },

    // --- MEDICINE & HEALTH ---
    { name: "Paracetamol Dolo 650", description: "Dolo 650 paracetamol tablets for fever and pain 15 strips", price: 30, category: "Medicine", stock: 200 },
    { name: "Azithromycin 500mg", description: "Azithromycin 500mg antibiotic tablets strip of 3", price: 85, category: "Medicine", stock: 100 },
    { name: "Cetirizine Tablets", description: "Cetirizine 10mg antiallergy tablets strip of 10", price: 25, category: "Medicine", stock: 200 },
    { name: "Omeprazole Capsules", description: "Omeprazole 20mg capsules for acidity strip of 10", price: 45, category: "Medicine", stock: 150 },
    { name: "Ibuprofen 400mg", description: "Ibuprofen 400mg tablets for pain and inflammation strip of 10", price: 35, category: "Medicine", stock: 180 },
    { name: "Betadine Ointment 20g", description: "Betadine antiseptic ointment for wound care 20g", price: 55, category: "Medicine", stock: 100 },
    { name: "Volini Pain Relief Gel 50g", description: "Volini pain relief gel for muscle and joint pain 50g", price: 130, category: "Medicine", stock: 80 },
    { name: "Cough Syrup Benadryl 150ml", description: "Benadryl cough syrup for dry cough relief 150ml", price: 110, category: "Medicine", stock: 70 },
    { name: "Vitamin D3 Tablets", description: "Vitamin D3 60000 IU chewable tablets strip of 4", price: 120, category: "Medicine", stock: 60 },
    { name: "Iron Folic Acid Tablets", description: "Autrin iron folic acid supplement strip of 30", price: 65, category: "Medicine", stock: 80 },
    { name: "Calcium Tablets Shelcal", description: "Shelcal 500mg calcium with Vitamin D3 strip of 15", price: 95, category: "Medicine", stock: 70 },
    { name: "B Complex Tablets", description: "Becosules B-Complex capsules pack of 20", price: 25, category: "Medicine", stock: 150 },
    { name: "Antifungal Cream Candid", description: "Candid cream clotrimazole antifungal 20g", price: 75, category: "Medicine", stock: 80 },
    { name: "Eye Drops Refresh Tears", description: "Refresh Tears lubricant eye drops 10ml", price: 90, category: "Medicine", stock: 60 },
    { name: "Nasal Spray Otrivin", description: "Otrivin nasal spray for blocked nose relief 10ml", price: 95, category: "Medicine", stock: 70 },

    // --- WATCHES ---
    { name: "Titan Analog Watch Men", description: "Titan Karishma analog watch for men silver dial leather strap", price: 2495, category: "Watches", stock: 20 },
    { name: "Fastrack Casual Watch Men", description: "Fastrack analog casual watch for men black dial sports", price: 1295, category: "Watches", stock: 30 },
    { name: "Sonata Digital Watch", description: "Sonata digital sports watch water resistant black", price: 695, category: "Watches", stock: 40 },
    { name: "Casio G-Shock Watch", description: "Casio G-Shock digital analog dual time shock resistant", price: 4995, category: "Watches", stock: 15 },
    { name: "Titan Raga Women Watch", description: "Titan Raga analog watch for women golden bracelet elegant", price: 2995, category: "Watches", stock: 20 },
    { name: "Fastrack Women Watch", description: "Fastrack analog watch for women rose gold minimal dial", price: 1495, category: "Watches", stock: 25 },
    { name: "Apple Watch SE Band", description: "Silicone sport band for Apple Watch compatible strap", price: 299, category: "Watches", stock: 50 },
    { name: "Noise Smart Watch", description: "Noise ColorFit Pro 4 smartwatch AMOLED 1.72 inch", price: 2999, category: "Watches", stock: 25 },
    { name: "Fire-Boltt Smart Watch", description: "Fire-Boltt Phoenix smartwatch Bluetooth calling SpO2", price: 1799, category: "Watches", stock: 30 },
    { name: "Kids Digital Watch", description: "Colorful digital LED watch for kids waterproof cartoon", price: 199, category: "Watches", stock: 60 },

    // --- JEWELLERY & ACCESSORIES ---
    { name: "Gold Plated Earrings", description: "Gold plated traditional jhumka earrings for women", price: 350, category: "Jewellery", stock: 50 },
    { name: "Silver Chain Necklace", description: "925 Sterling silver chain necklace 18 inch for men", price: 899, category: "Jewellery", stock: 30 },
    { name: "Pearl Necklace Set", description: "Artificial pearl necklace set with earrings bridal", price: 599, category: "Jewellery", stock: 35 },
    { name: "Men Bracelet Leather", description: "Multi layer leather bracelet for men with metal clasp", price: 249, category: "Jewellery", stock: 60 },
    { name: "Women Bangles Set (6 pcs)", description: "Traditional gold tone bangles set of 6 festive wear", price: 399, category: "Jewellery", stock: 40 },
    { name: "Nose Ring Gold Plated", description: "Small gold plated nose ring hoop for daily wear", price: 149, category: "Jewellery", stock: 70 },
    { name: "Anklet Silver Tone", description: "Silver tone anklet payal with ghungroo bells pair", price: 299, category: "Jewellery", stock: 45 },
    { name: "Ring Adjustable Women", description: "Adjustable statement ring gold tone floral design", price: 199, category: "Jewellery", stock: 60 },

    // --- BAGS & LUGGAGE ---
    { name: "Laptop Bag 15.6 inch", description: "Laptop bag 15.6 inch padded water resistant office bag", price: 799, category: "Bags", stock: 40 },
    { name: "Women Handbag PU Leather", description: "Women PU leather handbag shoulder bag brown stylish", price: 699, category: "Bags", stock: 35 },
    { name: "Sling Bag Women", description: "Crossbody sling bag for women compact phone purse", price: 399, category: "Bags", stock: 50 },
    { name: "Travel Duffle Bag", description: "Foldable travel duffle bag 40L lightweight gym bag", price: 599, category: "Bags", stock: 30 },
    { name: "School Bag Kids", description: "Cartoon print school backpack for kids lightweight", price: 499, category: "Bags", stock: 40 },
    { name: "Trolley Suitcase 20 inch", description: "Hard shell trolley suitcase 20 inch cabin size spinner", price: 2499, category: "Bags", stock: 15 },
    { name: "Waist Pouch Sports", description: "Running waist pouch belt bag for phone keys compact", price: 249, category: "Bags", stock: 60 },

    // --- HAIR CARE ---
    { name: "Shampoo Dove 340ml", description: "Dove Intense Repair shampoo for damaged hair 340ml", price: 240, category: "Hair Care", stock: 60 },
    { name: "Conditioner Tresemme 340ml", description: "TRESemme Keratin Smooth conditioner frizz control 340ml", price: 270, category: "Hair Care", stock: 50 },
    { name: "Hair Oil Parachute Advansed", description: "Parachute Advansed Jasmine hair oil non-sticky 300ml", price: 140, category: "Hair Care", stock: 80 },
    { name: "Hair Serum Livon", description: "Livon hair serum for silky shiny smooth hair 100ml", price: 199, category: "Hair Care", stock: 50 },
    { name: "Hair Color Garnier Black", description: "Garnier Color Naturals shade 1 Natural Black hair color", price: 135, category: "Hair Care", stock: 60 },
    { name: "Anti-Dandruff Shampoo Clinic Plus", description: "Clinic Plus Strong & Long anti-dandruff shampoo 340ml", price: 180, category: "Hair Care", stock: 55 },
    { name: "Hair Gel Set Wet", description: "Set Wet hair gel ultimate hold styling 100ml", price: 99, category: "Hair Care", stock: 80 },
    { name: "Comb Wide Tooth", description: "Wide tooth detangling comb wooden for all hair types", price: 75, category: "Hair Care", stock: 100 },

    // --- PERFUME & DEODORANT ---
    { name: "Wild Stone Deo 150ml", description: "Wild Stone Ultra Sensual deodorant body spray men 150ml", price: 199, category: "Perfume", stock: 60 },
    { name: "Nivea Men Deo Roll On", description: "Nivea Men Deep Impact roll on deodorant 50ml", price: 175, category: "Perfume", stock: 50 },
    { name: "Engage Woman Deo", description: "Engage Spell deodorant body spray for women 150ml", price: 180, category: "Perfume", stock: 55 },
    { name: "Denver Perfume Men 60ml", description: "Denver Hamilton honour perfume for men 60ml EDP", price: 299, category: "Perfume", stock: 40 },
    { name: "Fogg Scent Men 100ml", description: "Fogg Scent Intensio EDP perfume for men 100ml", price: 450, category: "Perfume", stock: 35 },
    { name: "Secret Temptation Deo Women", description: "Secret Temptation Romance deo for women 150ml", price: 165, category: "Perfume", stock: 50 },
    { name: "Park Avenue Perfume 50ml", description: "Park Avenue Voyage perfume for men 50ml premium", price: 349, category: "Perfume", stock: 30 },

    // --- HOME DECOR ---
    { name: "Cushion Cover Set (5 pcs)", description: "Printed cushion cover set of 5 velvet 16x16 inch", price: 499, category: "Home Decor", stock: 30 },
    { name: "Wall Clock Round 12 inch", description: "Silent sweep wall clock 12 inch wooden frame modern", price: 599, category: "Home Decor", stock: 25 },
    { name: "Bedsheet Double Queen Size", description: "Cotton double bedsheet with 2 pillow covers floral print", price: 699, category: "Home Decor", stock: 35 },
    { name: "Towel Bath Large", description: "Premium cotton bath towel large 70x140 cm soft absorbent", price: 349, category: "Home Decor", stock: 50 },
    { name: "Door Mat Welcome", description: "Anti-slip door mat welcome print coir natural fiber", price: 199, category: "Home Decor", stock: 40 },
    { name: "Artificial Plant Small", description: "Artificial green plant with pot tabletop desk decoration", price: 299, category: "Home Decor", stock: 30 },
    { name: "Photo Frame Set (3 pcs)", description: "Wooden photo frame set of 3 wall hanging collage", price: 399, category: "Home Decor", stock: 25 },
    { name: "Curtain Window 7 feet", description: "Polyester window curtain 7 feet plain solid grey pair", price: 599, category: "Home Decor", stock: 30 },
];

const seedProducts = async () => {
    try {
        await mongoose.connect(process.env.DB_URI);
        console.log("MongoDB connected for seeding...");

        let adminUser = await User.findOne({ role: "admin" });
        if (!adminUser) adminUser = await User.findOne();

        if (!adminUser) {
            console.log("ERROR: No user found in database.");
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

        const totalCount = await Product.countDocuments();
        console.log(`\n📦 Total products in database: ${totalCount}`);

        process.exit(0);
    } catch (error) {
        console.error("Seeding failed:", error.message);
        process.exit(1);
    }
};

seedProducts();
