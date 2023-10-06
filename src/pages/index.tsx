import CreateList from "@/components/CreateList";
import Layout from "@/components/Layout";
import NavBar from "@/components/NavBar";
import TwitterList from "@/components/TwitterList";
import axios from "axios";

export default function Index() {

  return (
    <Layout>
      <NavBar />
      <div className='px-[20px] max-w-large flex items-center m-auto'>
        <TwitterList />
      </div>
    </Layout>
  )
}
