# 🐉 Saiyankraft - Anime Merchandise Store

A full-stack MERN (MongoDB, Express.js, React.js, Node.js) e-commerce platform for anime merchandise with modern UI/UX, admin panel, and comprehensive features.

## ✨ Features

### 🛍️ Customer Features
- **Modern Anime-Inspired UI**: Glassmorphism design with gradient backgrounds
- **Product Browsing**: Browse products by categories with advanced filtering
- **Shopping Cart**: Add/remove items with quantity management
- **User Authentication**: Secure login/register with JWT
- **Order Management**: Track orders and view order history
- **Responsive Design**: Works perfectly on all devices
- **Dark Mode**: Toggle between light and dark themes

### 🔧 Admin Features
- **Dashboard**: Analytics and overview of store performance
- **Product Management**: CRUD operations for products with image uploads
- **Category Management**: Create and manage product categories
- **Order Management**: Update order status and track shipments
- **User Management**: View and manage customer accounts
- **Inventory Control**: Stock management and SKU tracking

## 🚀 Tech Stack

### Frontend
- **React.js** - UI framework
- **Chakra UI** - Component library with custom theme
- **Redux Toolkit** - State management
- **React Router** - Navigation
- **Framer Motion** - Animations
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **multer** - File uploads

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Git

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/clientproj.git
   cd clientproj
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install client dependencies
   cd client
   npm install
   
   # Install server dependencies
   cd ../server
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Create .env file in server directory
   cd server
   cp .env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/saiyankraft
   JWT_SECRET=your_jwt_secret_here
   ```

4. **Start the development servers**
   ```bash
   # Start backend server (from root directory)
   cd server
   npm run dev
   
   # Start frontend (in new terminal, from root directory)
   cd client
   npm start
   ```

## 🎯 Usage

### Customer Access
- Visit `http://localhost:3000`
- Browse products and add to cart
- Register/login to complete purchases
- Track orders in your profile

### Admin Access
- Login with admin credentials
- Access admin panel at `/admin`
- Manage products, categories, orders, and users

## 📁 Project Structure

```
clientproj/
├── client/                 # React frontend
│   ├── public/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── store/         # Redux store
│   │   ├── utils/         # Utility functions
│   │   └── App.js         # Main app component
│   └── package.json
├── server/                 # Node.js backend
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   └── index.js           # Server entry point
├── admin.txt              # Admin documentation
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (admin)
- `PUT /api/categories/:id` - Update category (admin)
- `DELETE /api/categories/:id` - Delete category (admin)

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create order
- `PUT /api/orders/:id/status` - Update order status (admin)

## 🎨 Customization

### Theme Colors
The project uses a custom Chakra UI theme with anime-inspired colors:
- Primary: Orange gradient
- Secondary: Pink-purple gradient
- Accent: Blue-indigo gradient

### Adding New Features
1. Create new components in `client/src/components/`
2. Add new pages in `client/src/pages/`
3. Create API routes in `server/routes/`
4. Add models in `server/models/`

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
cd client
npm run build
```

### Backend (Heroku/Railway)
```bash
cd server
npm start
```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🤝 Support

For support and questions:
- Create an issue on GitHub
- Check the admin documentation in `admin.txt`

---

**Built with ❤️ for anime fans everywhere!** 