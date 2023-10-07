import Link from "next/link";
import Button from "./Button";
//import { Login } from "./Login";

interface ProhibitedPageAccessProps {
  text?: string
}

export default function ProhibitedPageAccess({ text }: ProhibitedPageAccessProps) {
  return (
    <div className="w-full mt-[100px]">
      <div className="text-center">
        <h1 className="text-2xl">{text ? text : 'You need to be logged in to access this page'}</h1>
      </div>

      <div className="m-auto flex">
        {/* <Login className="!w-[300px] m-auto" /> */}
      </div>
    </div>
  )
}
