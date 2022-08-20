import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-flow: column;
  height: 100vh;
  align-items: center;
  background-color: #fff;
  border-radius: 14px;
`;
export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  background-color: #232e7d; //#10425d;
  height: 40px;
  color: #fff;
  font-size: 22px;
  font-weight: bold;
  text-align: center;
  width: 100%;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
`;
export const SubHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  /* padding: 8px; */
  height: 30px;
  color: #000;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  width: 100%;
`;
export const AreaQrCode = styled.div`
  display: flex;
  flex-grow: 1;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
`;
export const Column = styled.div`
  display: flex;
  flex-flow: column;
  align-items: center;
  flex-grow: 1;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;
export const ImgQrCode = styled.img`
  flex-grow: 1;
  max-height: 350px;
  max-width: 350px;
  aspect-ratio: inherit;
`;

export const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
  width: 100%;
  max-width: 400px;
`;
export const Form = styled.form`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
  width: 100%;
  max-width: 400px;
`;

export const LineInput = styled.div`
  display: flex;
  max-width: 60%;
`;
export const Input = styled.input`
  border-radius: 4px;
  border: 1px solid #ddd;
  font-size: 18px;
  max-width: 80%;
  margin-left: 8px;
`;
export const ButtonHeader = styled.button`
  border: 0;
  height: 30px;
  background-color: transparent;
`;
export const Button = styled.button`
  border-radius: 4px;
  border: 1px solid #ccc;
  margin: 0 16px;
  padding: 0 8px;
  font-size: 18px;
  font-weight: bold;
  height: 30px;
  min-width: max-content;
  background: #348ccb; //#0069d9;
  color: #fff;
`;
