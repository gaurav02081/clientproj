import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Spinner, Center, Text, VStack } from '@chakra-ui/react';

const AdminRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useSelector((state) => state.auth);
  const location = useLocation();

  if (loading) {
    return (
      <Center h="50vh">
        <Spinner size="xl" color="brand.500" />
      </Center>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user?.role !== 'admin') {
    return (
      <Center h="50vh">
        <VStack spacing={4}>
          <Text fontSize="xl" fontWeight="bold" color="red.500">
            Access Denied
          </Text>
          <Text color="gray.600">
            You don't have permission to access this page.
          </Text>
        </VStack>
      </Center>
    );
  }

  return children;
};

export default AdminRoute; 