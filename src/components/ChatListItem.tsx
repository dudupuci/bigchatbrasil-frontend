import { Box, HStack, VStack, Text, Circle, Badge, useColorMode } from '@chakra-ui/react';

interface ChatListItemProps {
  id: string;
  nome: string;
  ultimaMensagem?: string;
  timestamp?: string;
  naoLidas?: number;
  isOnline?: boolean;
  onClick: () => void;
  isActive?: boolean;
}

const ChatListItem = ({
  nome,
  ultimaMensagem,
  timestamp,
  naoLidas = 0,
  isOnline = false,
  onClick,
  isActive = false,
}: ChatListItemProps) => {
  const { colorMode } = useColorMode();

  return (
    <Box
      p={4}
      cursor="pointer"
      borderRadius="lg"
      bg={
        isActive
          ? colorMode === 'dark'
            ? 'blue.700'
            : 'blue.50'
          : colorMode === 'dark'
          ? 'gray.700'
          : 'white'
      }
      _hover={{
        bg:
          isActive
            ? colorMode === 'dark'
              ? 'blue.600'
              : 'blue.100'
            : colorMode === 'dark'
            ? 'gray.600'
            : 'gray.50',
      }}
      transition="all 0.2s"
      onClick={onClick}
    >
      <HStack spacing={3} align="start">
        <Box position="relative">
          <Circle size="48px" bg="blue.500" color="white" fontWeight="bold" fontSize="lg">
            {nome[0].toUpperCase()}
          </Circle>
          {isOnline && (
            <Circle size="12px" bg="green.400" position="absolute" bottom="0" right="0" border="2px solid" borderColor={colorMode === 'dark' ? 'gray.700' : 'white'} />
          )}
        </Box>

        <VStack flex={1} align="stretch" spacing={1}>
          <HStack justify="space-between">
            <Text fontWeight="bold" fontSize="md" noOfLines={1}>
              {nome}
            </Text>
            {timestamp && (
              <Text fontSize="xs" color="gray.500">
                {timestamp}
              </Text>
            )}
          </HStack>

          <HStack justify="space-between">
            <Text fontSize="sm" color="gray.500" noOfLines={1} flex={1}>
              {ultimaMensagem || 'Nenhuma mensagem ainda'}
            </Text>
            {naoLidas > 0 && (
              <Badge colorScheme="blue" borderRadius="full" px={2}>
                {naoLidas}
              </Badge>
            )}
          </HStack>
        </VStack>
      </HStack>
    </Box>
  );
};

export default ChatListItem;
