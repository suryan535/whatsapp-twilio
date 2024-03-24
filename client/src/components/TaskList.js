import {
  VStack,
  StackDivider,
  HStack,
  Text,
  Image,
  Box,
} from '@chakra-ui/react';
import ClearTasks from './ClearTasks';
import DeleteTask from './DeleteTask';
import img from '../images/empty.svg';
import supabase from '../supabase';
import { useEffect, useState } from 'react';
import { useRealtime } from 'react-supabase';

export default function TaskList(props) {
  const { users, fetchData } = props;

  if (!users || users.length === 0) {
    return (
      <Box align="center">
        <Image src={img} mt="30px" maxW="95%" />
      </Box>
    );
  }

  return (
    <>
      <VStack
        divider={<StackDivider />}
        borderColor="gray.100"
        borderWidth="2px"
        p="5"
        borderRadius="lg"
        w="700px"
        // maxW={{ base: '90vw', sm: '80vw', lg: '50vw', xl: '30vw' }}
        alignItems="stretch"
      >
        {users.map(user => {
          return (
            <HStack key={user.id}>
              <Text w="100%" p="8px" borderRadius="lg">
                {user.first_name}
              </Text>
              <Text w="100%" p="8px" borderRadius="lg">
                {user.last_name}
              </Text>
              <Text w="100%" p="8px" borderRadius="lg">
                {user.phone_number}
              </Text>
              <DeleteTask id={user.id} fetchData={fetchData} />
            </HStack>
          );
        })}
        {/* <HStack key="">
          <Text w="100%" p="8px" borderRadius="lg">
            Wash the dishes
          </Text>
          <DeleteTask />
        </HStack>
        <HStack key="">
          <Text w="100%" p="8px" borderRadius="lg">
            Wash the dishes
          </Text>
          <DeleteTask />
        </HStack>
        <HStack key="">
          <Text w="100%" p="8px" borderRadius="lg">
            Wash the dishes
          </Text>
          <DeleteTask />
        </HStack> */}
      </VStack>

      <ClearTasks fetchData={fetchData} />
    </>
  );
}
