import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Flex,
  Text,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  IconButton,
  Badge,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Avatar,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  VStack,
  HStack,
  Divider,
  useColorModeValue,
  useColorMode,
} from '@chakra-ui/react';
import {
  FaBox,
  FaDragon,
  FaMoon,
  FaSun,
} from 'react-icons/fa';
import { FiShoppingCart, FiUser, FiLogOut, FiPackage, FiUsers, FiBarChart2, FiSearch, FiMenu, FiGrid } from 'react-icons/fi';
import { motion } from 'framer-motion';

import { logout } from '../store/slices/authSlice';
import { clearCart } from '../store/slices/cartSlice';

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [searchQuery, setSearchQuery] = useState('');
  const { colorMode, toggleColorMode } = useColorMode();

  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { itemCount } = useSelector((state) => state.cart);

  const headerBg = useColorModeValue('rgba(255, 255, 255, 0.8)', 'rgba(26, 32, 44, 0.8)');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const navLinkColor = useColorModeValue('gray.700', 'gray.200');
  const navLinkInactive = useColorModeValue('gray.600', 'gray.400');
  const navLinkActive = useColorModeValue('anime.pink', 'anime.pink');
  const searchBg = useColorModeValue('white', 'gray.800');
  const searchBorder = useColorModeValue('gray.300', 'gray.700');
  const searchFocusBg = useColorModeValue('white', 'gray.700');
  const searchPlaceholder = useColorModeValue('gray.400', 'gray.500');

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Products', path: '/products' },
    { label: 'Categories', path: '/products' },
  ];

  const adminNavItems = [
    { label: 'Dashboard', path: '/admin', icon: FiBarChart2 },
    { label: 'Products', path: '/admin/products', icon: FiPackage },
    { label: 'Categories', path: '/admin/categories', icon: FiGrid },
    { label: 'Orders', path: '/admin/orders', icon: FaBox },
    { label: 'Users', path: '/admin/users', icon: FiUsers },
  ];

  return (
    <MotionBox
      as="header"
      position="sticky"
      top={0}
      zIndex={1000}
      backdropFilter="blur(20px)"
      bg={headerBg}
      borderBottom="1px"
      borderColor={borderColor}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Flex
        maxW="1200px"
        mx="auto"
        px={4}
        py={4}
        align="center"
        justify="space-between"
      >
        {/* Logo */}
        <Link to="/">
          <MotionFlex 
            align="center" 
            cursor="pointer" 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Box
              w={12}
              h={12}
              bgGradient="linear(to-r, anime.pink, anime.purple)"
              borderRadius="full"
              display="flex"
              alignItems="center"
              justifyContent="center"
              mr={3}
              boxShadow="lg"
              position="relative"
              _before={{
                content: '""',
                position: 'absolute',
                top: '-2px',
                left: '-2px',
                right: '-2px',
                bottom: '-2px',
                background: 'linear-gradient(45deg, anime.pink, anime.purple, anime.blue)',
                borderRadius: 'full',
                zIndex: -1,
                animation: 'pulse 2s infinite',
              }}
            >
              <FaDragon color="white" size={24} />
            </Box>
            <VStack align="flex-start" spacing={0}>
              <Text
                fontSize="2xl"
                fontWeight="black"
                bgGradient="linear(to-r, anime.pink, anime.purple)"
                bgClip="text"
                fontFamily="Poppins"
                letterSpacing="wider"
              >
                SAIYANKRAFT
              </Text>
              <Text
                fontSize="xs"
                color="gray.500"
                fontWeight="medium"
                textTransform="uppercase"
                letterSpacing="wider"
              >
                Premium Anime Merchandise
              </Text>
            </VStack>
          </MotionFlex>
        </Link>

        {/* Desktop Navigation */}
        <Flex display={{ base: 'none', md: 'flex' }} align="center" gap={8}>
          {/* Search Bar */}
          <Box as="form" onSubmit={handleSearch} flex="1" maxW="400px">
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <FiSearch color="gray.400" />
              </InputLeftElement>
              <Input
                placeholder="Search anime products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                size="lg"
                borderRadius="full"
                bg={searchBg}
                borderColor={searchBorder}
                color={navLinkColor}
                _placeholder={{ color: searchPlaceholder }}
                _focus={{
                  bg: searchFocusBg,
                  borderColor: 'anime.pink',
                  boxShadow: '0 0 0 1px var(--chakra-colors-anime-pink)',
                }}
                _hover={{
                  borderColor: 'anime.purple',
                }}
              />
            </InputGroup>
          </Box>

          {/* Navigation Links */}
          <Flex gap={6}>
            {navItems.map((item) => (
              <Link key={item.path} to={item.path}>
                <MotionBox
                  fontWeight="semibold"
                  color={isActive(item.path) ? navLinkActive : navLinkInactive}
                  position="relative"
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                  _after={{
                    content: '""',
                    position: 'absolute',
                    bottom: '-4px',
                    left: '0',
                    width: isActive(item.path) ? '100%' : '0%',
                    height: '2px',
                    bg: 'anime.pink',
                    transition: 'width 0.2s',
                  }}
                  _hover={{
                    _after: {
                      width: '100%',
                    },
                  }}
                >
                  {item.label}
                </MotionBox>
              </Link>
            ))}
          </Flex>

          {/* Cart */}
          <Link to="/cart">
            <MotionBox
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                variant="ghost"
                position="relative"
                colorScheme="saiyan"
                size="md"
                borderRadius="full"
                _hover={{
                  bg: 'anime.pink',
                  color: 'white',
                }}
                transition="all 0.2s"
              >
                <FiShoppingCart size={20} />
                {itemCount > 0 && (
                  <Badge
                    position="absolute"
                    top="-1"
                    right="-1"
                    colorScheme="dragon"
                    borderRadius="full"
                    fontSize="xs"
                    fontWeight="bold"
                    animation="pulse 2s infinite"
                  >
                    {itemCount}
                  </Badge>
                )}
              </Button>
            </MotionBox>
          </Link>

          {/* Color Mode Toggle */}
          <IconButton
            icon={colorMode === 'light' ? <FaMoon /> : <FaSun />}
            onClick={toggleColorMode}
            variant="ghost"
            size="md"
            borderRadius="full"
            colorScheme="saiyan"
            _hover={{
              bg: 'anime.purple',
              color: 'white',
            }}
          />

          {/* User Menu */}
          {isAuthenticated ? (
            <Menu>
              <MenuButton
                as={Button}
                variant="ghost"
                size="md"
                borderRadius="full"
                _hover={{
                  bg: 'anime.pink',
                  color: 'white',
                }}
                transition="all 0.2s"
              >
                <Avatar 
                  size="sm" 
                  name={user?.firstName} 
                  src={user?.avatar}
                  bg="anime.pink"
                  color="white"
                />
              </MenuButton>
              <MenuList boxShadow="xl" borderColor="anime.pink" borderRadius="xl">
                <MenuItem icon={<FiUser />} onClick={() => navigate('/profile')}>
                  Profile
                </MenuItem>
                <MenuItem icon={<FiPackage />} onClick={() => navigate('/orders')}>
                  My Orders
                </MenuItem>
                {user?.role === 'admin' && (
                  <>
                    <MenuDivider />
                    <Text px={3} py={2} fontSize="sm" color="anime.pink" fontWeight="bold">
                      Admin Panel
                    </Text>
                    {adminNavItems.map((item) => (
                      <MenuItem
                        key={item.path}
                        icon={<item.icon />}
                        onClick={() => navigate(item.path)}
                        _hover={{
                          bg: 'anime.pink',
                          color: 'white',
                        }}
                      >
                        {item.label}
                      </MenuItem>
                    ))}
                  </>
                )}
                <MenuDivider />
                <MenuItem 
                  icon={<FiLogOut />} 
                  onClick={handleLogout} 
                  color="dragon.500"
                  _hover={{
                    bg: 'dragon.50',
                  }}
                >
                  Logout
                </MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <Flex gap={3}>
              <Button
                variant="outline"
                colorScheme="saiyan"
                onClick={() => navigate('/login')}
                borderRadius="xl"
                _hover={{
                  transform: 'translateY(-2px)',
                  boxShadow: 'lg',
                  borderColor: 'anime.pink',
                }}
                transition="all 0.2s"
              >
                Login
              </Button>
              <Button
                variant="gradient"
                onClick={() => navigate('/register')}
                _hover={{
                  transform: 'translateY(-2px)',
                  boxShadow: 'lg',
                }}
                transition="all 0.2s"
              >
                Register
              </Button>
            </Flex>
          )}
        </Flex>

        {/* Mobile Menu Button */}
        <IconButton
          display={{ base: 'flex', md: 'none' }}
          icon={<FiMenu />}
          variant="ghost"
          colorScheme="saiyan"
          onClick={onOpen}
          aria-label="Open menu"
          borderRadius="full"
        />
      </Flex>

      {/* Mobile Menu */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">
            <Text
              fontSize="xl"
              fontWeight="bold"
              bgGradient="linear(to-r, anime.pink, anime.purple)"
              bgClip="text"
            >
              Saiyankraft
            </Text>
          </DrawerHeader>
          <DrawerBody>
            <VStack spacing={4} align="stretch">
              {/* Search */}
              <Box as="form" onSubmit={handleSearch}>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <FiSearch color="gray.400" />
                  </InputLeftElement>
                  <Input
                    placeholder="Search anime products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    borderRadius="full"
                    variant="filled"
                  />
                </InputGroup>
              </Box>

              <Divider />

              {/* Navigation */}
              {navItems.map((item) => (
                <Link key={item.path} to={item.path} onClick={onClose}>
                  <Text
                    py={2}
                    fontWeight="medium"
                    color={isActive(item.path) ? 'anime.pink' : 'gray.600'}
                    borderBottom="1px"
                    borderColor="gray.100"
                  >
                    {item.label}
                  </Text>
                </Link>
              ))}

              <Divider />

              {/* User Actions */}
              {isAuthenticated ? (
                <VStack spacing={2} align="stretch">
                  <Button
                    variant="ghost"
                    justifyContent="flex-start"
                    onClick={() => {
                      navigate('/profile');
                      onClose();
                    }}
                  >
                    <FiUser style={{ marginRight: '8px' }} />
                    Profile
                  </Button>
                  <Button
                    variant="ghost"
                    justifyContent="flex-start"
                    onClick={() => {
                      navigate('/orders');
                      onClose();
                    }}
                  >
                    <FiPackage style={{ marginRight: '8px' }} />
                    My Orders
                  </Button>
                  {user?.role === 'admin' && (
                    <>
                      <Divider />
                      <Text px={2} py={1} fontSize="sm" color="anime.pink" fontWeight="bold">
                        Admin Panel
                      </Text>
                      {adminNavItems.map((item) => (
                        <Button
                          key={item.path}
                          variant="ghost"
                          justifyContent="flex-start"
                          onClick={() => {
                            navigate(item.path);
                            onClose();
                          }}
                        >
                          <item.icon style={{ marginRight: '8px' }} />
                          {item.label}
                        </Button>
                      ))}
                    </>
                  )}
                  <Divider />
                  <Button
                    variant="ghost"
                    justifyContent="flex-start"
                    color="dragon.500"
                    onClick={() => {
                      handleLogout();
                      onClose();
                    }}
                  >
                    <FiLogOut style={{ marginRight: '8px' }} />
                    Logout
                  </Button>
                </VStack>
              ) : (
                <VStack spacing={3}>
                  <Button
                    variant="outline"
                    colorScheme="saiyan"
                    w="full"
                    onClick={() => {
                      navigate('/login');
                      onClose();
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    variant="gradient"
                    w="full"
                    onClick={() => {
                      navigate('/register');
                      onClose();
                    }}
                  >
                    Register
                  </Button>
                </VStack>
              )}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </MotionBox>
  );
};

export default Header; 