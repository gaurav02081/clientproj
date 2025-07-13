import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  useColorModeValue,
  Spinner,
  Alert,
  AlertIcon,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Flex,
  Progress,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Avatar,
  Icon,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { 
  FiUsers, 
  FiPackage, 
  FiDollarSign, 
  FiShoppingCart,
  FiTrendingUp,
  FiTrendingDown,
  FiStar,
  FiEye
} from 'react-icons/fi';

import { fetchAdminStats } from '../../store/slices/orderSlice';

const MotionBox = motion(Box);

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [categoryStats, setCategoryStats] = useState([]);
  
  const { stats, loading, error } = useSelector((state) => state.order);
  
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  useEffect(() => {
    dispatch(fetchAdminStats());
    fetchDashboardData();
  }, [dispatch]);

  const fetchDashboardData = async () => {
    try {
      // Fetch recent orders
      const ordersResponse = await fetch('/api/orders?limit=5', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const ordersData = await ordersResponse.json();
      if (ordersResponse.ok) {
        setRecentOrders(ordersData.orders || []);
      }

      // Fetch top products
      const productsResponse = await fetch('/api/products?sort=-rating&limit=5', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const productsData = await productsResponse.json();
      if (productsResponse.ok) {
        setTopProducts(productsData.products || []);
      }

      // Fetch category statistics
      const categoriesResponse = await fetch('/api/categories', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const categoriesData = await categoriesResponse.json();
      if (categoriesResponse.ok) {
        // For now, we'll create mock category stats
        setCategoryStats([
          { name: 'Figures', count: 25, percentage: 30 },
          { name: 'Posters', count: 20, percentage: 25 },
          { name: 'Clothing', count: 15, percentage: 18 },
          { name: 'Accessories', count: 12, percentage: 15 },
          { name: 'Collectibles', count: 8, percentage: 12 }
        ]);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
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
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <Box minH="100vh" bg="gray.50" py={20}>
        <Container maxW="lg">
          <VStack spacing={8} textAlign="center">
            <Spinner size="xl" color="anime.primary" />
            <Text color="gray.600">Loading dashboard...</Text>
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
                Admin Dashboard
              </Heading>
              <Text color="gray.600">
                Overview of your anime merchandise store performance
              </Text>
            </VStack>
          </MotionBox>

          {/* Error Alert */}
          {error && (
            <Alert status="error" borderRadius="md">
              <AlertIcon />
              {error}
            </Alert>
          )}

          {/* Main Stats Grid */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Box
                bg={cardBg}
                borderRadius="xl"
                p={6}
                boxShadow="sm"
                border="1px"
                borderColor={borderColor}
              >
                <Stat>
                  <HStack spacing={3} mb={2}>
                    <Box
                      p={2}
                      bg="blue.100"
                      color="blue.600"
                      borderRadius="md"
                    >
                      <FiDollarSign size={24} />
                    </Box>
                    <StatLabel color="gray.600">Total Revenue</StatLabel>
                  </HStack>
                  <StatNumber color="gray.800" fontSize="2xl">
                    {formatPrice(stats?.totalRevenue || 0)}
                  </StatNumber>
                  <StatHelpText>
                    <StatArrow type="increase" />
                    23.36%
                  </StatHelpText>
                </Stat>
              </Box>
            </MotionBox>

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
                <Stat>
                  <HStack spacing={3} mb={2}>
                    <Box
                      p={2}
                      bg="green.100"
                      color="green.600"
                      borderRadius="md"
                    >
                      <FiShoppingCart size={24} />
                    </Box>
                    <StatLabel color="gray.600">Total Orders</StatLabel>
                  </HStack>
                  <StatNumber color="gray.800" fontSize="2xl">
                    {stats?.totalOrders || 0}
                  </StatNumber>
                  <StatHelpText>
                    <StatArrow type="increase" />
                    12.5%
                  </StatHelpText>
                </Stat>
              </Box>
            </MotionBox>

            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Box
                bg={cardBg}
                borderRadius="xl"
                p={6}
                boxShadow="sm"
                border="1px"
                borderColor={borderColor}
              >
                <Stat>
                  <HStack spacing={3} mb={2}>
                    <Box
                      p={2}
                      bg="purple.100"
                      color="purple.600"
                      borderRadius="md"
                    >
                      <FiPackage size={24} />
                    </Box>
                    <StatLabel color="gray.600">Total Products</StatLabel>
                  </HStack>
                  <StatNumber color="gray.800" fontSize="2xl">
                    {stats?.totalProducts || 0}
                  </StatNumber>
                  <StatHelpText>
                    <StatArrow type="increase" />
                    8.2%
                  </StatHelpText>
                </Stat>
              </Box>
            </MotionBox>

            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Box
                bg={cardBg}
                borderRadius="xl"
                p={6}
                boxShadow="sm"
                border="1px"
                borderColor={borderColor}
              >
                <Stat>
                  <HStack spacing={3} mb={2}>
                    <Box
                      p={2}
                      bg="orange.100"
                      color="orange.600"
                      borderRadius="md"
                    >
                      <FiUsers size={24} />
                    </Box>
                    <StatLabel color="gray.600">Total Customers</StatLabel>
                  </HStack>
                  <StatNumber color="gray.800" fontSize="2xl">
                    {stats?.totalCustomers || 0}
                  </StatNumber>
                  <StatHelpText>
                    <StatArrow type="increase" />
                    15.7%
                  </StatHelpText>
                </Stat>
              </Box>
            </MotionBox>
          </SimpleGrid>

          {/* Detailed Analytics */}
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
            {/* Recent Orders */}
            <MotionBox
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Box
                bg={cardBg}
                borderRadius="xl"
                p={6}
                boxShadow="sm"
                border="1px"
                borderColor={borderColor}
              >
                <HStack justify="space-between" mb={4}>
                  <Heading size="md" color="gray.800">
                    Recent Orders
                  </Heading>
                  <Badge colorScheme="blue" variant="subtle">
                    Latest 5
                  </Badge>
                </HStack>
                
                {recentOrders.length > 0 ? (
                  <VStack spacing={3} align="stretch">
                    {recentOrders.map((order) => (
                      <Box
                        key={order._id}
                        p={3}
                        bg="gray.50"
                        borderRadius="md"
                        border="1px"
                        borderColor="gray.200"
                      >
                        <HStack justify="space-between">
                          <VStack align="flex-start" spacing={1}>
                            <Text fontWeight="medium" fontSize="sm">
                              Order #{order._id.slice(-6)}
                            </Text>
                            <Text fontSize="xs" color="gray.600">
                              {formatDate(order.createdAt)}
                            </Text>
                          </VStack>
                          <VStack align="flex-end" spacing={1}>
                            <Text fontWeight="bold" fontSize="sm">
                              {formatPrice(order.totalAmount)}
                            </Text>
                            <Badge
                              size="sm"
                              colorScheme={
                                order.status === 'delivered' ? 'green' :
                                order.status === 'shipped' ? 'blue' :
                                order.status === 'processing' ? 'yellow' : 'red'
                              }
                            >
                              {order.status}
                            </Badge>
                          </VStack>
                        </HStack>
                      </Box>
                    ))}
                  </VStack>
                ) : (
                  <Text color="gray.500" textAlign="center" py={4}>
                    No recent orders
                  </Text>
                )}
              </Box>
            </MotionBox>

            {/* Top Products */}
            <MotionBox
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Box
                bg={cardBg}
                borderRadius="xl"
                p={6}
                boxShadow="sm"
                border="1px"
                borderColor={borderColor}
              >
                <HStack justify="space-between" mb={4}>
                  <Heading size="md" color="gray.800">
                    Top Products
                  </Heading>
                  <Badge colorScheme="green" variant="subtle">
                    By Rating
                  </Badge>
                </HStack>
                
                {topProducts.length > 0 ? (
                  <VStack spacing={3} align="stretch">
                    {topProducts.map((product, index) => (
                      <Box
                        key={product._id}
                        p={3}
                        bg="gray.50"
                        borderRadius="md"
                        border="1px"
                        borderColor="gray.200"
                      >
                        <HStack spacing={3}>
                          <Avatar
                            size="sm"
                            src={product.images?.[0]}
                            name={product.name}
                          />
                          <VStack align="flex-start" flex="1" spacing={1}>
                            <Text fontWeight="medium" fontSize="sm" noOfLines={1}>
                              {product.name}
                            </Text>
                            <HStack spacing={2}>
                              <Icon as={FiStar} color="yellow.500" size="xs" />
                              <Text fontSize="xs" color="gray.600">
                                {product.rating || 0} rating
                              </Text>
                            </HStack>
                          </VStack>
                          <Text fontWeight="bold" fontSize="sm">
                            {formatPrice(product.price)}
                          </Text>
                        </HStack>
                      </Box>
                    ))}
                  </VStack>
                ) : (
                  <Text color="gray.500" textAlign="center" py={4}>
                    No products available
                  </Text>
                )}
              </Box>
            </MotionBox>
          </SimpleGrid>

          {/* Category Distribution */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <Box
              bg={cardBg}
              borderRadius="xl"
              p={6}
              boxShadow="sm"
              border="1px"
              borderColor={borderColor}
            >
              <Heading size="md" color="gray.800" mb={4}>
                Category Distribution
              </Heading>
              
              <VStack spacing={4} align="stretch">
                {categoryStats.map((category, index) => (
                  <Box key={index}>
                    <HStack justify="space-between" mb={2}>
                      <Text fontWeight="medium" fontSize="sm">
                        {category.name}
                      </Text>
                      <Text fontSize="sm" color="gray.600">
                        {category.count} products
                      </Text>
                    </HStack>
                    <Progress
                      value={category.percentage}
                      colorScheme="anime"
                      borderRadius="full"
                      size="sm"
                    />
                  </Box>
                ))}
              </VStack>
            </Box>
          </MotionBox>
        </VStack>
      </Container>
    </Box>
  );
};

export default AdminDashboard; 