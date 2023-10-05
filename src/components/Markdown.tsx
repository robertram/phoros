import styled from "styled-components"


interface MarkdownProps {
  text: string
}

export const Markdown = ({ text }: MarkdownProps) => {

  if (!text) return null

  return (
    <MarkdownContainer>
      <div dangerouslySetInnerHTML={{ __html: text }}></div>
    </MarkdownContainer>
  )
}

const MarkdownContainer = styled.div`
 text-align: left;
 a{
  color: #7339e6 !important;
  &:hover{
    text-decoration: underline;
  }
 }
 p{
  margin: 15px 0;
 }
 ol {
    padding: 10px 20px; 
    list-style-type: decimal;

}
`


