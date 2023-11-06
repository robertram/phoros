import Layout from "@/components/Layout";
import { CreateTwitterList } from "@/components/CreateTwitterList";
import ProhibitedPageAccess from "@/components/ProhibitedPageAccess";

export default function CreateList() {
  return (
    <Layout>
      <div className='px-4 max-w-large flex items-center m-auto w-full'>
        <ProhibitedPageAccess checkAuthorization checkLoggedIn>
          <CreateTwitterList />
        </ProhibitedPageAccess>
      </div>
    </Layout>
  )
}
