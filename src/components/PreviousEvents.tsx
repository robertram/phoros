import SquaredCard from './SquaredCard'

const TOTAL_IMAGES = 20

export default function PreviousEvents() {
  return (
    <div>
      <h2 className='m-6 font-bold text-2xl'>Previous Events</h2>
      <div className='grid-cols-5 grid overflow-x-hidden'>
        {new Array(TOTAL_IMAGES).fill(0).map((_, index) => (
          <SquaredCard key={index} />
        ))}
      </div>
    </div>
  )
}
