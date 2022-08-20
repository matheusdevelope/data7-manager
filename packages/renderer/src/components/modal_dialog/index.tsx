import { useEffect, useRef } from 'react';
import { AreaMessage, Button, Container, LineButtons, Message, Text, Title } from './style';
export const DefaultDialog: IDialog = {
  isOpen: false,
  title: 'Atenção',
  message: '',
  onClickOK: () => null,
  onClickCancel: undefined,
};

export default function Dialog({
  isOpen,
  title,
  message,
  onClickOK,
  onClickCancel,
  textbuttonOK,
  textbuttonCancel,
}: IDialog) {
  const ButtonRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    isOpen && ButtonRef.current?.focus();
  }, [isOpen]);
  return (
    <Container style={{ display: isOpen ? 'flex' : 'none' }}>
      <AreaMessage>
        <Message>
          <Title>{title || ''}</Title>
          <Text>{message} </Text>
        </Message>
        <LineButtons>
          <Button ref={!onClickCancel ? ButtonRef : null} onClick={onClickOK}>
            {textbuttonOK ? textbuttonOK : 'OK'}
          </Button>
          {onClickCancel && (
            <Button ref={ButtonRef} onClick={onClickCancel}>
              {textbuttonCancel ? textbuttonCancel : 'Cancelar'}
            </Button>
          )}
        </LineButtons>
      </AreaMessage>
    </Container>
  );
}
