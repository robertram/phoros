// eslint-disable-next-line
// @ts-ignore

import { useState } from 'react';

const MailchimpNewsletter = () => {
  const [state, setState] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  // 0 - initial , 1 - loading, 2 - success, 2 - error

  //
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (event: any) => {
    event.preventDefault();
    // Perform any necessary email processing or validation here
    console.log(email);
    subscribe(event)
  };

  const handleChange = (event: any) => {
    setEmail(event.target.value);
  };

  const subscribe = async (e: any) => {
    e.preventDefault();
    setLoading(true)

    setState(1);
    setErrorMsg("");
    console.log(e.target[0].value);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        body: e.target[0].value,
      });

      const data = await res.json();
      if (data.error !== null) {
        throw data.error;
      }
      setLoading(false)
      setState(2);
    } catch (e: any) {
      setErrorMsg(e);
      setState(3);
      setLoading(false)
    }
  };
  
  const gradient="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"

  return (
    <form onSubmit={handleSubmit}>
      <div className="items-center mx-auto mb-3 max-w-screen-sm sm:flex sm:space-y-0 flex flex-col md:flex-row justify-center m-auto ">
        <div className="relative w-full max-w-xs">
          <label htmlFor="email" className="hidden mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Email address</label>
          <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
            <svg className="w-5 h-5 text-gray-500 " fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path></svg>
          </div>
          <input
            value={email}
            onChange={handleChange}
            className="block p-3 pl-10 w-full text-sm text-gray-900 !bg-transparent  rounded-lg border border-gray-300 sm:rounded-none sm:rounded-l-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            placeholder="Enter your email"
            type="email"
            id="email"
            required
          />
        </div>
        <div className='md:ml-[20px] md:mt-0 mt-[20px] '>
          {state != 2 &&
            <button type="submit" className={`py-3 px-5 w-full text-sm font-medium text-center text-white rounded-lg cursor-pointer sm:rounded-none sm:rounded-r-lg hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 hover:scale-110 transition ease-in-out delay-1000 ${gradient}`}>{loading ? 'Loading' : 'Join the waitlist'}</button>
          }
          {state == 2 && <button disabled type="button" className="py-3 px-5 w-full text-sm font-medium text-center text-white rounded-lg border cursor-auto bg-primary-700 border-primary-600 sm:rounded-none sm:rounded-r-lg hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Thanks for subscribing!</button>}
        </div>

        {state === 3 ? (
          <p className="text-red-500 mt-3">{errorMsg}</p>
        ) : (
          ""
        )}
      </div>
      {/* <div className="mx-auto max-w-screen-sm text-sm text-left text-gray-500 newsletter-form-footer dark:text-gray-300">We care about the protection of your data. <a href="#" className="font-medium text-primary-600 dark:text-primary-500 hover:underline">Read our Privacy Policy</a>.</div>*/}
    </form>
  )
}

export default MailchimpNewsletter
