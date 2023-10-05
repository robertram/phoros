// eslint-disable-next-line
// @ts-ignore
import { SeatsioSeatingChart } from '@seatsio/seatsio-react';

interface SeatsProps {
  workspaceKey: string
  eventName: string
  onObjectSelected: any
  onObjectDeselected: any
}

const Seats = ({ workspaceKey, eventName, onObjectSelected, onObjectDeselected }: SeatsProps) => {
  return (
    <div style={{ height: '500px' }}>
      <SeatsioSeatingChart
        workspaceKey={workspaceKey}
        event={eventName}
        region="sa"
        onObjectSelected={onObjectSelected}
        onObjectDeselected={onObjectDeselected}
        session="start"
      // pricing={[
      //   {
      //     category: 1,
      //     ticketTypes: [
      //       {
      //         ticketType: "adult",
      //         price: 30,
      //         label: "For adults",
      //         description: "Includes hot meal and a drink"
      //       },
      //       {
      //         ticketType: "child",
      //         price: 20,
      //         label: "For children",
      //         description: "Includes burger and fries"
      //       }
      //     ]
      //   },
      //   {
      //     category: 2,
      //     ticketTypes: [
      //       {
      //         ticketType: "adult",
      //         price: 40,
      //         label: "For adults",
      //         description: "Includes hot meal and a drink"
      //       },
      //       {
      //         ticketType: "child",
      //         price: 30,
      //         label: "For children",
      //         description: "Includes burger and fries"
      //       }
      //     ]
      //   },
      //   { category: 3, price: 50 }
      // ]}
      //priceFormatter={(price) => formatPrice(price)}
      />
    </div>
  )
}

export default Seats
