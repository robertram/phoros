import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import { db, getDocuments } from '@/firebase/firestore/getData';
import { useRouter } from "next/router";
import { Profile } from "@/components/Profile";
import { query, collection, where } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";

export default function Index() {
  const { address } = useAuth()

  return (
    <Layout backButtonText="Home" backButtonLink="/">
      <Profile loggedIn={address ? true : false} />
    </Layout>
  )
}
