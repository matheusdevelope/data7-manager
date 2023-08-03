
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, Button, ModalCloseButton } from "@chakra-ui/react";

type ModalDialogProps = {
    opened:boolean;
  title: string;
  content: string;
  onActionOne: () => void;
  ActionOneLabel:string;
  onClose: () => void;
}

export default function ModalDialog({opened,  title, content, onActionOne,ActionOneLabel, onClose}: ModalDialogProps) {
  const handleActionOne = () => {
    onActionOne();
    onClose && onClose();
  }

  const handleClose = () => {
    onClose && onClose();
  }

  return (
    
    <Modal isOpen={opened} onClose={handleClose}>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>{title}</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
       {content}
      </ModalBody>

      <ModalFooter>
        <Button colorScheme='blue' mr={3} onClick={handleClose}>
          Close
        </Button>
        <Button variant='ghost' onClick={handleActionOne} >{ActionOneLabel}</Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
    
  );
}
