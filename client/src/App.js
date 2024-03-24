import { Heading, VStack } from '@chakra-ui/react';
import AddTask from './components/AddTask';
import TaskList from './components/TaskList';
import Message from './components/Message';

import supabase from './supabase';
import { useState, useEffect } from 'react';

export default function App() {
  const [users, setUsers] = useState([]);

  const fetchData = async () => {
    let { data, error } = await supabase.from('whatsapp-details').select('*');
    setUsers(data);
    console.log(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <VStack p={4} minH="100vh">
      <Heading
        mt="20"
        p="5"
        fontWeight="extrabold"
        size="xl"
        bgGradient="linear(to-l, teal.300, blue.500)"
        bgClip="text"
      >
        WhatsApp Broadcast Details
      </Heading>
      <AddTask fetchData={fetchData} />
      <TaskList users={users} fetchData={fetchData} />
      <Message users={users} />
    </VStack>
  );
}
