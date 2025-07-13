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
  Avatar,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
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
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Switch,
  Tooltip,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { 
  FiUsers, 
  FiUser, 
  FiMail, 
  FiCalendar,
  FiSearch,
  FiFilter,
  FiEye,
  FiEdit,
  FiTrash2,
  FiShield,
  FiCheckCircle,
  FiXCircle,
  FiStar,
  FiShoppingCart
} from 'react-icons/fi';

const MotionBox = motion(Box);

const AdminUsers = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setUsers(data.users || []);
      } else {
        toast({
          title: 'Error',
          description: data.message || 'Failed to fetch users',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch users',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      const response = await fetch(`/api/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ role: newRole })
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'User role updated successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        fetchUsers();
      } else {
        const data = await response.json();
        toast({
          title: 'Error',
          description: data.message || 'Failed to update user role',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update user role',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const toggleUserStatus = async (userId, isActive) => {
    try {
      const response = await fetch(`/api/users/${userId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ isActive })
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        fetchUsers();
      } else {
        const data = await response.json();
        toast({
          title: 'Error',
          description: data.message || 'Failed to update user status',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update user status',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'red';
      case 'moderator': return 'purple';
      case 'user': return 'blue';
      default: return 'gray';
    }
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    onOpen();
  };

  // Filter users based on search and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = !roleFilter || user.role === roleFilter;
    
    const matchesStatus = !statusFilter || 
      (statusFilter === 'active' && user.isActive) ||
      (statusFilter === 'inactive' && !user.isActive);
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Calculate user statistics
  const userStats = {
    total: users.length,
    active: users.filter(u => u.isActive).length,
    inactive: users.filter(u => !u.isActive).length,
    admins: users.filter(u => u.role === 'admin').length,
    users: users.filter(u => u.role === 'user').length,
    moderators: users.filter(u => u.role === 'moderator').length
  };

  if (loading) {
    return (
      <Box minH="100vh" bg="gray.50" py={20}>
        <Container maxW="lg">
          <VStack spacing={8} textAlign="center">
            <Spinner size="xl" color="anime.primary" />
            <Text color="gray.600">Loading users...</Text>
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
                User Management
              </Heading>
              <Text color="gray.600">
                Manage user accounts, roles, and permissions
              </Text>
            </VStack>
          </MotionBox>

          {/* User Statistics */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <SimpleGrid columns={{ base: 1, md: 2, lg: 6 }} spacing={4}>
              <Box bg={cardBg} p={4} borderRadius="lg" border="1px" borderColor={borderColor}>
                <Stat>
                  <StatLabel color="gray.600">Total Users</StatLabel>
                  <StatNumber color="gray.800">{userStats.total}</StatNumber>
                </Stat>
              </Box>
              <Box bg={cardBg} p={4} borderRadius="lg" border="1px" borderColor={borderColor}>
                <Stat>
                  <StatLabel color="gray.600">Active</StatLabel>
                  <StatNumber color="green.600">{userStats.active}</StatNumber>
                </Stat>
              </Box>
              <Box bg={cardBg} p={4} borderRadius="lg" border="1px" borderColor={borderColor}>
                <Stat>
                  <StatLabel color="gray.600">Inactive</StatLabel>
                  <StatNumber color="red.600">{userStats.inactive}</StatNumber>
                </Stat>
              </Box>
              <Box bg={cardBg} p={4} borderRadius="lg" border="1px" borderColor={borderColor}>
                <Stat>
                  <StatLabel color="gray.600">Admins</StatLabel>
                  <StatNumber color="red.600">{userStats.admins}</StatNumber>
                </Stat>
              </Box>
              <Box bg={cardBg} p={4} borderRadius="lg" border="1px" borderColor={borderColor}>
                <Stat>
                  <StatLabel color="gray.600">Moderators</StatLabel>
                  <StatNumber color="purple.600">{userStats.moderators}</StatNumber>
                </Stat>
              </Box>
              <Box bg={cardBg} p={4} borderRadius="lg" border="1px" borderColor={borderColor}>
                <Stat>
                  <StatLabel color="gray.600">Regular Users</StatLabel>
                  <StatNumber color="blue.600">{userStats.users}</StatNumber>
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
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </InputGroup>
                
                <Select
                  placeholder="Filter by role"
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                >
                  <option value="admin">Admin</option>
                  <option value="moderator">Moderator</option>
                  <option value="user">User</option>
                </Select>
                
                <Select
                  placeholder="Filter by status"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </Select>
              </SimpleGrid>
            </Box>
          </MotionBox>

          {/* Users Table */}
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
                    <Th>User</Th>
                    <Th>Email</Th>
                    <Th>Role</Th>
                    <Th>Status</Th>
                    <Th>Joined</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredUsers.map((user) => (
                    <Tr key={user._id} _hover={{ bg: 'gray.50' }}>
                      <Td>
                        <HStack spacing={3}>
                          <Avatar
                            size="sm"
                            name={user.name}
                            src={user.avatar}
                          />
                          <VStack align="flex-start" spacing={1}>
                            <Text fontWeight="medium" fontSize="sm">
                              {user.name}
                            </Text>
                            <Text fontSize="xs" color="gray.600">
                              ID: {user._id.slice(-6)}
                            </Text>
                          </VStack>
                        </HStack>
                      </Td>
                      <Td>
                        <Text fontSize="sm">{user.email}</Text>
                      </Td>
                      <Td>
                        <Badge
                          colorScheme={getRoleColor(user.role)}
                          variant="solid"
                          size="sm"
                        >
                          {user.role}
                        </Badge>
                      </Td>
                      <Td>
                        <HStack spacing={2}>
                          <Badge
                            colorScheme={user.isActive ? 'green' : 'red'}
                            variant="solid"
                            size="sm"
                          >
                            {user.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                          <Switch
                            size="sm"
                            isChecked={user.isActive}
                            onChange={(e) => toggleUserStatus(user._id, e.target.checked)}
                            colorScheme="green"
                          />
                        </HStack>
                      </Td>
                      <Td>
                        <Text fontSize="sm" color="gray.600">
                          {formatDate(user.createdAt)}
                        </Text>
                      </Td>
                      <Td>
                        <HStack spacing={2}>
                          <Tooltip label="View User Details">
                            <IconButton
                              icon={<FiEye />}
                              size="sm"
                              variant="ghost"
                              colorScheme="blue"
                              onClick={() => handleViewUser(user)}
                              aria-label="View user"
                            />
                          </Tooltip>
                          <Select
                            size="sm"
                            value={user.role}
                            onChange={(e) => updateUserRole(user._id, e.target.value)}
                            w="100px"
                          >
                            <option value="user">User</option>
                            <option value="moderator">Moderator</option>
                            <option value="admin">Admin</option>
                          </Select>
                        </HStack>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
              
              {filteredUsers.length === 0 && (
                <Box p={8} textAlign="center">
                  <Text color="gray.500">No users found matching your criteria.</Text>
                </Box>
              )}
            </Box>
          </MotionBox>
        </VStack>
      </Container>

      {/* User Details Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>User Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedUser && (
              <VStack spacing={6} align="stretch">
                {/* User Info */}
                <Box>
                  <HStack spacing={4} mb={4}>
                    <Avatar
                      size="lg"
                      name={selectedUser.name}
                      src={selectedUser.avatar}
                    />
                    <VStack align="flex-start" spacing={1}>
                      <Heading size="md">{selectedUser.name}</Heading>
                      <Text color="gray.600">{selectedUser.email}</Text>
                      <HStack spacing={2}>
                        <Badge colorScheme={getRoleColor(selectedUser.role)}>
                          {selectedUser.role}
                        </Badge>
                        <Badge colorScheme={selectedUser.isActive ? 'green' : 'red'}>
                          {selectedUser.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </HStack>
                    </VStack>
                  </HStack>
                </Box>

                <Divider />

                {/* Account Details */}
                <Box>
                  <Heading size="md" mb={4}>Account Information</Heading>
                  <SimpleGrid columns={2} spacing={4}>
                    <Box>
                      <Text fontWeight="medium" color="gray.600">User ID</Text>
                      <Text fontSize="sm">{selectedUser._id}</Text>
                    </Box>
                    <Box>
                      <Text fontWeight="medium" color="gray.600">Joined Date</Text>
                      <Text>{formatDate(selectedUser.createdAt)}</Text>
                    </Box>
                    <Box>
                      <Text fontWeight="medium" color="gray.600">Last Updated</Text>
                      <Text>{formatDate(selectedUser.updatedAt)}</Text>
                    </Box>
                    <Box>
                      <Text fontWeight="medium" color="gray.600">Account Status</Text>
                      <HStack spacing={2}>
                        <Badge colorScheme={selectedUser.isActive ? 'green' : 'red'}>
                          {selectedUser.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        <Switch
                          isChecked={selectedUser.isActive}
                          onChange={(e) => toggleUserStatus(selectedUser._id, e.target.checked)}
                          colorScheme="green"
                        />
                      </HStack>
                    </Box>
                  </SimpleGrid>
                </Box>

                <Divider />

                {/* Role Management */}
                <Box>
                  <Heading size="md" mb={4}>Role Management</Heading>
                  <VStack spacing={3} align="stretch">
                    <HStack justify="space-between">
                      <Text fontWeight="medium">Current Role</Text>
                      <Badge colorScheme={getRoleColor(selectedUser.role)}>
                        {selectedUser.role}
                      </Badge>
                    </HStack>
                    <HStack justify="space-between">
                      <Text fontWeight="medium">Change Role</Text>
                      <Select
                        value={selectedUser.role}
                        onChange={(e) => updateUserRole(selectedUser._id, e.target.value)}
                        w="150px"
                      >
                        <option value="user">User</option>
                        <option value="moderator">Moderator</option>
                        <option value="admin">Admin</option>
                      </Select>
                    </HStack>
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

export default AdminUsers; 