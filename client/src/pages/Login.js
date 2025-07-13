import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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
  Image,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { motion } from 'framer-motion';

import { login, clearError } from '../store/slices/authSlice';

const MotionBox = motion(Box);

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const bgGradient = useColorModeValue(
    'linear(to-br, anime.primary, anime.secondary)',
    'linear(to-br, anime.dark, anime.secondary)'
  );

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  // Clear error when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(login(formData));
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
                  Welcome Back!
                </Heading>
                <Text color="gray.600">
                  Sign in to your Anime Store account
                </Text>
              </VStack>
            </VStack>

            {/* Login Form */}
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

                  {/* Email Field */}
                  <FormControl isRequired>
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

                  {/* Password Field */}
                  <FormControl isRequired>
                    <FormLabel color="gray.700">Password</FormLabel>
                    <InputGroup size="lg">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
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

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    colorScheme="brand"
                    size="lg"
                    w="full"
                    isLoading={loading}
                    loadingText="Signing in..."
                    _hover={{ transform: 'translateY(-1px)' }}
                    transition="all 0.2s"
                  >
                    Sign In
                  </Button>
                </VStack>
              </form>
            </Box>

            {/* Divider */}
            <HStack w="full" spacing={4}>
              <Divider />
              <Text fontSize="sm" color="gray.500" whiteSpace="nowrap">
                New to Anime Store?
              </Text>
              <Divider />
            </HStack>

            {/* Register Link */}
            <Button
              variant="outline"
              colorScheme="brand"
              size="lg"
              w="full"
              as={Link}
              to="/register"
              _hover={{ transform: 'translateY(-1px)' }}
              transition="all 0.2s"
            >
              Create Account
            </Button>

            {/* Forgot Password */}
            <Text fontSize="sm" color="gray.600">
              <Link to="/forgot-password" style={{ color: 'var(--chakra-colors-anime-primary)' }}>
                Forgot your password?
              </Link>
            </Text>
          </VStack>
        </MotionBox>
      </Container>
    </Box>
  );
};

export default Login; 