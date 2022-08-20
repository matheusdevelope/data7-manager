import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-flow: column;
  height: 100vh;
  justify-content: space-between;
  background-color: #fff;
  border-radius: 16px;
`;
export const Header = styled.div`
  font-weight: bold;
  font-size: 18px;
  display: flex;
  height: 40px;
  align-items: center;
  justify-content: center;
  border-bottom: 2px solid #202124;
`;

export const Center = styled.div`
  display: flex;
  flex-grow: 1;
  align-items: center;
  justify-content: center;
  background-color: #fff;
`;

export const Footer = styled.div`
  display: flex;
  height: 40px;
  align-items: center;
  justify-content: center;
`;
export const ContainerObj = styled.div`
  display: flex;
  height: 40px;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #ddd;
  padding: 0 8px;
`;

export const Form = styled.div`
  height: 100%;
  width: 100%;
`;
export const Text = styled.p`
  font-size: 18px;
  font-weight: bold;
  margin: 8px;
`;
export const Label = styled.p`
  font-size: 16px;
`;
export const Input = styled.input`
  border-radius: 4px;
  border: 1px solid #ddd;
  font-size: 18px;
`;
export const Button = styled.button`
  border-radius: 4px;
  border: 1px solid #ddd;
  margin: 8px;
  padding: 0 8px;
  font-size: 18px;
  font-weight: bold;
  height: 30px;
  background: #348ccb; //#0069d9;
  color: #fff;
`;
