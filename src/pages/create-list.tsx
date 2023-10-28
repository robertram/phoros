import Layout from "@/components/Layout";
import { CreateTwitterList } from "@/components/CreateTwitterList";

export default function CreateList() {
  return (
    <Layout>
      <div className='px-4 max-w-large flex items-center m-auto w-full'>
        <CreateTwitterList />
      </div>
    </Layout>
  )
}
