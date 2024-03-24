import { VStack, Textarea, Button, useToast } from '@chakra-ui/react';
import { useState } from 'react';

const Message = ({ users }) => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const toast = useToast();

  const handleSubmit = () => {
    setLoading(true);
    const phoneNumbers = [];

    users.forEach(user => {
      phoneNumbers.push(user.phone_number);
    });

    fetch('http://localhost:5000/send-whatsapp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add any other headers if needed
      },
      body: JSON.stringify({
        message: text,
        phoneNumbers,
        // Add any other data you want to send in the request body
      }),
    })
      .then(response => {
        setLoading(false);
        setText('');

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        toast({
          title: 'Messge Sent Succesfully',
          position: 'top',
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
        return response.json(); // Parse the JSON response
      })
      .then(data => {
        // Handle the response data
        console.log(data);
      })
      .catch(error => {
        // Handle errors
        console.error('There was a problem with your fetch operation:', error);
      });
  };

  return (
    <VStack>
      <Textarea
        placeholder="WhatsApp Message"
        value={text}
        size="sm"
        mt="10px"
        onChange={e => setText(e.target.value)}
      />
      <Button
        colorScheme="blue"
        px="10"
        h="50px"
        type="submit"
        isLoading={loading}
        loadingText={'Sending'}
        onClick={handleSubmit}
      >
        Send Message
      </Button>
    </VStack>
  );
};

export default Message;
