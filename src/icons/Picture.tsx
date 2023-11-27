import * as React from "react"
const Picture = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={31}
    height={29}
    fill="none"
    {...props}
  >
    <path
      stroke="#525252"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2.5}
      d="M28.833 14.334v4.133c0 2.987 0 4.48-.582 5.621a5.333 5.333 0 0 1-2.33 2.331C24.78 27 23.286 27 20.299 27h-9.6c-2.987 0-4.48 0-5.62-.581a5.333 5.333 0 0 1-2.332-2.33c-.581-1.142-.581-2.635-.581-5.622v-6.933c0-2.987 0-4.48.581-5.622a5.333 5.333 0 0 1 2.331-2.33C6.218 3 7.712 3 10.7 3h5.467m8.667 6.667v-8m-4 4h8m-8 9.333a5.333 5.333 0 1 1-10.667 0 5.333 5.333 0 0 1 10.667 0Z"
    />
  </svg>
)
export default Picture
