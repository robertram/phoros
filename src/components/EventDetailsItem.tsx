
import Clock from '@/icons/Clock';
import { ReactNode } from 'react';

interface EventDetailsItemProps {
  icon: ReactNode
  title: string
  description?: string
  schedule?: string
  duration?: string
  className?: any
}

const EventDetailsItem = ({ icon, title, schedule, duration, description, className }: EventDetailsItemProps) => {
  return (
    <div className={`flex md:max-w-[250px] ${className}`}>
      {icon}
      <div className="">
        <div className="text-xl">{title}</div>
        {description && <div className="mb-[3px]">{description}</div>}
        {schedule && <div className="mb-[3px]">{schedule}</div>}
        {duration && <div className="mb-[3px]">{duration}</div>}
      </div>
    </div>
  );
}
export default EventDetailsItem