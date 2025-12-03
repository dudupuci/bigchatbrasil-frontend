import React from 'react';
import { useState, useRef, useEffect } from 'react';
import {
  Box,
  Container,
  VStack,
  HStack,
  Input,
  Button,
  Text,
  Heading,
  Flex,
  IconButton,
  Divider,
  useToast,
  useColorMode,
  Circle,
} from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'other';
  timestamp: Date;
  username: string;
}

const App = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [username] = useState('Usuário');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { colorMode, toggleColorMode } = useColorMode();
  const toast = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (inputValue.trim() === '') {
      toast({
        title: 'Mensagem vazia',
        description: 'Por favor, digite uma mensagem.',
        status: 'warning',
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
      username: username,
    };

    setMessages([...messages, newMessage]);
    setInputValue('');

    // Simular resposta autom�tica
    setTimeout(() => {
      const autoReply: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Mensagem recebida! Este é um sistema de chat simples.',
        sender: 'other',
        timestamp: new Date(),
        username: 'Sistema',
      };
      setMessages((prev) => [...prev, autoReply]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <Box minH="100vh" bg={colorMode === 'dark' ? 'gray.900' : 'gray.50'}>
      <Container maxW="container.md" h="100vh" py={4}>
        <VStack h="full" spacing={0}>
          <Flex
            w="full"
            p={4}
            bg={colorMode === 'dark' ? 'gray.800' : 'white'}
            borderRadius="lg"
            borderBottomRadius={0}
            alignItems="center"
            justifyContent="space-between"
            boxShadow="sm"
          >
            <HStack spacing={3}>
              <Circle size="40px" bg="blue.500" color="white" fontWeight="bold">
                {username[0]}
              </Circle>
              <Heading size="md">Chat Online</Heading>
            </HStack>
            <IconButton
              aria-label="Toggle color mode"
              icon={colorMode === 'dark' ? <SunIcon /> : <MoonIcon />}
              onClick={toggleColorMode}
              variant="ghost"
            />
          </Flex>

          <Divider />

          <Box
            flex={1}
            w="full"
            bg={colorMode === 'dark' ? 'gray.800' : 'white'}
            overflowY="auto"
            p={4}
          >
            <VStack spacing={4} align="stretch">
              {messages.length === 0 ? (
                <Text textAlign="center" color="gray.500" mt={8}>
                  Nenhuma mensagem ainda. Comece a conversar!
                </Text>
              ) : (
                messages.map((message) => (
                  <Flex
                    key={message.id}
                    justify={message.sender === 'user' ? 'flex-end' : 'flex-start'}
                  >
                    <HStack
                      maxW="70%"
                      spacing={2}
                      flexDirection={message.sender === 'user' ? 'row-reverse' : 'row'}
                    >
                      <Circle 
                        size="32px" 
                        bg={message.sender === 'user' ? 'blue.500' : 'gray.500'} 
                        color="white" 
                        fontWeight="bold"
                        fontSize="sm"
                      >
                        {message.username[0]}
                      </Circle>
                      <Box>
                        <Text fontSize="xs" color="gray.500" mb={1}>
                          {message.username}
                        </Text>
                        <Box
                          bg={
                            message.sender === 'user'
                              ? 'blue.500'
                              : colorMode === 'dark'
                              ? 'gray.700'
                              : 'gray.200'
                          }
                          color={message.sender === 'user' ? 'white' : 'inherit'}
                          px={4}
                          py={2}
                          borderRadius="lg"
                        >
                          <Text>{message.text}</Text>
                        </Box>
                        <Text fontSize="xs" color="gray.500" mt={1}>
                          {message.timestamp.toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </Text>
                      </Box>
                    </HStack>
                  </Flex>
                ))
              )}
              <div ref={messagesEndRef} />
            </VStack>
          </Box>

          <HStack
            w="full"
            p={4}
            bg={colorMode === 'dark' ? 'gray.800' : 'white'}
            borderRadius="lg"
            borderTopRadius={0}
            boxShadow="sm"
            spacing={3}
          >
            <Input
              placeholder="Digite sua mensagem..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              size="lg"
              variant="outline"
            />
            <Button
              colorScheme="blue"
              onClick={handleSendMessage}
              size="lg"
              px={8}
            >
              Enviar
            </Button>
          </HStack>
        </VStack>
      </Container>
    </Box>
  );
};

export default App;
