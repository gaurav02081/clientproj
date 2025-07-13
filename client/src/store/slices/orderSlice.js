import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import api from '../../utils/api';

// Async thunks
export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await api.post('/orders', orderData);
      toast.success('Order placed successfully!');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create order';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const fetchUserOrders = createAsyncThunk(
  'order/fetchUserOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/orders/myorders');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch orders';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const fetchOrderById = createAsyncThunk(
  'order/fetchOrderById',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/orders/${orderId}`);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch order';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const updateOrderPayment = createAsyncThunk(
  'order/updateOrderPayment',
  async ({ orderId, paymentData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/orders/${orderId}/pay`, paymentData);
      toast.success('Payment updated successfully');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update payment';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// Admin actions
export const fetchAllOrders = createAsyncThunk(
  'order/fetchAllOrders',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get('/orders', { params });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch orders';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  'order/updateOrderStatus',
  async ({ orderId, statusData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/orders/${orderId}/status`, statusData);
      toast.success('Order status updated successfully');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update order status';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const markOrderAsDelivered = createAsyncThunk(
  'order/markOrderAsDelivered',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await api.put(`/orders/${orderId}/deliver`);
      toast.success('Order marked as delivered');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to mark order as delivered';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const fetchAdminStats = createAsyncThunk(
  'order/fetchAdminStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/orders/stats');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch admin stats';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  orders: [],
  currentOrder: null,
  userOrders: [],
  stats: {
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalOrders: 0,
    hasNext: false,
    hasPrev: false,
  },
  loading: false,
  error: null,
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Order
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
        state.userOrders.unshift(action.payload);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch User Orders
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.userOrders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Order by ID
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Order Payment
      .addCase(updateOrderPayment.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateOrderPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
        // Update in user orders list
        const index = state.userOrders.findIndex(o => o._id === action.payload._id);
        if (index !== -1) {
          state.userOrders[index] = action.payload;
        }
      })
      .addCase(updateOrderPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch All Orders (Admin)
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Order Status (Admin)
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        // Update in orders list
        const index = state.orders.findIndex(o => o._id === action.payload._id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
        // Update current order if it's the same
        if (state.currentOrder?._id === action.payload._id) {
          state.currentOrder = action.payload;
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Mark Order as Delivered (Admin)
      .addCase(markOrderAsDelivered.pending, (state) => {
        state.loading = true;
      })
      .addCase(markOrderAsDelivered.fulfilled, (state, action) => {
        state.loading = false;
        // Update in orders list
        const index = state.orders.findIndex(o => o._id === action.payload._id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
        // Update current order if it's the same
        if (state.currentOrder?._id === action.payload._id) {
          state.currentOrder = action.payload;
        }
      })
      .addCase(markOrderAsDelivered.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Admin Stats
      .addCase(fetchAdminStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchAdminStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentOrder, clearError } = orderSlice.actions;
export default orderSlice.reducer; 