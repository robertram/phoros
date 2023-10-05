export default function SquaredCard() {
  return (
    <div className='w-[20vw] h-[20vw] relative'>
      <div className='w-full h-full bg-[url("/social.jpg")] absolute bg-center bg-cover' />
      <div className='w-full h-full absolute bg-[#000] opacity-60 hover:opacity-0 z-10 transition-opacity duration-300' />
      <div className='absolute w-full h-full'>
        <p className='bottom-0 absolute p-4'>F1</p>
      </div>
    </div>
  )
}
