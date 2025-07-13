import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
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
  Divider,
  useColorModeValue,
  Alert,
  AlertIcon,
  Spinner,
  SimpleGrid,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FiPackage, FiCalendar, FiDollarSign, FiMapPin, FiTruck } from 'react-icons/fi';

import { fetchOrderById } from '../store/slices/orderSlice';

const MotionBox = motion(Box);

const OrderDetail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  
  const { currentOrder, loading, error } = useSelector((state) => state.order);
  
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  useEffect(() => {
    if (id) {
      dispatch(fetchOrderById(id));
    }
  }, [dispatch, id]);

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
      hour: '2-digit',
      minute: '2-digit',
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

  const getStatusDescription = (status) => {
    switch (status) {
      case 'pending':
        return 'Your order has been placed and is awaiting confirmation.';
      case 'processing':
        return 'Your order is being prepared for shipment.';
      case 'shipped':
        return 'Your order has been shipped and is on its way to you.';
      case 'delivered':
        return 'Your order has been successfully delivered.';
      case 'cancelled':
        return 'Your order has been cancelled.';
      default:
        return 'Order status is being updated.';
    }
  };

  if (loading) {
    return (
      <Box minH="100vh" bg="gray.50" py={20}>
        <Container maxW="lg">
          <VStack spacing={8} textAlign="center">
            <Spinner size="xl" color="anime.primary" />
            <Text color="gray.600">Loading order details...</Text>
          </VStack>
        </Container>
      </Box>
    );
  }

  if (error || !currentOrder) {
    return (
      <Box minH="100vh" bg="gray.50" py={20}>
        <Container maxW="lg">
          <VStack spacing={8} textAlign="center">
            <Heading size="lg" color="gray.800">
              Order Not Found
            </Heading>
            <Text color="gray.600">
              The order you're looking for doesn't exist or you don't have permission to view it.
            </Text>
            <Button colorScheme="brand" onClick={() => navigate('/orders')}>
              Back to Orders
            </Button>
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
                Order Details
              </Heading>
              <Text color="gray.600">
                Order #{currentOrder._id.slice(-8).toUpperCase()}
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

          <Flex direction={{ base: 'column', lg: 'row' }} gap={8}>
            {/* Order Information */}
            <Box flex="2">
              <VStack spacing={6} align="stretch">
                {/* Order Status */}
                <Box
                  bg={cardBg}
                  borderRadius="xl"
                  p={6}
                  boxShadow="sm"
                  border="1px"
                  borderColor={borderColor}
                >
                  <VStack spacing={4} align="stretch">
                    <Flex justify="space-between" align="center">
                      <Heading size="md" color="gray.800">
                        Order Status
                      </Heading>
                      <Badge
                        colorScheme={getStatusColor(currentOrder.status)}
                        variant="solid"
                        px={4}
                        py={2}
                        borderRadius="full"
                        fontSize="md"
                      >
                        {getStatusText(currentOrder.status)}
                      </Badge>
                    </Flex>
                    <Text color="gray.600">
                      {getStatusDescription(currentOrder.status)}
                    </Text>
                    <HStack spacing={4} color="gray.600" fontSize="sm">
                      <HStack spacing={1}>
                        <FiCalendar />
                        <Text>Ordered: {formatDate(currentOrder.createdAt)}</Text>
                      </HStack>
                      {currentOrder.updatedAt !== currentOrder.createdAt && (
                        <HStack spacing={1}>
                          <FiCalendar />
                          <Text>Updated: {formatDate(currentOrder.updatedAt)}</Text>
                        </HStack>
                      )}
                    </HStack>
                  </VStack>
                </Box>

                {/* Order Items */}
                <Box
                  bg={cardBg}
                  borderRadius="xl"
                  p={6}
                  boxShadow="sm"
                  border="1px"
                  borderColor={borderColor}
                >
                  <VStack spacing={4} align="stretch">
                    <Heading size="md" color="gray.800">
                      Order Items
                    </Heading>
                    <VStack spacing={4} align="stretch">
                      {currentOrder.items.map((item, index) => (
                        <Flex key={index} align="center" gap={4}>
                          <Image
                            src={item.images[0]}
                            alt={item.name}
                            w="80px"
                            h="80px"
                            objectFit="cover"
                            borderRadius="md"
                          />
                          <Box flex="1">
                            <Text fontWeight="bold" color="gray.800" fontSize="lg">
                              {item.name}
                            </Text>
                            <Text color="gray.600" fontSize="sm">
                              Category: {item.category}
                            </Text>
                            <Text color="gray.600" fontSize="sm">
                              Anime: {item.anime}
                            </Text>
                            <Text color="gray.600" fontSize="sm">
                              Quantity: {item.quantity}
                            </Text>
                          </Box>
                          <VStack align="flex-end" spacing={1}>
                            <Text fontWeight="bold" color="gray.800">
                              {formatPrice(item.price)} each
                            </Text>
                            <Text fontWeight="bold" color="anime.primary" fontSize="lg">
                              {formatPrice(item.price * item.quantity)}
                            </Text>
                          </VStack>
                        </Flex>
                      ))}
                    </VStack>
                  </VStack>
                </Box>

                {/* Shipping Information */}
                <Box
                  bg={cardBg}
                  borderRadius="xl"
                  p={6}
                  boxShadow="sm"
                  border="1px"
                  borderColor={borderColor}
                >
                  <VStack spacing={4} align="stretch">
                    <Heading size="md" color="gray.800">
                      Shipping Information
                    </Heading>
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                      <VStack align="flex-start" spacing={2}>
                        <HStack spacing={2}>
                          <FiMapPin />
                          <Text fontWeight="medium">Shipping Address</Text>
                        </HStack>
                        <Box pl={6}>
                          <Text color="gray.800">
                            {currentOrder.shippingAddress?.firstName} {currentOrder.shippingAddress?.lastName}
                          </Text>
                          <Text color="gray.600">
                            {currentOrder.shippingAddress?.address}
                          </Text>
                          <Text color="gray.600">
                            {currentOrder.shippingAddress?.city}, {currentOrder.shippingAddress?.state} {currentOrder.shippingAddress?.zipCode}
                          </Text>
                          <Text color="gray.600">
                            {currentOrder.shippingAddress?.country}
                          </Text>
                        </Box>
                      </VStack>
                      
                      <VStack align="flex-start" spacing={2}>
                        <HStack spacing={2}>
                          <FiTruck />
                          <Text fontWeight="medium">Shipping Method</Text>
                        </HStack>
                        <Box pl={6}>
                          <Text color="gray.800">Standard Shipping</Text>
                          <Text color="gray.600">Free shipping on orders over $50</Text>
                          <Text color="gray.600">Estimated delivery: 3-5 business days</Text>
                        </Box>
                      </VStack>
                    </SimpleGrid>
                  </VStack>
                </Box>
              </VStack>
            </Box>

            {/* Order Summary */}
            <Box flex="1">
              <Box
                bg={cardBg}
                borderRadius="xl"
                p={6}
                boxShadow="sm"
                border="1px"
                borderColor={borderColor}
                position="sticky"
                top={4}
              >
                <VStack spacing={4} align="stretch">
                  <Heading size="md" color="gray.800">
                    Order Summary
                  </Heading>
                  
                  <VStack spacing={3} align="stretch">
                    <Flex justify="space-between">
                      <Text color="gray.600">Subtotal:</Text>
                      <Text fontWeight="bold">{formatPrice(currentOrder.total)}</Text>
                    </Flex>
                    <Flex justify="space-between">
                      <Text color="gray.600">Shipping:</Text>
                      <Text fontWeight="bold">Free</Text>
                    </Flex>
                    <Flex justify="space-between">
                      <Text color="gray.600">Tax:</Text>
                      <Text fontWeight="bold">{formatPrice(currentOrder.total * 0.08)}</Text>
                    </Flex>
                    <Divider />
                    <Flex justify="space-between">
                      <Text fontWeight="bold" fontSize="lg">Total:</Text>
                      <Text fontWeight="bold" fontSize="lg" color="anime.primary">
                        {formatPrice(currentOrder.total * 1.08)}
                      </Text>
                    </Flex>
                  </VStack>

                  <Divider />

                  <VStack spacing={3} align="stretch">
                    <Text fontWeight="medium" color="gray.800">
                      Payment Method
                    </Text>
                    <Text color="gray.600">
                      {currentOrder.paymentMethod === 'credit_card' && 'Credit Card'}
                      {currentOrder.paymentMethod === 'paypal' && 'PayPal'}
                      {currentOrder.paymentMethod === 'stripe' && 'Stripe'}
                    </Text>
                  </VStack>

                  <Button
                    colorScheme="brand"
                    onClick={() => navigate('/orders')}
                    w="full"
                  >
                    Back to Orders
                  </Button>
                </VStack>
              </Box>
            </Box>
          </Flex>
        </VStack>
      </Container>
    </Box>
  );
};

export default OrderDetail; 