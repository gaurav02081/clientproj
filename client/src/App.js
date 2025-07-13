import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box } from '@chakra-ui/react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toastConfig } from './utils/toastConfig';

// Redux actions
import { getProfile } from './store/slices/authSlice';
import { loadCartFromStorage } from './store/slices/cartSlice';

// Components
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
import AdminOrders from './pages/admin/Orders';
import AdminUsers from './pages/admin/Users';
import AdminProductForm from './pages/admin/ProductForm';
import AdminCategories from './pages/admin/Categories';

function App() {
  const dispatch = useDispatch();
  const { token, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const cartData = JSON.parse(savedCart);
        dispatch(loadCartFromStorage(cartData));
      } catch (error) {
        console.error('Error loading cart from storage:', error);
      }
    }

    // Get user profile if token exists
    if (token && !isAuthenticated) {
      dispatch(getProfile());
    }
  }, [dispatch, token, isAuthenticated]);

  return (
    <Box minH="100vh" bg="gray.50">
      <ToastContainer {...toastConfig} />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="products" element={<Products />} />
          <Route path="products/:id" element={<ProductDetail />} />
          <Route path="cart" element={<Cart />} />
          
          {/* Protected Routes */}
          <Route path="checkout" element={
            <PrivateRoute>
              <Checkout />
            </PrivateRoute>
          } />
          <Route path="profile" element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          } />
          <Route path="orders" element={
            <PrivateRoute>
              <Orders />
            </PrivateRoute>
          } />
          <Route path="orders/:id" element={
            <PrivateRoute>
              <OrderDetail />
            </PrivateRoute>
          } />
          
          {/* Admin Routes */}
          <Route path="admin" element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } />
          <Route path="admin/products" element={
            <AdminRoute>
              <AdminProducts />
            </AdminRoute>
          } />
          <Route path="admin/products/new" element={
            <AdminRoute>
              <AdminProductForm />
            </AdminRoute>
          } />
          <Route path="admin/products/edit/:id" element={
            <AdminRoute>
              <AdminProductForm />
            </AdminRoute>
          } />
          <Route path="admin/orders" element={
            <AdminRoute>
              <AdminOrders />
            </AdminRoute>
          } />
          <Route path="admin/users" element={
            <AdminRoute>
              <AdminUsers />
            </AdminRoute>
          } />
          <Route path="admin/categories" element={
            <AdminRoute>
              <AdminCategories />
            </AdminRoute>
          } />
        </Route>
      </Routes>
    </Box>
  );
}

export default App; 