import Product from "../models/modelOfProduct.js";

const MISTRAL_API_URL = "https://api.mistral.ai/v1/chat/completions";

/**
 * AI Service Layer
 * Handles all communication with Mistral AI LLM
 * Modular, independent, with retry logic and error handling
 */

// Fetch available products from database for context
export const getProductCatalog = async () => {
    const products = await Product.find({ stock: { $gt: 0 } })
        .select("name price category stock description")
        .lean();
    return products;
};

// Build the prompt for AI cart generation
export const buildCartPrompt = (userPrompt, products) => {
    const productList = products.map(p => 
        `- ${p.name} | ₹${p.price} | Category: ${p.category} | Stock: ${p.stock}`
    ).join("\n");

    return `You are an intelligent shopping assistant for an e-commerce grocery/general store. 
The user wants help building a shopping cart based on their intent.

AVAILABLE PRODUCTS IN OUR STORE:
${productList}

USER REQUEST: "${userPrompt}"

INSTRUCTIONS:
1. Analyze the user's intent carefully.
2. ONLY recommend products that exist in our store (listed above).
3. Suggest appropriate quantities based on the request.
4. Provide reasoning for each item.
5. Calculate total estimated price.
6. Assign a confidence score (0-100) based on how well you could fulfill the request.
7. Add relevant tags (e.g., "breakfast", "protein", "budget-friendly").

RESPOND IN THIS EXACT JSON FORMAT (no markdown, no code blocks, just pure JSON):
{
    "items": [
        {
            "name": "exact product name from catalog",
            "quantity": 1,
            "reason": "why this item is recommended",
            "category": "product category"
        }
    ],
    "reasoning": "overall explanation of the cart",
    "confidenceScore": 85,
    "tags": ["tag1", "tag2"],
    "totalEstimatedPrice": 0
}

If no products match the request, return an empty items array with a low confidence score and explain in reasoning.
Calculate totalEstimatedPrice as sum of (price * quantity) for all items.`;
};

// Call Mistral API with retry logic
export const callMistralAPI = async (prompt, retries = 3) => {
    const apiKey = process.env.MISTRAL_API_KEY;
    
    if (!apiKey || apiKey === "YOUR_MISTRAL_API_KEY_HERE") {
        throw new Error("MISTRAL_API_KEY is not configured. Please add your API key in config.env");
    }

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const response = await fetch(MISTRAL_API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: "mistral-small-latest",
                    messages: [
                        {
                            role: "user",
                            content: prompt
                        }
                    ],
                    temperature: 0.7,
                    max_tokens: 2048,
                    response_format: { type: "json_object" }
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(`Mistral API error: ${response.status} - ${errorData?.message || errorData?.detail || "Unknown error"}`);
            }

            const data = await response.json();
            const textContent = data?.choices?.[0]?.message?.content;

            if (!textContent) {
                throw new Error("Empty response from Mistral API");
            }

            return textContent;
        } catch (error) {
            if (attempt === retries) {
                throw error;
            }
            // Wait before retry (exponential backoff)
            await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
    }
};

// Parse and validate AI response
export const parseAIResponse = (responseText, products) => {
    // Clean the response - remove markdown code blocks if present
    let cleaned = responseText.trim();
    if (cleaned.startsWith("```json")) {
        cleaned = cleaned.slice(7);
    }
    if (cleaned.startsWith("```")) {
        cleaned = cleaned.slice(3);
    }
    if (cleaned.endsWith("```")) {
        cleaned = cleaned.slice(0, -3);
    }
    cleaned = cleaned.trim();

    let parsed;
    try {
        parsed = JSON.parse(cleaned);
    } catch (e) {
        throw new Error("Failed to parse AI response as JSON");
    }

    // Validate structure
    if (!parsed.items || !Array.isArray(parsed.items)) {
        throw new Error("Invalid AI response structure: missing items array");
    }

    // Map AI items to actual products in our database
    const validatedItems = [];
    for (const item of parsed.items) {
        const matchedProduct = products.find(p => 
            p.name.toLowerCase() === item.name.toLowerCase() ||
            p.name.toLowerCase().includes(item.name.toLowerCase()) ||
            item.name.toLowerCase().includes(p.name.toLowerCase())
        );

        if (matchedProduct) {
            const quantity = Math.min(item.quantity || 1, matchedProduct.stock);
            validatedItems.push({
                product: matchedProduct._id,
                name: matchedProduct.name,
                price: matchedProduct.price,
                quantity,
                reason: item.reason || "",
                category: matchedProduct.category,
                image: matchedProduct.image?.[0]?.url || ""
            });
        }
    }

    // Recalculate total
    const totalEstimatedPrice = validatedItems.reduce(
        (sum, item) => sum + (item.price * item.quantity), 0
    );

    return {
        items: validatedItems,
        reasoning: parsed.reasoning || "Cart generated based on your request.",
        confidenceScore: Math.min(Math.max(parsed.confidenceScore || 50, 0), 100),
        tags: parsed.tags || [],
        totalEstimatedPrice
    };
};

// Main function: Generate AI Cart
export const generateAICart = async (userPrompt) => {
    // 1. Get product catalog
    const products = await getProductCatalog();

    if (!products || products.length === 0) {
        return {
            items: [],
            reasoning: "No products are currently available in the store.",
            confidenceScore: 0,
            tags: [],
            totalEstimatedPrice: 0
        };
    }

    // 2. Build prompt
    const fullPrompt = buildCartPrompt(userPrompt, products);

    // 3. Call AI
    const aiResponse = await callMistralAPI(fullPrompt);

    // 4. Parse and validate response
    const result = parseAIResponse(aiResponse, products);

    return result;
};
