import { Box, Text, useColorMode, useRadio, UseRadioProps } from '@chakra-ui/react';

interface UserTypeCardProps extends UseRadioProps {
  title: string;
  description: string;
}

const UserTypeCard = ({ title, description, ...props }: UserTypeCardProps) => {
  const { getInputProps, getRadioProps } = useRadio(props);
  const { colorMode } = useColorMode();

  const input = getInputProps();
  const checkbox = getRadioProps();

  return (
    <Box as="label" cursor="pointer">
      <input {...input} />
      <Box
        {...checkbox}
        borderWidth="2px"
        borderRadius="lg"
        p={5}
        _checked={{
          bg: colorMode === 'dark' ? 'brand.600' : 'brand.500',
          color: 'white',
          borderColor: colorMode === 'dark' ? 'brand.600' : 'brand.500',
        }}
        _hover={{
          borderColor: 'brand.500',
        }}
        transition="all 0.2s"
      >
        <Text fontWeight="bold" fontSize="lg" mb={2}>
          {title}
        </Text>
        <Text fontSize="sm" opacity={0.9}>
          {description}
        </Text>
      </Box>
    </Box>
  );
};

export default UserTypeCard;
