interface MessageProps {
  text: string
}

export const Message = ({ text }: MessageProps) => {
  return <li>{text}</li>
}
