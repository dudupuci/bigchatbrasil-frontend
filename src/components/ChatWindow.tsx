import { useState, useRef, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Input,
  Button,
  Text,
  Flex,
  Circle,
  IconButton,
  useColorMode,
  useToast,
  Heading,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import { ArrowBackIcon, EditIcon, DeleteIcon } from '@chakra-ui/icons';

interface Message {
  id: string;
  text: string;
  sender: 'me' | 'other';
  timestamp: Date;
}

interface ChatWindowProps {
  contactName: string;
  onBack?: () => void;
  showBackButton?: boolean;
}

const ChatWindow = ({ contactName, onBack, showBackButton = false }: ChatWindowProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  const [editText, setEditText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { colorMode } = useColorMode();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

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
      sender: 'me',
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setInputValue('');

    // Simular resposta automática
    setTimeout(() => {
      const autoReply: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Obrigado pela mensagem! Em breve retornaremos.',
        sender: 'other',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, autoReply]);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((msg) => msg.id !== messageId));
    toast({
      title: 'Mensagem excluída',
      status: 'info',
      duration: 2000,
      isClosable: true,
    });
  };

  const handleEditMessage = (message: Message) => {
    setEditingMessage(message);
    setEditText(message.text);
    onOpen();
  };

  const handleSaveEdit = () => {
    if (editText.trim() === '') {
      toast({
        title: 'Mensagem vazia',
        description: 'A mensagem não pode estar vazia.',
        status: 'warning',
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    setMessages(
      messages.map((msg) =>
        msg.id === editingMessage?.id ? { ...msg, text: editText } : msg
      )
    );

    toast({
      title: 'Mensagem editada',
      status: 'success',
      duration: 2000,
      isClosable: true,
    });

    onClose();
    setEditingMessage(null);
    setEditText('');
  };

  const handleCancelEdit = () => {
    onClose();
    setEditingMessage(null);
    setEditText('');
  };

  return (
    <Flex direction="column" h="100%" bg={colorMode === 'dark' ? 'gray.800' : 'white'} borderRadius="lg">
      {/* Header */}
      <HStack p={4} borderBottom="1px" borderColor={colorMode === 'dark' ? 'gray.600' : 'gray.200'} spacing={3}>
        {showBackButton && (
          <IconButton
            aria-label="Voltar"
            icon={<ArrowBackIcon />}
            variant="ghost"
            onClick={onBack}
            display={{ base: 'flex', md: 'none' }}
          />
        )}
        <Circle size="40px" bg="blue.500" color="white" fontWeight="bold">
          {contactName[0].toUpperCase()}
        </Circle>
        <Box flex={1}>
          <Heading size="sm">{contactName}</Heading>
          <Text fontSize="xs" color="green.500">
            Online
          </Text>
        </Box>
      </HStack>

      {/* Messages Area */}
      <Box flex={1} overflowY="auto" p={4}>
        <VStack spacing={4} align="stretch">
          {messages.length === 0 ? (
            <Text textAlign="center" color="gray.500" mt={8}>
              Nenhuma mensagem ainda. Comece a conversar!
            </Text>
          ) : (
            messages.map((message) => (
              <Flex key={message.id} justify={message.sender === 'me' ? 'flex-end' : 'flex-start'}>
                <HStack maxW="70%" spacing={2} flexDirection={message.sender === 'me' ? 'row-reverse' : 'row'}>
                  <Circle size="32px" bg={message.sender === 'me' ? 'blue.500' : 'gray.500'} color="white" fontWeight="bold" fontSize="sm">
                    {message.sender === 'me' ? 'V' : contactName[0].toUpperCase()}
                  </Circle>
                  <Box>
                    <Menu>
                      <MenuButton
                        as={Box}
                        cursor="pointer"
                        bg={message.sender === 'me' ? 'blue.500' : colorMode === 'dark' ? 'gray.700' : 'gray.200'}
                        color={message.sender === 'me' ? 'white' : 'inherit'}
                        px={4}
                        py={2}
                        borderRadius="lg"
                        _hover={{
                          opacity: 0.8,
                        }}
                        transition="opacity 0.2s"
                      >
                        <Text>{message.text}</Text>
                      </MenuButton>
                      {message.sender === 'me' && (
                        <MenuList>
                          <MenuItem icon={<EditIcon />} onClick={() => handleEditMessage(message)}>
                            Editar
                          </MenuItem>
                          <MenuItem icon={<DeleteIcon />} onClick={() => handleDeleteMessage(message.id)} color="red.500">
                            Excluir
                          </MenuItem>
                        </MenuList>
                      )}
                    </Menu>
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

      {/* Input Area */}
      <HStack p={4} borderTop="1px" borderColor={colorMode === 'dark' ? 'gray.600' : 'gray.200'} spacing={3}>
        <Input
          placeholder="Digite sua mensagem..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyPress}
          size="lg"
          variant="filled"
        />
        <Button colorScheme="blue" onClick={handleSendMessage} size="lg" px={8}>
          Enviar
        </Button>
      </HStack>

      {/* Modal Editar Mensagem */}
      <Modal isOpen={isOpen} onClose={handleCancelEdit}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Editar Mensagem</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              placeholder="Digite a nova mensagem..."
              size="lg"
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={handleCancelEdit}>
              Cancelar
            </Button>
            <Button colorScheme="blue" onClick={handleSaveEdit}>
              Salvar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default ChatWindow;
