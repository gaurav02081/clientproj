import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  IconButton,
  useColorModeValue,
  Alert,
  AlertIcon,
  Spinner,
  Flex,
  Select,
  Input,
  InputGroup,
  InputLeftElement,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  Divider,
  Avatar,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { 
  FiEye, 
  FiEdit, 
  FiTruck, 
  FiCheckCircle,
  FiXCircle,
  FiSearch,
  FiFilter,
  FiPackage,
  FiDollarSign,
  FiUser,
  FiCalendar
} from 'react-icons/fi';

import { fetchAllOrders } from '../../store/slices/orderSlice';

const MotionBox = motion(Box);

const AdminOrders = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const { orders, loading, error } = useSelector((state) => state.order);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Order status updated successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        dispatch(fetchAllOrders());
      } else {
        const data = await response.json();
        toast({
          title: 'Error',
          description: data.message || 'Failed to update order status',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update order status',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'yellow';
      case 'processing': return 'blue';
      case 'shipped': return 'purple';
      case 'delivered': return 'green';
      case 'cancelled': return 'red';
      default: return 'gray';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return FiPackage;
      case 'processing': return FiEdit;
      case 'shipped': return FiTruck;
      case 'delivered': return FiCheckCircle;
      case 'cancelled': return FiXCircle;
      default: return FiPackage;
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    onOpen();
  };

  // Filter orders based on search and filters
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.user?.email?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = !statusFilter || order.status === statusFilter;
    
    const matchesDate = !dateFilter || 
      formatDate(order.createdAt).includes(dateFilter);
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  // Calculate order statistics
  const orderStats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    totalRevenue: orders.reduce((sum, order) => sum + order.totalAmount, 0)
  };

  if (loading) {
    return (
      <Box minH="100vh" bg="gray.50" py={20}>
        <Container maxW="lg">
          <VStack spacing={8} textAlign="center">
            <Spinner size="xl" color="anime.primary" />
            <Text color="gray.600">Loading orders...</Text>
          </VStack>
        </Container>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg="gray.50" py={8}>
      <Container maxW="1400px">
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <VStack spacing={4} textAlign="center">
              <Heading size="xl" color="gray.800">
                Order Management
              </Heading>
              <Text color="gray.600">
                Manage and track all customer orders
              </Text>
            </VStack>
          </MotionBox>

          {/* Order Statistics */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <SimpleGrid columns={{ base: 1, md: 2, lg: 5 }} spacing={4}>
              <Box bg={cardBg} p={4} borderRadius="lg" border="1px" borderColor={borderColor}>
                <Stat>
                  <StatLabel color="gray.600">Total Orders</StatLabel>
                  <StatNumber color="gray.800">{orderStats.total}</StatNumber>
                </Stat>
              </Box>
              <Box bg={cardBg} p={4} borderRadius="lg" border="1px" borderColor={borderColor}>
                <Stat>
                  <StatLabel color="gray.600">Pending</StatLabel>
                  <StatNumber color="yellow.600">{orderStats.pending}</StatNumber>
                </Stat>
              </Box>
              <Box bg={cardBg} p={4} borderRadius="lg" border="1px" borderColor={borderColor}>
                <Stat>
                  <StatLabel color="gray.600">Processing</StatLabel>
                  <StatNumber color="blue.600">{orderStats.processing}</StatNumber>
                </Stat>
              </Box>
              <Box bg={cardBg} p={4} borderRadius="lg" border="1px" borderColor={borderColor}>
                <Stat>
                  <StatLabel color="gray.600">Shipped</StatLabel>
                  <StatNumber color="purple.600">{orderStats.shipped}</StatNumber>
                </Stat>
              </Box>
              <Box bg={cardBg} p={4} borderRadius="lg" border="1px" borderColor={borderColor}>
                <Stat>
                  <StatLabel color="gray.600">Total Revenue</StatLabel>
                  <StatNumber color="green.600">{formatPrice(orderStats.totalRevenue)}</StatNumber>
                </Stat>
              </Box>
            </SimpleGrid>
          </MotionBox>

          {/* Filters */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Box
              bg={cardBg}
              borderRadius="xl"
              p={6}
              boxShadow="sm"
              border="1px"
              borderColor={borderColor}
            >
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <FiSearch color="gray.400" />
                  </InputLeftElement>
                  <Input
                    placeholder="Search orders..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </InputGroup>
                
                <Select
                  placeholder="Filter by status"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </Select>
                
                <Input
                  type="date"
                  placeholder="Filter by date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                />
              </SimpleGrid>
            </Box>
          </MotionBox>

          {/* Orders Table */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Box
              bg={cardBg}
              borderRadius="xl"
              overflow="hidden"
              boxShadow="sm"
              border="1px"
              borderColor={borderColor}
            >
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Order ID</Th>
                    <Th>Customer</Th>
                    <Th>Items</Th>
                    <Th>Total</Th>
                    <Th>Status</Th>
                    <Th>Date</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredOrders.map((order) => (
                    <Tr key={order._id} _hover={{ bg: 'gray.50' }}>
                      <Td>
                        <Text fontWeight="medium" fontSize="sm">
                          #{order._id.slice(-8)}
                        </Text>
                      </Td>
                      <Td>
                        <VStack align="flex-start" spacing={1}>
                          <Text fontWeight="medium" fontSize="sm">
                            {order.user?.name || 'Guest'}
                          </Text>
                          <Text fontSize="xs" color="gray.600">
                            {order.user?.email || 'No email'}
                          </Text>
                        </VStack>
                      </Td>
                      <Td>
                        <Text fontSize="sm">
                          {order.items?.length || 0} items
                        </Text>
                      </Td>
                      <Td fontWeight="bold">
                        {formatPrice(order.totalAmount)}
                      </Td>
                      <Td>
                        <Badge
                          colorScheme={getStatusColor(order.status)}
                          variant="solid"
                          size="sm"
                        >
                          {order.status}
                        </Badge>
                      </Td>
                      <Td>
                        <Text fontSize="sm" color="gray.600">
                          {formatDate(order.createdAt)}
                        </Text>
                      </Td>
                      <Td>
                        <HStack spacing={2}>
                          <IconButton
                            icon={<FiEye />}
                            size="sm"
                            variant="ghost"
                            colorScheme="blue"
                            onClick={() => handleViewOrder(order)}
                            aria-label="View order"
                          />
                          <Select
                            size="sm"
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                            w="120px"
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </Select>
                        </HStack>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
              
              {filteredOrders.length === 0 && (
                <Box p={8} textAlign="center">
                  <Text color="gray.500">No orders found matching your criteria.</Text>
                </Box>
              )}
            </Box>
          </MotionBox>
        </VStack>
      </Container>

      {/* Order Details Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Order Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedOrder && (
              <VStack spacing={6} align="stretch">
                {/* Order Info */}
                <Box>
                  <Heading size="md" mb={4}>Order Information</Heading>
                  <SimpleGrid columns={2} spacing={4}>
                    <Box>
                      <Text fontWeight="medium" color="gray.600">Order ID</Text>
                      <Text>#{selectedOrder._id.slice(-8)}</Text>
                    </Box>
                    <Box>
                      <Text fontWeight="medium" color="gray.600">Date</Text>
                      <Text>{formatDate(selectedOrder.createdAt)}</Text>
                    </Box>
                    <Box>
                      <Text fontWeight="medium" color="gray.600">Status</Text>
                      <Badge colorScheme={getStatusColor(selectedOrder.status)}>
                        {selectedOrder.status}
                      </Badge>
                    </Box>
                    <Box>
                      <Text fontWeight="medium" color="gray.600">Total</Text>
                      <Text fontWeight="bold">{formatPrice(selectedOrder.totalAmount)}</Text>
                    </Box>
                  </SimpleGrid>
                </Box>

                <Divider />

                {/* Customer Info */}
                <Box>
                  <Heading size="md" mb={4}>Customer Information</Heading>
                  <SimpleGrid columns={2} spacing={4}>
                    <Box>
                      <Text fontWeight="medium" color="gray.600">Name</Text>
                      <Text>{selectedOrder.user?.name || 'Guest'}</Text>
                    </Box>
                    <Box>
                      <Text fontWeight="medium" color="gray.600">Email</Text>
                      <Text>{selectedOrder.user?.email || 'No email'}</Text>
                    </Box>
                  </SimpleGrid>
                </Box>

                <Divider />

                {/* Order Items */}
                <Box>
                  <Heading size="md" mb={4}>Order Items</Heading>
                  <VStack spacing={3} align="stretch">
                    {selectedOrder.items?.map((item, index) => (
                      <Box
                        key={index}
                        p={3}
                        bg="gray.50"
                        borderRadius="md"
                        border="1px"
                        borderColor="gray.200"
                      >
                        <HStack justify="space-between">
                          <VStack align="flex-start" spacing={1}>
                            <Text fontWeight="medium">{item.name}</Text>
                            <Text fontSize="sm" color="gray.600">
                              Qty: {item.quantity}
                            </Text>
                          </VStack>
                          <Text fontWeight="bold">
                            {formatPrice(item.price * item.quantity)}
                          </Text>
                        </HStack>
                      </Box>
                    ))}
                  </VStack>
                </Box>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default AdminOrders; 