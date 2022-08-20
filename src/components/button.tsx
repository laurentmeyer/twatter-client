import styled from 'styled-components'

interface Props {
  width: string
  height?: string
  padding: string
}

export const Button = styled.button<Props>`
  width: ${(props) => props.width};
  ${(props) => props.height && `height: ${props.height}`};
  background: rgba(29, 161, 242, 1);
  border: none;
  border-radius: 50px;
  outline: none;
  font-size: 15px;
  font-weight: bold;
  color: rgb(255, 255, 255);
  text-align: center;
  cursor: pointer;
  padding: ${(props) => props.padding};
  &:hover {
    background: rgb(26, 145, 218);
  }
`
