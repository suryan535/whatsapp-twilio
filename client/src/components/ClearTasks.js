import { Flex, Button, useToast } from '@chakra-ui/react';
import { useState } from 'react';
import supabase from '../supabase';

export default function ClearTasks({ fetchData }) {
  const [loading, setLoading] = useState(false);

  const toast = useToast();

  const handleDelete = async () => {
    setLoading(true);
    const { error } = await supabase
      .from('whatsapp-details')
      .delete()
      .not('id', 'eq', -1);
    setLoading(false);

    toast({
      title: error || 'All details deleted',
      position: 'top',
      status: error ? 'error' : 'success',
      duration: 2000,
      isClosable: true,
    });

    fetchData();
  };

  return (
    <Flex>
      <Button
        colorScheme="gray"
        px="8"
        h="45"
        color="gray.500"
        mt="10"
        isLoading={loading}
        loadingText={'Clearing'}
        onClick={handleDelete}
      >
        Clear Tasks
      </Button>
    </Flex>
  );
}
