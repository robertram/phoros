import * as React from "react"
const Rocket = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={17}
    height={17}
    fill="none"
    {...props}
  >
    <path
      stroke="#525252"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M8.75 11.25 6.5 9m2.25 2.25a16.761 16.761 0 0 0 3-1.5m-3 1.5V15s2.273-.413 3-1.5c.81-1.215 0-3.75 0-3.75M6.5 9A16.5 16.5 0 0 1 8 6.037 9.66 9.66 0 0 1 16.25 1.5c0 2.04-.585 5.625-4.5 8.25M6.5 9H2.75s.413-2.273 1.5-3C5.465 5.19 8 6 8 6m-4.875 6.375c-1.125.945-1.5 3.75-1.5 3.75s2.805-.375 3.75-1.5c.532-.63.525-1.598-.067-2.183a1.635 1.635 0 0 0-2.183-.067Z"
    />
  </svg>
)
export default Rocket
