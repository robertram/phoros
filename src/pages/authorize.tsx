import Layout from "@/components/Layout";
import { Loading } from "@/components/Loading";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/firebase/firestore/getData';
import { useRouter } from 'next/router'

interface AuthTwitterProps {
  oauth_callback_confirmed: string
  oauth_token: string
  oauth_token_secret: string
  url: string
  oauth_pin: string
}

export default function Authorize() {
  const router = useRouter()
  const { address } = useAuth()
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [authTwitter, setAuthTwitter] = useState<AuthTwitterProps>({
    oauth_callback_confirmed: "",
    oauth_token: "",
    oauth_token_secret: "",
    url: "",
    oauth_pin: ""
  })

  const getAuthLink = async () => {
    setLoading(true)
    await fetch('/api/twitter/auth',
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
    if (authTwitter.oauth_callback_confirmed && authTwitter.oauth_pin && authTwitter.oauth_token && authTwitter.oauth_token_secret && authTwitter.url) {
      setLoading(true)
      const usersRef = doc(db, 'users', address ?? '')
      try {
        await setDoc(usersRef, { ...authTwitter }, { merge: true })
        router.push('/create-list')
      } catch (err) {
        console.error('You dont have permission')
      }
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className='px-[16px] max-w-large flex items-center m-auto'>
        <div>
          <div className="mb-[20px]">
            <h2 className="text-3xl font-bold">Authorize your twitter account</h2>
            <p className="text-base">Authorize and copy the pin from the twitter window</p>
          </div>

          <a
            href={authTwitter.url ?? ''}
            target="_blank"
            className='bg-blue-500 text-white font-semibold px-4 py-2 rounded-md mt-4 my-[20px]'
          >
            Verify with X (twitter)
          </a>

          <div className='mb-[20px] mt-[20px]'>
            <label htmlFor='oauth_pin'>Paste the twitter pin here</label>
            <input
              type='text'
              id='oauth_pin'
              className='border border-gray-300 rounded-md p-2 w-full text-black'
              placeholder='Enter the Twitter pin'
              value={authTwitter.oauth_pin}
              onChange={(event) =>
                setAuthTwitter({ ...authTwitter, oauth_pin: event.target.value })
              }
            />
          </div>

          <button
            disabled={loading}
            onClick={updateUserInfo}
            className='bg-blue-500 text-white font-semibold px-4 py-2 rounded-md'
          >
            {loading ? <Loading /> : 'Submit'}
          </button>
        </div>
      </div>
    </Layout>
  )
}