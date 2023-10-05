import { useEffect, useState } from 'react'

const CANTIDAD_DE_ANUNCIOS = 3

export default function Hero() {
  const [actualEvent, setActualEvent] = useState<number>(0)
  useEffect(() => {
    const intervalId = setInterval(() => {
      setActualEvent((prev) => (prev + 1) % CANTIDAD_DE_ANUNCIOS)
    }, 6000)
    return () => clearInterval(intervalId)
  }, [actualEvent])
  return (
    <>
      <div className='min-h-[80vh] flex justify-center relative mb-24 z-10'>

{/* <div className={`bg-[url("/image1.jpg")] rounded-lg bg-no-repeat bg-cover w-[90%] bg-center h-[80vh] transition-opacity duration-700 absolute ${actualEvent === 0 ? 'opacity-100' : 'opacity-0'}`}>
  
</div> */}

        <div
          className={`bg-[url("/image1.jpg")] bg-no-repeat bg-cover w-full bg-center h-[80vh] transition-opacity duration-700 absolute ${
            actualEvent === 0 ? 'opacity-100' : 'opacity-0'
          }`}
        />
        <div
          className={`bg-[url("/image2.jpg")] bg-no-repeat bg-cover w-full bg-center h-[80vh] transition-opacity duration-700 absolute ${
            actualEvent === 1 ? 'opacity-100' : 'opacity-0'
          }`}
        />
        <div
          className={`bg-[url("/image3.jpg")] bg-no-repeat bg-cover w-full bg-center h-[80vh] transition-opacity duration-700 absolute ${
            actualEvent === 2 ? 'opacity-100' : 'opacity-0'
          }`}
        />
        <p
          className='absolute left-9 top-[50%] text-[48px] cursor-pointer'
          onClick={() =>
            setActualEvent(
              (prev) => (prev + CANTIDAD_DE_ANUNCIOS - 1) % CANTIDAD_DE_ANUNCIOS
            )}
        >
          {'<'}
        </p>
        <p
          className='absolute right-9 top-[50%] text-[48px] cursor-pointer'
          onClick={() =>
            setActualEvent((prev) => (prev + 1) % CANTIDAD_DE_ANUNCIOS)}
        >
          {'>'}
        </p>
      </div>
    </>
  )
}
