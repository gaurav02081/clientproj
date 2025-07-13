import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  Badge,
  Image,
  Flex,
  Spacer,
  useColorModeValue,
  SimpleGrid,
  Alert,
  AlertIcon,
  Spinner,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FiPackage, FiCalendar, FiDollarSign } from 'react-icons/fi';

import { fetchUserOrders } from '../store/slices/orderSlice';

const MotionBox = motion(Box);

const Orders = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { orders, loading, error } = useSelector((state) => state.order);
  
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'yellow';
      case 'processing':
        return 'blue';
      case 'shipped':
        return 'purple';
      case 'delivered':
        return 'green';
      case 'cancelled':
        return 'red';
      default:
        return 'gray';
    }
  };

  const getStatusText = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  if (loading) {
    return (
      <Box minH="100vh" bg="gray.50" py={20}>
        <Container maxW="lg">
          <VStack spacing={8} textAlign="center">
            <Spinner size="xl" color="anime.primary" />
            <Text color="gray.600">Loading your orders...</Text>
          </VStack>
        </Container>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg="gray.50" py={8}>
      <Container maxW="1200px">
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <VStack spacing={4} textAlign="center">
              <Heading size="xl" color="gray.800">
                My Orders
              </Heading>
              <Text color="gray.600">
                Track your anime merchandise orders and their status
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

          {/* Orders List */}
          {orders.length === 0 ? (
            <Box
              bg={cardBg}
              borderRadius="xl"
              p={8}
              textAlign="center"
              boxShadow="sm"
              border="1px"
              borderColor={borderColor}
            >
              <VStack spacing={4}>
                <FiPackage size={48} color="gray.400" />
                <Heading size="md" color="gray.800">
                  No Orders Yet
                </Heading>
                <Text color="gray.600">
                  You haven't placed any orders yet. Start shopping to see your orders here!
                </Text>
                <Button colorScheme="brand" onClick={() => navigate('/products')}>
                  Browse Products
                </Button>
              </VStack>
            </Box>
          ) : (
            <VStack spacing={6} align="stretch">
              {orders.map((order) => (
                <MotionBox
                  key={order._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Box
                    bg={cardBg}
                    borderRadius="xl"
                    p={6}
                    boxShadow="sm"
                    border="1px"
                    borderColor={borderColor}
                  >
                    <VStack spacing={4} align="stretch">
                      {/* Order Header */}
                      <Flex justify="space-between" align="center">
                        <VStack align="flex-start" spacing={1}>
                          <Text fontWeight="bold" color="gray.800">
                            Order #{order._id.slice(-8).toUpperCase()}
                          </Text>
                          <HStack spacing={4} color="gray.600" fontSize="sm">
                            <HStack spacing={1}>
                              <FiCalendar />
                              <Text>{formatDate(order.createdAt)}</Text>
                            </HStack>
                            <HStack spacing={1}>
                              <FiDollarSign />
                              <Text>{formatPrice(order.total)}</Text>
                            </HStack>
                          </HStack>
                        </VStack>
                        <Badge
                          colorScheme={getStatusColor(order.status)}
                          variant="solid"
                          px={3}
                          py={1}
                          borderRadius="full"
                        >
                          {getStatusText(order.status)}
                        </Badge>
                      </Flex>

                      {/* Order Items */}
                      <VStack spacing={3} align="stretch">
                        {order.items.map((item, index) => (
                          <Flex key={index} align="center" gap={4}>
                            <Image
                              src={item.images[0]}
                              alt={item.name}
                              w="60px"
                              h="60px"
                              objectFit="cover"
                              borderRadius="md"
                            />
                            <Box flex="1">
                              <Text fontWeight="medium" color="gray.800">
                                {item.name}
                              </Text>
                              <Text color="gray.600" fontSize="sm">
                                Qty: {item.quantity}
                              </Text>
                              <Text color="gray.600" fontSize="sm">
                                {formatPrice(item.price)} each
                              </Text>
                            </Box>
                            <Text fontWeight="bold" color="gray.800">
                              {formatPrice(item.price * item.quantity)}
                            </Text>
                          </Flex>
                        ))}
                      </VStack>

                      {/* Order Actions */}
                      <Flex justify="space-between" align="center">
                        <VStack align="flex-start" spacing={1}>
                          <Text fontSize="sm" color="gray.600">
                            Shipping to: {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}
                          </Text>
                          <Text fontSize="sm" color="gray.600">
                            {order.shippingAddress?.city}, {order.shippingAddress?.state}
                          </Text>
                        </VStack>
                        <Button
                          size="sm"
                          variant="outline"
                          colorScheme="brand"
                          onClick={() => navigate(`/orders/${order._id}`)}
                        >
                          View Details
                        </Button>
                      </Flex>
                    </VStack>
                  </Box>
                </MotionBox>
              ))}
            </VStack>
          )}
        </VStack>
      </Container>
    </Box>
  );
};

export default Orders; 