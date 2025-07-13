import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  HStack,
  Text,
  IconButton,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useToast,
  Spinner,
  Heading,
  Flex,
  Badge
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon, AddIcon } from '@chakra-ui/icons';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', slug: '', description: '' });
  const [deleteCategory, setDeleteCategory] = useState(null);
  
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const toast = useToast();

  // Fetch categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/categories', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setCategories(data.categories);
      } else {
        toast({
          title: 'Error',
          description: data.message || 'Failed to fetch categories',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch categories',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingCategory 
        ? `/api/categories/${editingCategory._id}`
        : '/api/categories';
      
      const method = editingCategory ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (response.ok) {
        toast({
          title: 'Success',
          description: editingCategory 
            ? 'Category updated successfully' 
            : 'Category created successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        onClose();
        resetForm();
        fetchCategories();
      } else {
        toast({
          title: 'Error',
          description: data.message || 'Failed to save category',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save category',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Handle delete
  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/categories/${deleteCategory._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Category deleted successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        onDeleteClose();
        setDeleteCategory(null);
        fetchCategories();
      } else {
        const data = await response.json();
        toast({
          title: 'Error',
          description: data.message || 'Failed to delete category',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete category',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({ name: '', slug: '', description: '' });
    setEditingCategory(null);
  };

  // Open edit modal
  const openEditModal = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || ''
    });
    onOpen();
  };

  // Open add modal
  const openAddModal = () => {
    resetForm();
    onOpen();
  };

  // Open delete dialog
  const openDeleteDialog = (category) => {
    setDeleteCategory(category);
    onDeleteOpen();
  };

  return (
    <Box p={6}>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg" color="gray.800">Category Management</Heading>
        <Button
          leftIcon={<AddIcon />}
          colorScheme="anime"
          onClick={openAddModal}
          size="lg"
        >
          Add Category
        </Button>
      </Flex>

      {loading ? (
        <Flex justify="center" align="center" h="200px">
          <Spinner size="xl" color="anime.primary" />
        </Flex>
      ) : (
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box
            bg="white"
            borderRadius="xl"
            boxShadow="lg"
            overflow="hidden"
          >
            <Table variant="simple">
              <Thead bg="gray.50">
                <Tr>
                  <Th>Name</Th>
                  <Th>Slug</Th>
                  <Th>Description</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {categories.map((category) => (
                  <Tr key={category._id} _hover={{ bg: 'gray.50' }}>
                    <Td fontWeight="medium">{category.name}</Td>
                    <Td>
                      <Badge colorScheme="blue" variant="subtle">
                        {category.slug}
                      </Badge>
                    </Td>
                    <Td>
                      <Text noOfLines={2} color="gray.600">
                        {category.description || 'No description'}
                      </Text>
                    </Td>
                    <Td>
                      <HStack spacing={2}>
                        <IconButton
                          icon={<EditIcon />}
                          size="sm"
                          colorScheme="blue"
                          variant="ghost"
                          onClick={() => openEditModal(category)}
                          aria-label="Edit category"
                        />
                        <IconButton
                          icon={<DeleteIcon />}
                          size="sm"
                          colorScheme="red"
                          variant="ghost"
                          onClick={() => openDeleteDialog(category)}
                          aria-label="Delete category"
                        />
                      </HStack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </MotionBox>
      )}

      {/* Add/Edit Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {editingCategory ? 'Edit Category' : 'Add New Category'}
          </ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleSubmit}>
            <ModalBody>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Name</FormLabel>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter category name"
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Slug</FormLabel>
                  <Input
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="Enter URL slug (e.g., anime-figures)"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter category description (optional)"
                    rows={3}
                  />
                </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="anime" type="submit">
                {editingCategory ? 'Update' : 'Create'}
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <AlertDialog isOpen={isDeleteOpen} onClose={onDeleteClose}>
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogHeader>Delete Category</AlertDialogHeader>
          <AlertDialogBody>
            Are you sure you want to delete "{deleteCategory?.name}"? This action cannot be undone.
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button onClick={onDeleteClose}>Cancel</Button>
            <Button colorScheme="red" ml={3} onClick={handleDelete}>
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Box>
  );
};

export default Categories; 