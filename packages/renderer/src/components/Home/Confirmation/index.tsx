import React from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
interface Labels {
  title?: string;
  message?: string;
  buttonLeft?: string;
  buttonRight?: string;
}
interface IAuthenticationModal {
  isOpen: boolean;
  onClose: () => void;
  onClickLeft?: () => void;
  onClickRight?: () => void;
  labels?: Labels;
}
export default function ConfirmationModal({
  isOpen,
  onClose,
  onClickLeft,
  onClickRight,
  labels,
}: IAuthenticationModal) {
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  function OnSubmit(e: React.FormEvent) {
    e.preventDefault();
    onClickRight && onClickRight();
    onClose();
  }

  return (
    <>
      <Modal
        initialFocusRef={buttonRef}
        isOpen={isOpen}
        onClose={onClose}
        size="sm"
        isCentered
      >
        <ModalOverlay />
        <ModalContent color={"white"}>
          <ModalHeader color={"white"}>
            {labels && labels.title ? labels.title : "Atenção!"}
          </ModalHeader>

          {labels && labels.message && <ModalBody>{labels.message}</ModalBody>}

          <ModalFooter>
            {labels && labels.buttonLeft && (
              <Button
                size={"sm"}
                mr={3}
                onClick={() => {
                  onClickLeft && onClickLeft();
                  onClose();
                }}
              >
                {labels.buttonLeft}
              </Button>
            )}

            <Button ref={buttonRef} size={"sm"} mr={3} onClick={OnSubmit}>
              {labels && labels.buttonRight ? labels.buttonRight : "Ok"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
