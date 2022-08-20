import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-flow: column;
  height: 100vh;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  border-radius: 16px;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  height: 50px;
  width: 100%;
  max-width: 400px;
`;
export const Text = styled.p`
  font-size: 18px;
  font-weight: bold;
  margin: 8px;
`;
export const Input = styled.input`
  border-radius: 4px;
  border: 1px solid #ddd;
  font-size: 18px;
  margin: 8px;
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
