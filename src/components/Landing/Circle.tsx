import { useEffect } from 'react';
import styled, { css } from 'styled-components'

interface Props {
  type: string
}

export default function Circle({ type }: Props) {
  return (
    <CircleContainer>
      <div className={`circle ${type}`}></div>
    </CircleContainer>
  )
}

const CircleContainer = styled.div`
  height: 100%; 

  //Desktop Animations
  @keyframes primaryAnimation {
    0%   {top:400px; left:0px;}
    50%  {top:400px; left:150px;}
    100% {top:400px; left:0px;}
  }

  @keyframes secondaryAnimation {
    0%   {right:0; top:0px;}
    50%  {right:0; top:150px;}
    100% {right:0; top:0px;}
  }

  @keyframes terciaryAnimation {
    0%   {top:300px; right:400;}
    25%  {top:600px; right:200;}
    50%  {top:600px; right:0;}
    75%  {top:600px; right:0;}
    100% {top:300px; right:400;} 
  }

  .circle{
    position: absolute;
    height: 10rem;
    width: 10rem;
    right: 22rem;
    top: 6rem;
    filter: blur(70px);
    position: absolute;
    border-radius: 9999px;
  }

  .primary{
    height: 10rem;
    width: 10rem;
    background-color: rgb(255 239 0 / 1);
    animation: primaryAnimation 6s ease-in-out infinite;
    -webkit-animation: primaryAnimation 6s ease-in-out infinite;
  }

  .secondary{
    height: 15rem;
    width: 20rem;
    background-color: rgb(20 211 285 / 1);
    animation: secondaryAnimation 8s ease-in-out infinite;
    -webkit-animation: secondaryAnimation 8s ease-in-out infinite;
  }

  .terciary{
    height: 10rem;
    width: 10rem;
    background-color: rgb(245 118 101 / 1);
    animation: terciaryAnimation 12s ease-in-out infinite;
    -webkit-animation: terciaryAnimation 12s ease-in-out infinite;
  }

`