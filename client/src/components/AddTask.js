import { Button, HStack, Input, useToast } from '@chakra-ui/react';
import { useState } from 'react';
import supabase from '../supabase';

export default function AddTask(props) {
  const { fetchData } = props;
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('whatsapp-details')
      .insert([
        {
          first_name: firstName,
          last_name: lastName,
          phone_number: phoneNumber,
        },
      ])
      .select();

    toast({
      title: error || 'Task added',
      position: 'top',
      status: error ? 'error' : 'success',
      duration: 2000,
      isClosable: true,
    });

    if (!error) fetchData();

    setLastName('');
    setFirstName('');
    setPhoneNumber('');

    setLoading(false);
  };

  return (
    <HStack my="4" h="45">
      <Input
        h="100%"
        variant="filled"
        placeholder="First Name"
        value={firstName}
        onChange={e => setFirstName(e.target.value)}
      />
      <Input
        h="100%"
        variant="filled"
        placeholder="Last Name"
        value={lastName}
        onChange={e => setLastName(e.target.value)}
      />
      <Input
        h="100%"
        variant="filled"
        placeholder="Phone Number"
        value={phoneNumber}
        onChange={e => setPhoneNumber(e.target.value)}
      />
      <Button
        colorScheme="blue"
        px="10"
        h="100%"
        type="submit"
        isLoading={loading}
        loadingText={'Adding'}
        onClick={handleSubmit}
      >
        Add
      </Button>
    </HStack>
  );
}
