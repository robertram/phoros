import * as React from "react"
const Redirect = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={16}
    fill="none"
    {...props}
  >
    <path
      stroke="#A3A3A3"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M14.75 5.75v-4.5m0 0h-4.5m4.5 0-6 6M6.5 2.75H4.85c-1.26 0-1.89 0-2.371.245a2.25 2.25 0 0 0-.984.984c-.245.48-.245 1.11-.245 2.371v4.8c0 1.26 0 1.89.245 2.371.216.424.56.768.984.984.48.245 1.11.245 2.371.245h4.8c1.26 0 1.89 0 2.371-.245.424-.216.768-.56.984-.984.245-.48.245-1.11.245-2.371V9.5"
    />
  </svg>
)
export default Redirect
