import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Button,
  IconButton,
  Divider,
  Alert,
  AlertIcon,
  useColorModeValue,
  SimpleGrid,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { motion } from 'framer-motion';

import { register, clearError } from '../store/slices/authSlice';

const MotionBox = motion(Box);

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const bgGradient = useColorModeValue(
    'linear(to-br, anime.primary, anime.secondary)',
    'linear(to-br, anime.dark, anime.secondary)'
  );

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Clear error when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const validateForm = () => {
    const errors = {};

    // Username validation
    if (!formData.username.trim()) {
      errors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      errors.username = 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      errors.username = 'Username can only contain letters, numbers, and underscores';
    }

    // Email validation
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    // First name validation
    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    }

    // Last name validation
    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    
    // Clear error when user starts typing
    if (formErrors[e.target.name]) {
      setFormErrors({
        ...formErrors,
        [e.target.name]: '',
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const { confirmPassword, ...registerData } = formData;
      dispatch(register(registerData));
    }
  };

  return (
    <Box minH="100vh" bg="gray.50" py={8}>
      <Container maxW="lg">
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <VStack spacing={8}>
            {/* Logo and Title */}
            <VStack spacing={4} textAlign="center">
              <Box
                w={16}
                h={16}
                bgGradient={bgGradient}
                borderRadius="full"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Text color="white" fontWeight="bold" fontSize="2xl">
                  A
                </Text>
              </Box>
              <VStack spacing={2}>
                <Heading size="lg" color="gray.800">
                  Join Anime Store
                </Heading>
                <Text color="gray.600">
                  Create your account to start shopping
                </Text>
              </VStack>
            </VStack>

            {/* Registration Form */}
            <Box
              w="full"
              bg="white"
              borderRadius="xl"
              boxShadow="lg"
              p={8}
              border="1px"
              borderColor="gray.200"
            >
              <form onSubmit={handleSubmit}>
                <VStack spacing={6}>
                  {/* Error Alert */}
                  {error && (
                    <Alert status="error" borderRadius="md">
                      <AlertIcon />
                      {error}
                    </Alert>
                  )}

                  {/* Name Fields */}
                  <SimpleGrid columns={2} spacing={4} w="full">
                    <FormControl isRequired isInvalid={!!formErrors.firstName}>
                      <FormLabel color="gray.700">First Name</FormLabel>
                      <Input
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="First name"
                        size="lg"
                        borderRadius="md"
                        _focus={{
                          borderColor: 'anime.primary',
                          boxShadow: '0 0 0 1px var(--chakra-colors-anime-primary)',
                        }}
                      />
                    </FormControl>

                    <FormControl isRequired isInvalid={!!formErrors.lastName}>
                      <FormLabel color="gray.700">Last Name</FormLabel>
                      <Input
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Last name"
                        size="lg"
                        borderRadius="md"
                        _focus={{
                          borderColor: 'anime.primary',
                          boxShadow: '0 0 0 1px var(--chakra-colors-anime-primary)',
                        }}
                      />
                    </FormControl>
                  </SimpleGrid>

                  {/* Username Field */}
                  <FormControl isRequired isInvalid={!!formErrors.username}>
                    <FormLabel color="gray.700">Username</FormLabel>
                    <Input
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Choose a username"
                      size="lg"
                      borderRadius="md"
                      _focus={{
                        borderColor: 'anime.primary',
                        boxShadow: '0 0 0 1px var(--chakra-colors-anime-primary)',
                      }}
                    />
                  </FormControl>

                  {/* Email Field */}
                  <FormControl isRequired isInvalid={!!formErrors.email}>
                    <FormLabel color="gray.700">Email Address</FormLabel>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      size="lg"
                      borderRadius="md"
                      _focus={{
                        borderColor: 'anime.primary',
                        boxShadow: '0 0 0 1px var(--chakra-colors-anime-primary)',
                      }}
                    />
                  </FormControl>

                  {/* Phone Field */}
                  <FormControl>
                    <FormLabel color="gray.700">Phone Number (Optional)</FormLabel>
                    <Input
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                      size="lg"
                      borderRadius="md"
                      _focus={{
                        borderColor: 'anime.primary',
                        boxShadow: '0 0 0 1px var(--chakra-colors-anime-primary)',
                      }}
                    />
                  </FormControl>

                  {/* Password Field */}
                  <FormControl isRequired isInvalid={!!formErrors.password}>
                    <FormLabel color="gray.700">Password</FormLabel>
                    <InputGroup size="lg">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Create a password"
                        borderRadius="md"
                        _focus={{
                          borderColor: 'anime.primary',
                          boxShadow: '0 0 0 1px var(--chakra-colors-anime-primary)',
                        }}
                      />
                      <InputRightElement>
                        <IconButton
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                          icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                          variant="ghost"
                          onClick={() => setShowPassword(!showPassword)}
                        />
                      </InputRightElement>
                    </InputGroup>
                  </FormControl>

                  {/* Confirm Password Field */}
                  <FormControl isRequired isInvalid={!!formErrors.confirmPassword}>
                    <FormLabel color="gray.700">Confirm Password</FormLabel>
                    <InputGroup size="lg">
                      <Input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm your password"
                        borderRadius="md"
                        _focus={{
                          borderColor: 'anime.primary',
                          boxShadow: '0 0 0 1px var(--chakra-colors-anime-primary)',
                        }}
                      />
                      <InputRightElement>
                        <IconButton
                          aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                          icon={showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />}
                          variant="ghost"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        />
                      </InputRightElement>
                    </InputGroup>
                  </FormControl>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    colorScheme="brand"
                    size="lg"
                    w="full"
                    isLoading={loading}
                    loadingText="Creating account..."
                    _hover={{ transform: 'translateY(-1px)' }}
                    transition="all 0.2s"
                  >
                    Create Account
                  </Button>
                </VStack>
              </form>
            </Box>

            {/* Divider */}
            <HStack w="full" spacing={4}>
              <Divider />
              <Text fontSize="sm" color="gray.500" whiteSpace="nowrap">
                Already have an account?
              </Text>
              <Divider />
            </HStack>

            {/* Login Link */}
            <Button
              variant="outline"
              colorScheme="brand"
              size="lg"
              w="full"
              as={Link}
              to="/login"
              _hover={{ transform: 'translateY(-1px)' }}
              transition="all 0.2s"
            >
              Sign In
            </Button>

            {/* Terms */}
            <Text fontSize="xs" color="gray.500" textAlign="center">
              By creating an account, you agree to our{' '}
              <Link to="/terms" style={{ color: 'var(--chakra-colors-anime-primary)' }}>
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" style={{ color: 'var(--chakra-colors-anime-primary)' }}>
                Privacy Policy
              </Link>
            </Text>
          </VStack>
        </MotionBox>
      </Container>
    </Box>
  );
};

export default Register; 