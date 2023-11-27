import { EditList } from "@/components/EditList";
import Layout from "@/components/Layout";
import { useRouter } from "next/router";

export default function Index() {
  const router = useRouter();
  const listId = Array.isArray(router.query.listId) ? router.query.listId[1] : router.query.listId;

  return (
    <Layout backButtonText="Back" backButtonLink={`/list/${listId}`}>
      <EditList listId={listId ?? ''} />
    </Layout>
  )
}