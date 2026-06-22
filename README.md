# 🛒 AI-Powered Intent Commerce Platform

> A full-stack MERN e-commerce platform transformed into an **AI-powered Intent Commerce** system where users describe what they want in natural language and the AI automatically builds their shopping cart.

![Node.js](https://img.shields.io/badge/Node.js-v20+-green)
![React](https://img.shields.io/badge/React-v19-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen)
![AI](https://img.shields.io/badge/AI-Mistral-purple)

---

## 🎯 What Makes This Special?

Instead of manually browsing and searching products, users simply **describe their intent**:

- *"Prepare breakfast for 5 people"*
- *"Weekly groceries under ₹3000"*
- *"Party snacks for 20 guests"*
- *"Cooking ingredients for Paneer Butter Masala"*
- *"High protein vegetarian diet"*

The AI understands the intent and **automatically generates a complete shopping cart** with recommended products, quantities, reasoning, and estimated total.

---

## ✨ Features

### Core E-Commerce
- ✅ User Authentication (Register/Login/Logout)
- ✅ JWT Authorization with HTTP-only cookies
- ✅ Role-Based Access Control (Admin/User)
- ✅ Product Management (CRUD with Cloudinary image upload)
- ✅ Product Categories, Search & Filters
- ✅ Product Reviews & Ratings
- ✅ Shopping Cart (localStorage persistence)
- ✅ Order Management with Status Tracking
- ✅ Payment Integration (Razorpay)
- ✅ Admin Dashboard (Products, Users, Orders)
- ✅ Responsive Frontend (Mobile-first design)

### 🤖 AI Features

#### 1. AI Cart Generation
- Natural language prompt → AI-generated shopping cart
- Confidence score, reasoning, and category tags
- Add all to cart, add individual items, regenerate, save

#### 2. AI Chatbot (Floating Widget)
- Always-visible chatbot button on bottom-right
- Type what you need → items auto-added to cart
- Conversational interface with full response details

#### 3. Smart Refill (Homepage Section)
- AI predicts products you buy regularly
- Shows everyday essentials for quick reorder
- One-click add all, items refresh after adding

#### 4. Smart Replenishment (Full Page)
- Analyzes purchase history for repeat patterns
- Calculates average frequency per product
- Urgency indicators (🔴 High / 🟡 Medium / 🟢 Low)
- Predicts when next refill is due

#### 5. Explainable & Personalized AI
- AI explains **why** each product is recommended
- Match score based on user preferences
- Budget & Premium alternatives for each suggestion
- Learns from order history, categories, price range

#### 6. "Why" Button on AI Recommendations
- Every AI-recommended product has a "Why" button
- Expands to show the AI's reasoning for that item

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Redux Toolkit, React Router v7, MUI Icons, Axios, Vite |
| **Backend** | Node.js, Express.js, ES Modules |
| **Database** | MongoDB Atlas, Mongoose ODM |
| **AI** | Mistral AI API (mistral-small-latest) |
| **Auth** | JWT, bcryptjs, HTTP-only cookies |
| **File Upload** | Cloudinary, express-fileupload |
| **Payment** | Razorpay |
| **Styling** | CSS (component-scoped, responsive) |

---

## 📁 Project Structure

```
├── Backend/
│   ├── config/
│   │   ├── config.env          # Environment variables
│   │   └── db.js               # MongoDB connection
│   ├── controllers/
│   │   ├── aiController.js     # AI cart generation, save, history
│   │   ├── aiReplenishController.js  # Replenishment & personalized AI
│   │   ├── orderController.js
│   │   ├── paymentController.js
│   │   ├── productController.js
│   │   └── userController.js
│   ├── middleware/
│   │   ├── error.js            # Global error handler
│   │   ├── handleAsyncError.js # Async wrapper
│   │   └── userAuth.js         # JWT verification & role check
│   ├── models/
│   │   ├── aiCartModel.js      # AI-generated cart schema
│   │   ├── aiConversationModel.js  # AI conversation history
│   │   ├── modelOfProduct.js   # Product schema
│   │   ├── orderModel.js       # Order schema
│   │   └── userModel.js        # User schema
│   ├── routes/
│   │   ├── aiRoutes.js         # AI API endpoints
│   │   ├── orderRoutes.js
│   │   ├── paymentRoutes.js
│   │   ├── productRoutes.js
│   │   └── userRoutes.js
│   ├── services/
│   │   └── aiService.js        # AI service layer (Mistral API)
│   ├── utils/
│   │   ├── apiFunctionality.js # Search, filter, pagination
│   │   ├── handleError.js      # Custom error class
│   │   ├── jwtToken.js         # Token + cookie sender
│   │   └── sendMail.js         # Email utility
│   ├── app.js                  # Express app setup
│   └── server.js               # Server entry point
│
├── Frontend/
│   ├── public/images/          # Static images
│   ├── src/
│   │   ├── AI/                 # AI feature components
│   │   │   ├── AIChatbot.jsx       # Floating chatbot widget
│   │   │   ├── AIAssistant.jsx     # AI assistant page
│   │   │   ├── AICartPreview.jsx   # Generated cart display
│   │   │   ├── AIHistory.jsx       # Cart history page
│   │   │   ├── AIPromptSuggestions.jsx  # Suggestion cards
│   │   │   ├── ExplainableAI.jsx   # Personalized recommendations
│   │   │   ├── SmartReplenishment.jsx   # Full replenishment page
│   │   │   └── SmartReplenishmentHome.jsx  # Homepage section
│   │   ├── AIStyles/           # CSS for AI components
│   │   ├── Admin/              # Admin panel pages
│   │   ├── Cart/               # Cart, Shipping, Payment
│   │   ├── Components/         # Shared components
│   │   ├── Orders/             # Order pages
│   │   ├── Pages/              # Home, Products, etc.
│   │   ├── User/               # Auth & profile pages
│   │   ├── features/           # Redux slices
│   │   │   ├── ai/aiSlice.js
│   │   │   ├── cart/cartSlice.js
│   │   │   ├── order/orderSlice.js
│   │   │   ├── products/productSlice.js
│   │   │   └── user/userSlice.js
│   │   ├── app/store.js        # Redux store
│   │   ├── App.jsx             # Main router
│   │   └── main.jsx            # Entry point
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- MongoDB Atlas account (or local MongoDB)
- Mistral AI API key ([Get free key](https://console.mistral.ai/api-keys/))
- Cloudinary account
- Razorpay account (test mode)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd E_commerce

# Install backend dependencies
cd Backend
npm install

# Install frontend dependencies
cd ../Frontend
npm install
```

### Environment Variables

Create/edit `Backend/config/config.env`:

```env
PORT=8000
DB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/dbname
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=3d
NODE_ENV=DEVELOPMENT
COOKIE_EXPIRE=2
SMTP_USER=your_email@gmail.com
SMTP_SERVICE=gmail
SMTP_PASSWORD=your_app_password
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
RAZORPAY_API_KEY=rzp_test_xxxxx
RAZORPAY_API_SECRET=your_razorpay_secret
MISTRAL_API_KEY=your_mistral_api_key
```

### Run in Development

```bash
# Terminal 1 - Backend
cd Backend
node server.js

# Terminal 2 - Frontend (dev mode with hot reload)
cd Frontend
npm run dev
```

### Run in Production

```bash
# Build frontend
cd Frontend
npm run build

# Start server (serves frontend build)
cd ..
node Backend/server.js
```

Visit `http://localhost:8000`

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/register` | Register user |
| POST | `/api/v1/login` | Login user |
| POST | `/api/v1/logout` | Logout user |
| GET | `/api/v1/profile` | Get user profile |
| PUT | `/api/v1/profile/update` | Update profile |
| PUT | `/api/v1/password/update` | Change password |
| POST | `/api/v1/forgot/password` | Forgot password email |
| PUT | `/api/v1/reset/:token` | Reset password |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/products` | Get all products (paginated) |
| GET | `/api/v1/product/:id` | Get product details |
| PUT | `/api/v1/review` | Create/update review |
| GET | `/api/v1/reviews?id=` | Get product reviews |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/new/order` | Create order |
| GET | `/api/v1/orders/user` | Get my orders |
| GET | `/api/v1/order/:id` | Get order details |

### AI Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/ai/cart` | Generate AI cart from prompt |
| POST | `/api/v1/ai/cart/save` | Save generated cart |
| POST | `/api/v1/ai/cart/regenerate` | Regenerate suggestions |
| GET | `/api/v1/ai/history` | Get AI cart history |
| GET | `/api/v1/ai/cart/:id` | Get single AI cart |
| DELETE | `/api/v1/ai/cart/:id` | Delete AI cart |
| GET | `/api/v1/ai/replenishment` | Get smart replenishment predictions |
| GET | `/api/v1/ai/personalized` | Get personalized recommendations |
| GET | `/api/v1/ai/smart-refill-products` | Get refill essentials (public) |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/admin/product/create` | Create product |
| PUT | `/api/v1/admin/product/:id` | Update product |
| DELETE | `/api/v1/admin/product/:id` | Delete product |
| GET | `/api/v1/admin/products` | Get all products |
| GET | `/api/v1/admin/orders` | Get all orders |
| PUT | `/api/v1/admin/order/:id` | Update order status |

---

## 🧠 How the AI Works

### Architecture

```
User Prompt → Backend Controller → AI Service Layer → Mistral API
                                         ↓
                                   Product Catalog
                                   (from MongoDB)
                                         ↓
                              Build Context Prompt
                              (products + user intent)
                                         ↓
                              Parse & Validate Response
                              (match to real products)
                                         ↓
                              Return validated cart
```

### AI Service Layer (`Backend/services/aiService.js`)

1. **getProductCatalog()** — Fetches all in-stock products from DB
2. **buildCartPrompt()** — Constructs prompt with product catalog + user intent
3. **callMistralAPI()** — Calls Mistral with retry logic & exponential backoff
4. **parseAIResponse()** — Cleans JSON, validates structure, maps to real products
5. **generateAICart()** — Orchestrates the full flow

### Key Design Decisions

- AI can ONLY recommend products that exist in the database
- Quantities are capped at available stock
- Response is validated and parsed server-side
- Failed matches are silently filtered out
- Total price is recalculated from actual DB prices (not AI estimates)

---

## 🌐 Deployment (AWS EC2)

```bash
# 1. Launch Ubuntu 22.04 t2.micro instance
# 2. SSH into instance
ssh -i key.pem ubuntu@<ip>

# 3. Setup
sudo apt update && sudo apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs nginx
sudo npm install -g pm2

# 4. Upload code, install deps, build frontend

# 5. Start with PM2
pm2 start Backend/server.js --name ecommerce
pm2 startup && pm2 save

# 6. Configure Nginx reverse proxy (port 80 → 8000)
# 7. Optional: Add domain + SSL with Certbot
```

---

## 📊 Database Models

### Product
`name, description, price, ratings, image[], category, stock, numOfReviews, reviews[], user(ref), createdAt`

### User
`name, email, password, avatar{public_id, url}, role, createdAt, resetPasswordToken, resetPasswordExpire`

### Order
`shippingInfo{}, orderItems[], user(ref), paymentInfo{}, paidAt, itemsPrice, taxPrice, shippingPrice, totalPrice, orderStatus, deliveredAt, createdAt`

### AICart
`user(ref), prompt, items[{product(ref), name, price, quantity, reason, category, image}], totalEstimatedPrice, reasoning, confidenceScore, tags[], status, createdAt`

### AIConversation
`user(ref), messages[{role, content, timestamp}], relatedCart(ref), intent, createdAt`

---

## 🖼️ Screenshots

| Page | Description |
|------|-------------|
| Homepage | Banner slider + Smart Refill section + Trending products |
| AI Assistant | Prompt input + suggestion cards + generated cart preview |
| AI Chatbot | Floating widget, type intent → cart auto-built |
| Smart Replenishment | Purchase frequency analysis + urgency indicators |
| Personalized AI | Explained recommendations + budget/premium alternatives |
| Products | Category filters + 20 per page + pagination |
| Admin Dashboard | Product/User/Order management |

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is for educational and portfolio purposes.

---

## 👨‍💻 Author

**Ankita Kumari**

---

## 🙏 Acknowledgments

- [Mistral AI](https://mistral.ai/) — LLM for intelligent cart generation
- [MongoDB Atlas](https://www.mongodb.com/atlas) — Cloud database
- [Cloudinary](https://cloudinary.com/) — Image management
- [Razorpay](https://razorpay.com/) — Payment gateway
- [MUI Icons](https://mui.com/material-ui/material-icons/) — UI icons
