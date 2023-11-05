import Layout from "@/components/Layout";
import { Loading } from "@/components/Loading";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from 'next/router'

export default function Authorize() {
  const router = useRouter()
  const { address } = useAuth()
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [authorizationSuccess, setAuthorizationSuccess] = useState(false);

  const getUserAccessToken = async () => {
    setLoading(true)
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
      setTimeout(() => {
        router.push('create-list')
      }, 2000);
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