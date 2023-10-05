import { AiOutlineSearch, AiOutlineRead } from 'react-icons/ai';

export const SearchHero = () => {
  return (
    <div className='h-[300px] md:h-[500px] m-auto items-center flex'>
      <div className='w-full m-auto'>
        <h1 className='text-4xl md:text-8xl font-bold text-white'>
          Search Events
        </h1>
        <h1 className='text-4xl md:text-8xl  font-bold text-white'>
          Near You
        </h1>
        {/* <div className='search-bar mt-[40px] flex flex-col md:flex-row'>
          <div className='flex mr-[10px] mb-[20px] md:mb-0'>
            <label htmlFor="gsearch" className='my-auto mr-2'><AiOutlineSearch /></label>
            <input type="search" id="gsearch" name="gsearch" placeholder='Search Event' className='p-2 rounded-xl' />
          </div>
          <div className='flex'>
            <label htmlFor="category" className='my-auto mr-2'><AiOutlineRead /></label>
            <select name="category" id="category" placeholder='Category' className='p-2 rounded-xl bg-white text-black w-[200px]'>
              <option value="Music">Music</option>
              <option value="Crypto">Crypto</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div> */}
      </div>
    </div>
  )
}
