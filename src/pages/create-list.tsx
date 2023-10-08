import Layout from "@/components/Layout";
import NavBar from "@/components/NavBar";
import { CreateTwitterList } from "@/components/CreateTwitterList";
import addData from '@/firebase/firestore/addData'
import { useState } from "react";

export default function CreateList() {
  return (
    <div>
      <NavBar />
      <div className='px-4 max-w-large flex items-center m-auto'>
        <CreateTwitterList />
      </div>
    </div>
  )
}
