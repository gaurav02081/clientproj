import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

const initialState = {
  items: [],
  total: 0,
  itemCount: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { product, quantity = 1 } = action.payload;
      const existingItem = state.items.find(item => item._id === product._id);

      if (existingItem) {
        existingItem.quantity += quantity;
        toast.success(`Updated ${product.name} quantity`);
      } else {
        state.items.push({
          ...product,
          quantity,
        });
        toast.success(`${product.name} added to cart`);
      }

      // Update totals
      state.itemCount = state.items.reduce((total, item) => total + item.quantity, 0);
      state.total = state.items.reduce((total, item) => {
        const price = item.discount > 0 
          ? item.price - (item.price * item.discount / 100)
          : item.price;
        return total + (price * item.quantity);
      }, 0);
    },

    removeFromCart: (state, action) => {
      const productId = action.payload;
      const item = state.items.find(item => item._id === productId);
      
      if (item) {
        toast.success(`${item.name} removed from cart`);
      }
      
      state.items = state.items.filter(item => item._id !== productId);
      
      // Update totals
      state.itemCount = state.items.reduce((total, item) => total + item.quantity, 0);
      state.total = state.items.reduce((total, item) => {
        const price = item.discount > 0 
          ? item.price - (item.price * item.discount / 100)
          : item.price;
        return total + (price * item.quantity);
      }, 0);
    },

    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find(item => item._id === productId);

      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter(item => item._id !== productId);
          toast.success(`${item.name} removed from cart`);
        } else if (quantity > item.stock) {
          toast.error(`Only ${item.stock} items available in stock`);
          return;
        } else {
          item.quantity = quantity;
        }

        // Update totals
        state.itemCount = state.items.reduce((total, item) => total + item.quantity, 0);
        state.total = state.items.reduce((total, item) => {
          const price = item.discount > 0 
            ? item.price - (item.price * item.discount / 100)
            : item.price;
          return total + (price * item.quantity);
        }, 0);
      }
    },

    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      state.itemCount = 0;
      toast.success('Cart cleared');
    },

    loadCartFromStorage: (state, action) => {
      const savedCart = action.payload;
      if (savedCart) {
        state.items = savedCart.items || [];
        state.total = savedCart.total || 0;
        state.itemCount = savedCart.itemCount || 0;
      }
    },
  },
});

export const { 
  addToCart, 
  removeFromCart, 
  updateQuantity, 
  clearCart, 
  loadCartFromStorage 
} = cartSlice.actions;

export default cartSlice.reducer; 