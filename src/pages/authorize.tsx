import Layout from "@/components/Layout";
import { Loading } from "@/components/Loading";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/firebase/firestore/getData';
import { useRouter } from 'next/router'

interface AuthTwitterProps {
  url: string
  codeVerifier: string
  state: string
}

export default function Authorize() {
  const router = useRouter()
  const { address } = useAuth()
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [authTwitter, setAuthTwitter] = useState<AuthTwitterProps>({
    url: "",
    codeVerifier: "",
    state: ""
  })
  const [authorizationSuccess, setAuthorizationSuccess] = useState(false);

  const getAuthLink = async () => {
    setLoading(true)
    await fetch('/api/twitter/auth-v2',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json()
      })
      .then(response => {
        console.log('getAuthLink response', response);
        setAuthTwitter(response)
        setLoading(false)

        return response
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false)
      });
    setLoading(false)
  }

  useEffect(() => {
    const getAuthLinkTwitter = async () => {
      await getAuthLink()
    }
    getAuthLinkTwitter()
  }, [])

  const getUserAccessToken = async () => {
    setLoading(true)
    console.log('authTwitter', authTwitter);
    await fetch('/api/twitter/auth-callback',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code: router.query.code, address: address })
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json()
      })
      .then(response => {
        console.log('access token res', response);
        setAuthorizationSuccess(true)
        setLoading(false)
        return response
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false)
      });
    setLoading(false)
  }

  useEffect(() => {
    const getAccessToken = async () => {
      await getUserAccessToken()
    }
    if (router.query.code != undefined) {
      getAccessToken()
    }
  }, [router.query])

  useEffect(() => {
    if (authorizationSuccess) {
      router.push('create-list')
    }
  }, [authorizationSuccess])

  return (
    <Layout>
      <div className='px-[16px] max-w-large flex items-center m-auto'>
        {!authorizationSuccess ?
          <Loading />
          :
          <div>
            <h1 className="text-2xl">Authorized!</h1>
            <p className="text-bae">Redirecting...</p>
          </div>
        }
      </div>
    </Layout>
  )
}