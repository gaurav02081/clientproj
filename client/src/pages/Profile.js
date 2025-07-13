import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  Avatar,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Divider,
  Badge,
  Alert,
  AlertIcon,
  useColorModeValue,
  SimpleGrid,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  IconButton,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FiEdit, FiUser, FiShoppingBag, FiSettings, FiLogOut } from 'react-icons/fi';

import { updateProfile, logout } from '../store/slices/authSlice';
import { fetchUserOrders } from '../store/slices/orderSlice';

const MotionBox = motion(Box);

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const { user, loading, error } = useSelector((state) => state.auth);
  const { orders, loading: ordersLoading } = useSelector((state) => state.order);
  
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
  });

  const [isEditing, setIsEditing] = useState(false);

  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  useEffect(() => {
    if (user) {
      dispatch(fetchUserOrders());
    }
  }, [dispatch, user]);

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveProfile = async () => {
    try {
      await dispatch(updateProfile(profileData)).unwrap();
      setIsEditing(false);
      toast({
        title: 'Profile Updated',
        description: 'Your profile has been updated successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Update Failed',
        description: error.message || 'Failed to update profile.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getOrderStatusColor = (status) => {
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

  if (!user) {
    return (
      <Box minH="100vh" bg="gray.50" py={20}>
        <Container maxW="lg">
          <VStack spacing={8} textAlign="center">
            <Heading size="lg" color="gray.800">
              Please log in to view your profile
            </Heading>
            <Button colorScheme="brand" onClick={() => navigate('/login')}>
              Sign In
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
            <VStack spacing={6} textAlign="center">
              <Avatar
                size="2xl"
                name={`${user.firstName} ${user.lastName}`}
                src={user.avatar}
                bg="anime.primary"
              />
              <VStack spacing={2}>
                <Heading size="xl" color="gray.800">
                  Welcome back, {user.firstName}!
                </Heading>
                <Text color="gray.600">
                  Manage your account, view orders, and update your information
                </Text>
              </VStack>
            </VStack>
          </MotionBox>

          {/* Profile Content */}
          <Tabs variant="enclosed" colorScheme="brand">
            <TabList>
              <Tab>
                <HStack spacing={2}>
                  <FiUser />
                  <Text>Profile</Text>
                </HStack>
              </Tab>
              <Tab>
                <HStack spacing={2}>
                  <FiShoppingBag />
                  <Text>Orders</Text>
                </HStack>
              </Tab>
              <Tab>
                <HStack spacing={2}>
                  <FiSettings />
                  <Text>Settings</Text>
                </HStack>
              </Tab>
            </TabList>

            <TabPanels>
              {/* Profile Tab */}
              <TabPanel>
                <Box
                  bg={cardBg}
                  borderRadius="xl"
                  p={8}
                  border="1px"
                  borderColor={borderColor}
                  boxShadow="sm"
                >
                  <VStack spacing={6} align="stretch">
                    <HStack justify="space-between">
                      <Heading size="lg" color="gray.800">
                        Personal Information
                      </Heading>
                      <Button
                        variant="outline"
                        size="sm"
                        leftIcon={<FiEdit />}
                        onClick={() => setIsEditing(!isEditing)}
                      >
                        {isEditing ? 'Cancel' : 'Edit'}
                      </Button>
                    </HStack>

                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                      <FormControl>
                        <FormLabel color="gray.700">First Name</FormLabel>
                        <Input
                          name="firstName"
                          value={profileData.firstName}
                          onChange={handleProfileChange}
                          isReadOnly={!isEditing}
                          size="lg"
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel color="gray.700">Last Name</FormLabel>
                        <Input
                          name="lastName"
                          value={profileData.lastName}
                          onChange={handleProfileChange}
                          isReadOnly={!isEditing}
                          size="lg"
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel color="gray.700">Email</FormLabel>
                        <Input
                          name="email"
                          value={profileData.email}
                          onChange={handleProfileChange}
                          isReadOnly={!isEditing}
                          size="lg"
                          type="email"
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel color="gray.700">Phone</FormLabel>
                        <Input
                          name="phone"
                          value={profileData.phone}
                          onChange={handleProfileChange}
                          isReadOnly={!isEditing}
                          size="lg"
                        />
                      </FormControl>
                    </SimpleGrid>

                    <FormControl>
                      <FormLabel color="gray.700">Address</FormLabel>
                      <Textarea
                        name="address"
                        value={profileData.address}
                        onChange={handleProfileChange}
                        isReadOnly={!isEditing}
                        size="lg"
                        rows={3}
                      />
                    </FormControl>

                    {isEditing && (
                      <HStack justify="flex-end" spacing={4}>
                        <Button
                          variant="outline"
                          onClick={() => setIsEditing(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          colorScheme="brand"
                          onClick={handleSaveProfile}
                          isLoading={loading}
                        >
                          Save Changes
                        </Button>
                      </HStack>
                    )}
                  </VStack>
                </Box>
              </TabPanel>

              {/* Orders Tab */}
              <TabPanel>
                <VStack spacing={6} align="stretch">
                  <Heading size="lg" color="gray.800">
                    Order History
                  </Heading>

                  {ordersLoading ? (
                    <Box textAlign="center" py={20}>
                      <Text color="gray.600">Loading orders...</Text>
                    </Box>
                  ) : orders.length === 0 ? (
                    <Box
                      bg={cardBg}
                      borderRadius="xl"
                      p={8}
                      border="1px"
                      borderColor={borderColor}
                      textAlign="center"
                    >
                      <VStack spacing={4}>
                        <Text fontSize="lg" color="gray.600">
                          No orders yet
                        </Text>
                        <Text color="gray.500">
                          Start shopping to see your order history here
                        </Text>
                        <Button colorScheme="brand" onClick={() => navigate('/products')}>
                          Browse Products
                        </Button>
                      </VStack>
                    </Box>
                  ) : (
                    <VStack spacing={4} align="stretch">
                      {orders.map((order) => (
                        <Box
                          key={order._id}
                          bg={cardBg}
                          borderRadius="xl"
                          border="1px"
                          borderColor={borderColor}
                          boxShadow="sm"
                        >
                          <CardHeader>
                            <HStack justify="space-between">
                              <VStack align="flex-start" spacing={1}>
                                <Text fontWeight="bold" fontSize="lg">
                                  Order #{order._id.slice(-8)}
                                </Text>
                                <Text fontSize="sm" color="gray.500">
                                  {formatDate(order.createdAt)}
                                </Text>
                              </VStack>
                              <Badge
                                colorScheme={getOrderStatusColor(order.status)}
                                variant="subtle"
                                fontSize="sm"
                              >
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </Badge>
                            </HStack>
                          </CardHeader>

                          <CardBody>
                            <VStack spacing={4} align="stretch">
                              {order.items.map((item) => (
                                <HStack key={item._id} justify="space-between">
                                  <HStack spacing={3}>
                                    <Box w="50px" h="50px">
                                      <img
                                        src={item.product.images[0]}
                                        alt={item.product.name}
                                        style={{
                                          width: '100%',
                                          height: '100%',
                                          objectFit: 'cover',
                                          borderRadius: '8px',
                                        }}
                                      />
                                    </Box>
                                    <VStack align="flex-start" spacing={0}>
                                      <Text fontWeight="medium">
                                        {item.product.name}
                                      </Text>
                                      <Text fontSize="sm" color="gray.500">
                                        Qty: {item.quantity}
                                      </Text>
                                    </VStack>
                                  </HStack>
                                  <Text fontWeight="bold">
                                    {formatPrice(item.price * item.quantity)}
                                  </Text>
                                </HStack>
                              ))}
                            </VStack>
                          </CardBody>

                          <CardFooter>
                            <HStack justify="space-between" w="full">
                              <Text fontSize="sm" color="gray.500">
                                Total: {formatPrice(order.total)}
                              </Text>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => navigate(`/orders/${order._id}`)}
                              >
                                View Details
                              </Button>
                            </HStack>
                          </CardFooter>
                        </Box>
                      ))}
                    </VStack>
                  )}
                </VStack>
              </TabPanel>

              {/* Settings Tab */}
              <TabPanel>
                <Box
                  bg={cardBg}
                  borderRadius="xl"
                  p={8}
                  border="1px"
                  borderColor={borderColor}
                  boxShadow="sm"
                >
                  <VStack spacing={6} align="stretch">
                    <Heading size="lg" color="gray.800">
                      Account Settings
                    </Heading>

                    <VStack spacing={4} align="stretch">
                      <Button
                        variant="outline"
                        colorScheme="red"
                        leftIcon={<FiLogOut />}
                        onClick={onOpen}
                      >
                        Sign Out
                      </Button>
                    </VStack>
                  </VStack>
                </Box>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </VStack>
      </Container>

      {/* Logout Confirmation Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Sign Out</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Are you sure you want to sign out?</Text>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={handleLogout}>
              Sign Out
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Profile; 