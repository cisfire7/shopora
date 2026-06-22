import handleAsyncError from "../middleware/handleAsyncError.js";
import Order from "../models/orderModel.js";
import Product from "../models/modelOfProduct.js";

// Public: Get popular everyday essentials for Smart Refill section
export const getSmartRefillProducts = handleAsyncError(async (req, res, next) => {
    // Fetch products from categories people commonly refill
    const refillCategories = ["Dairy", "Grocery", "Beverages", "Food", "Vegetables", "Bakery", "Personal Care"];
    
    const products = await Product.find({
        category: { $in: refillCategories },
        stock: { $gt: 0 }
    })
    .select("name price category image stock")
    .sort({ ratings: -1 })
    .limit(12)
    .lean();

    res.status(200).json({ success: true, products });
});

// Smart Replenishment - Analyze past orders and predict refill needs
export const getReplenishment = handleAsyncError(async (req, res, next) => {
    const userId = req.user._id;

    // Get all delivered/completed orders for this user
    const orders = await Order.find({ user: userId })
        .sort({ createdAt: -1 })
        .lean();

    if (!orders || orders.length === 0) {
        return res.status(200).json({ success: true, predictions: [] });
    }

    // Analyze purchase frequency per product
    const productHistory = {};

    for (const order of orders) {
        for (const item of order.orderItems) {
            const key = item.product?.toString() || item.name;
            if (!productHistory[key]) {
                productHistory[key] = {
                    productId: item.product,
                    name: item.name,
                    price: item.price,
                    image: item.image,
                    dates: [],
                    quantities: []
                };
            }
            productHistory[key].dates.push(new Date(order.createdAt));
            productHistory[key].quantities.push(item.quantity);
        }
    }

    const now = new Date();
    const predictions = [];

    for (const [key, data] of Object.entries(productHistory)) {
        if (data.dates.length < 2) continue; // Need at least 2 purchases for pattern

        // Sort dates chronologically
        data.dates.sort((a, b) => a - b);

        // Calculate average frequency in days
        let totalGap = 0;
        for (let i = 1; i < data.dates.length; i++) {
            totalGap += (data.dates[i] - data.dates[i - 1]) / (1000 * 60 * 60 * 24);
        }
        const avgFrequencyDays = Math.round(totalGap / (data.dates.length - 1));

        // Days since last purchase
        const lastPurchase = data.dates[data.dates.length - 1];
        const daysSinceLastPurchase = Math.round((now - lastPurchase) / (1000 * 60 * 60 * 24));

        // Determine urgency
        let urgency = 'low';
        let message = '';
        if (daysSinceLastPurchase >= avgFrequencyDays) {
            urgency = 'high';
            message = `You're overdue! Usually you buy this every ${avgFrequencyDays} days.`;
        } else if (daysSinceLastPurchase >= avgFrequencyDays * 0.7) {
            urgency = 'medium';
            message = `Running low soon. Your refill is due in ~${avgFrequencyDays - daysSinceLastPurchase} days.`;
        } else {
            message = `Next refill estimated in ~${avgFrequencyDays - daysSinceLastPurchase} days.`;
        }

        // Get product category
        const product = await Product.findById(data.productId).select("category").lean();

        // Average quantity
        const avgQty = Math.round(data.quantities.reduce((a, b) => a + b, 0) / data.quantities.length);

        predictions.push({
            productId: data.productId,
            name: data.name,
            price: data.price,
            category: product?.category || "General",
            daysSinceLastPurchase,
            avgFrequencyDays,
            orderCount: data.dates.length,
            suggestedQuantity: avgQty,
            urgency,
            message
        });
    }

    // Sort by urgency (high first)
    const urgencyOrder = { high: 0, medium: 1, low: 2 };
    predictions.sort((a, b) => urgencyOrder[a.urgency] - urgencyOrder[b.urgency]);

    res.status(200).json({ success: true, predictions });
});

// Personalized & Explainable AI Recommendations
export const getPersonalizedRecommendations = handleAsyncError(async (req, res, next) => {
    const userId = req.user._id;

    // Get user's order history
    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 }).lean();

    if (!orders || orders.length === 0) {
        return res.status(200).json({ success: true, recommendations: [] });
    }

    // Analyze user preferences
    const categoryCount = {};
    const priceRange = { min: Infinity, max: 0, total: 0, count: 0 };
    const purchasedProductIds = new Set();

    for (const order of orders) {
        for (const item of order.orderItems) {
            purchasedProductIds.add(item.product?.toString());
            priceRange.total += item.price;
            priceRange.count++;
            if (item.price < priceRange.min) priceRange.min = item.price;
            if (item.price > priceRange.max) priceRange.max = item.price;

            const product = await Product.findById(item.product).select("category").lean();
            if (product?.category) {
                categoryCount[product.category] = (categoryCount[product.category] || 0) + 1;
            }
        }
    }

    const avgPrice = priceRange.total / priceRange.count;

    // Get top categories
    const topCategories = Object.entries(categoryCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([cat]) => cat);

    // Find products user hasn't bought yet from their preferred categories
    const recommendedProducts = await Product.find({
        _id: { $nin: [...purchasedProductIds].filter(Boolean) },
        category: { $in: topCategories },
        stock: { $gt: 0 }
    }).limit(10).lean();

    const recommendations = [];

    for (const product of recommendedProducts) {
        // Find budget and premium alternatives
        const alternatives = await Product.find({
            _id: { $ne: product._id },
            category: product.category,
            stock: { $gt: 0 }
        }).select("name price").lean();

        const budgetAlt = alternatives
            .filter(a => a.price < product.price)
            .sort((a, b) => a.price - b.price)
            .slice(0, 1)
            .map(a => ({ name: a.name, price: a.price, type: 'budget' }));

        const premiumAlt = alternatives
            .filter(a => a.price > product.price)
            .sort((a, b) => a.price - b.price)
            .slice(0, 1)
            .map(a => ({ name: a.name, price: a.price, type: 'premium' }));

        // Calculate match score based on category preference and price range
        const catScore = ((categoryCount[product.category] || 0) / Math.max(...Object.values(categoryCount))) * 60;
        const priceScore = product.price <= avgPrice * 1.3 ? 30 : 15;
        const matchScore = Math.min(Math.round(catScore + priceScore + 10), 98);

        // Generate explanation
        const timesInCategory = categoryCount[product.category] || 0;
        const explanation = `You've ordered from "${product.category}" ${timesInCategory} times. This product fits your average budget of ₹${Math.round(avgPrice)} and matches your shopping patterns.`;

        recommendations.push({
            productId: product._id,
            name: product.name,
            price: product.price,
            category: product.category,
            matchScore,
            explanation,
            alternatives: [...budgetAlt, ...premiumAlt]
        });
    }

    // Sort by match score
    recommendations.sort((a, b) => b.matchScore - a.matchScore);

    res.status(200).json({ success: true, recommendations });
});
