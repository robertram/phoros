import { Blocks } from '@/components/blocks';
import Header from '@/components/Header';
import Circle from '@/components/Landing/Circle';
import Hero from '@/components/Landing/Hero';
import Newsletter from '@/components/Newsletter';
import TextButtonSection from '@/components/TextButtonSection';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import styled from 'styled-components'

import useContentful from '../hooks/useContentful'

export default function Landing() {
  const [blocks, setBlocks] = useState<any>([]);
  const { getEntries } = useContentful();

  useEffect(() => {
    getEntries('homepage').then((response) => { response && setBlocks(response[0].blocks) });
  }, []);

  return (
    <LandingContainer>
      <div className="Body absolute z-20 w-full">
        <Header />
        <Blocks blocks={blocks} />
      </div>

      <div className="absolute z-10 left-0 top-0 w-full h-screen overflow-hidden md:block hidden">
        <Circle type="primary" />
        <Circle type="secondary" />
        <Circle type="terciary" />
      </div>
    </LandingContainer>
  )
}

const LandingContainer = styled.div`
  .Body{
    background-color: rgba(0, 0, 0, 0.6);
    margin: 0 auto;
    backdrop-filter: blur(10px);
    border: 2px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 0 40px rgba(8, 7, 16, 0.6);
    //padding: 0 35px;
    font-family: "Poppins", sans-serif;
    color: #ffffff;
    letter-spacing: 0.5px;
    outline: none;
    border: none;
    width: 100%;
    display: flex;
    flex-direction: column;
    //height: 100vh;
  }

`