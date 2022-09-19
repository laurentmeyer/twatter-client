import React, { ReactNode } from 'react'
import styled from 'styled-components'
import SvgIcon from './svgIcon'

export const ModalWrapper = styled.div`
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  padding-top: 4vh;
  background: rgba(0, 0, 0, 0.4);
`

export const ModalContent = styled.div`
  position: relative;
  margin: auto;
  width: 40%;
  background: white;
  border-radius: 15px;
  @media (max-width: 768px) {
    width: 80%;
  }
`

export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 13px 8px;
  border-bottom: 1px solid rgb(230, 236, 240);
  h2 {
    color: ${(props) => props.color};
    margin-bottom: 0;
    font-size: 19px;
    font-weight: 800;
  }
`

export const CloseButton = styled.button`
  display: inline-flex;
  color: rgb(29, 161, 242);
  background-color: transparent;
  font-size: 33px;
  outline: none;
  border: none;
  padding: 5px;
  border-radius: 50%;
  cursor: pointer;
  margin-right: 10px;
  &:hover {
    background-color: rgba(29, 161, 242, 0.1);
  }
`
export const Button = styled.button`
  background-color: rgb(29, 161, 242);
  color: rgb(255, 255, 255);
  border-radius: 50px;
  border: none;
  outline: none;
  font-size: 15px;
  font-weight: bold;
  text-align: center;
  padding: 8px 15px;
  cursor: pointer;
  &:hover {
    background-color: rgb(26, 145, 218);
  }
  &:disabled {
    opacity: 0.5;
  }
`

export const ModalBody = styled.div`
  padding: 15px;
  overflow-y: auto;
  max-height: 80vh;
`

export const Flex = styled.div`
  display: flex;
  div {
    margin-right: 8px;
  }
  textarea {
    background: white;
    caret-color: black;
    width: 100%;
    outline: none;
    border: none;
    resize: none;
    font-size: 16px;
    font-weight: 500;
    color: ${(props) => props.color};
  }
`

interface ModalProps {
  handleClose: () => void
  children?: ReactNode
}

const closeButtonPath = [
  'M13.414 12l5.793-5.793c.39-.39.39-1.023 0-1.414s-1.023-.39-1.414 0L12 10.586 6.207 4.793c-.39-.39-1.023-.39-1.414 0s-.39 1.023 0 1.414L10.586 12l-5.793 5.793c-.39.39-.39 1.023 0 1.414.195.195.45.293.707.293s.512-.098.707-.293L12 13.414l5.793 5.793c.195.195.45.293.707.293s.512-.098.707-.293c.39-.39.39-1.023 0-1.414L13.414 12z',
]

export const Modal = ({ children, handleClose }: ModalProps) => {
  return (
    <ModalWrapper>
      <ModalContent>
        <ModalHeader>
          <CloseButton onClick={handleClose}>
            <SvgIcon
              paths={closeButtonPath}
              width="22.5px"
              height="22.5px"
              fill="rgb(29, 161, 242)"
            />
          </CloseButton>
        </ModalHeader>
        <ModalBody>{children}</ModalBody>
      </ModalContent>
    </ModalWrapper>
  )
}
