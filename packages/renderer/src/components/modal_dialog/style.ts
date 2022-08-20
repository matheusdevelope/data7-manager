import styled from 'styled-components';

export const Container = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  background-color: rgba(0, 0, 0, 0.1);
`;
export const AreaMessage = styled.div`
  margin: auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  min-height: 100px;
  max-height: 200px;
  min-width: 320px;
  max-width: 370px;
  background-color: #fff;
  border-radius: 8px;
  border: 1px solid rgba(35, 46, 125, 0.5);
`;
export const LineButtons = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-end;
  align-items: flex-end;
  margin: 8px;
`;
export const Message = styled.div`
  height: 100%;
  width: 100%;
  padding: 8px;
  overflow-y: auto;
`;
export const Title = styled.p`
  font-weight: bold;
  font-size: 16px;
  text-align: center;
  margin-bottom: 8px;
`;
export const Text = styled.p`
  font-size: 16px;
`;
export const Button = styled.button`
  border-radius: 5px;
  border: 1px solid #ccc;
  margin: 0 8px;
  padding: 0 8px;
  font-size: 14px;
  font-weight: bold;
  height: 20px;
  width: 80px;
  background: #fff;
  color: #000;
`;
