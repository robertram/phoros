import Button from "@/components/Button";
import Layout from "@/components/Layout";
import NavBar from "@/components/NavBar";

export default function Index() {

  return (
    <Layout>
      <NavBar />
      <div className='px-[16px] max-w-large flex items-center m-auto'>
        <div className="text-center w-full pt-[32px]">
          <h2 className="text-2xl font-bold">Lorem Ipsum</h2>
          <p className="text-base">Lorem Ipsum Lorem Ipsum</p>
          <Button className="">Join Phoros Now</Button>
        </div>
      </div>
    </Layout>
  )
}
