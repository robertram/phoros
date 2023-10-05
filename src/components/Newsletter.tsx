// eslint-disable-next-line
// @ts-ignore

import Link from 'next/link'
import { useState, ReactNode, useEffect } from 'react';
import addData from "@/firebase/firestore/addData";
import { uuid } from 'uuidv4';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (event: any) => {
    event.preventDefault();
    // Perform any necessary email processing or validation here
    console.log(email);
    handleForm(email)
  };

  const handleChange = (event: any) => {
    setEmail(event.target.value);
  };

  const handleForm = async (email: string) => {
    setLoading(true)
    const data = {
      email: email
    }
    const { result, error } = await addData('newsletterEmails', uuid(), data);

    console.log('result', result);

    if (error) {
      setLoading(false)
      return console.log(error)
    }
    setLoading(false)
    setSubscribed(true)
    return { result, loading }
  }

  return (
    <div>
      <section className=" h-screen md:h-[90vh] md:pt-[50px]">
        <div className="py-8 px-8 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
          <div className="mx-auto max-w-screen-md sm:text-center">
            <h2 className="mb-4 text-3xl tracking-tight font-extrabold text-gray-900 sm:text-4xl dark:text-white">Your Gateway to NFT Tickets, Personalized Experiences and Social Interaction—all in one platform, no blockchain knowledge required!</h2>
            <p className="mb-8 max-w-2xl font-light text-gray-500 md:mb-6 sm:text-xl dark:text-gray-400">Stay up to date with the roadmap progress and announcements. Feel free to sign up with your email.</p>
            <form onSubmit={handleSubmit}>
              <div className="items-center mx-auto mb-3 max-w-screen-sm sm:flex sm:space-y-0">
                <div className="relative w-full">
                  <label htmlFor="email" className="hidden mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Email address</label>
                  <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path></svg>
                  </div>
                  <input value={email} onChange={handleChange} className="block p-3 pl-10 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:rounded-none sm:rounded-l-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Enter your email" type="email" id="email" required />
                </div>
                <div>
                  {!subscribed &&
                    <button type="submit" className="py-3 px-5 w-full text-sm font-medium text-center text-white rounded-lg border cursor-pointer bg-primary-700 border-primary-600 sm:rounded-none sm:rounded-r-lg hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">{loading ? 'Loading' : 'Subscribe'}</button>
                  }

                 {subscribed && <button disabled type="button" className="py-3 px-5 w-full text-sm font-medium text-center text-white rounded-lg border cursor-auto bg-primary-700 border-primary-600 sm:rounded-none sm:rounded-r-lg hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">{subscribed ? 'Thank you for subscribing!' : ''}</button>}
                </div>
              </div>
              {/* <div className="mx-auto max-w-screen-sm text-sm text-left text-gray-500 newsletter-form-footer dark:text-gray-300">We care about the protection of your data. <a href="#" className="font-medium text-primary-600 dark:text-primary-500 hover:underline">Read our Privacy Policy</a>.</div>*/}
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Newsletter
