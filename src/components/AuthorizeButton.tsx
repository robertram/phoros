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

export const AuthorizeButton = () => {
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

  const updateUserInfo = async () => {
    console.log('authTwitter', authTwitter);
    if (authTwitter.url && authTwitter.codeVerifier && authTwitter.state) {
      setLoading(true)
      const usersRef = doc(db, 'users', address ?? '')

      try {
        await setDoc(usersRef, { ...authTwitter, code: router.query.code }, { merge: true })
        router.push('/create-list')
      } catch (err) {
        console.error('You dont have permission')
      }
      setLoading(false)
    }
  }

  return (
    <div>
      {address ?
        <div>
          {/* <div className="mb-[20px]">
              <h2 className="text-3xl font-bold">Authorize your twitter account</h2>
              <p className="text-base">Authorize and copy the pin from the twitter window</p>
            </div> */}
          <a
            href={authTwitter.url ?? ''}
            className='bg-blue-500 text-white font-semibold px-4 py-2 rounded-md mt-4 my-[20px] cursor-pointer'
          >
            Verify with X (twitter)
          </a>
        </div>
        : <w3m-button size='md' label='Log In' />
      }
    </div>
  )
}