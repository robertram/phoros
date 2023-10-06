import React, { useState } from 'react';
import axios from 'axios';
import OAuth from 'oauth-1.0a';

const CreateList = () => {
  // Twitter API credentials
  const twitterApiCredentials = {
    consumerKey: 'YOUR_CONSUMER_KEY',
    consumerSecret: 'YOUR_CONSUMER_SECRET',
    token: 'YOUR_ACCESS_TOKEN',
    tokenSecret: 'YOUR_ACCESS_TOKEN_SECRET',
  };

  // OAuth 1.0a configuration
  const oauth = new OAuth({
    consumer: {
      key: twitterApiCredentials.consumerKey,
      secret: twitterApiCredentials.consumerSecret,
    },
    signature_method: 'HMAC-SHA1',
    hash_function(base_string, key) {
      return require('crypto')
        .createHmac('sha1', key)
        .update(base_string)
        .digest('base64');
    },
  });

  // OAuth 1.0a token
  const token = {
    key: twitterApiCredentials.token,
    secret: twitterApiCredentials.tokenSecret,
  };

  // State for response and error messages
  const [responseMessage, setResponseMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  // POST data
  const postData = {
    name: 'YourListName',
    description: 'YourListDescription',
    mode: 'private', // Change to 'public' or 'private' as needed
  };

  // Twitter API endpoint
  const apiUrl = 'https://api.twitter.com/2/lists';

  // Function to create a Twitter list
  const createTwitterList = () => {
    // Generate the OAuth 1.0a headers
    const requestData = {
      url: apiUrl,
      method: 'POST',
      data: postData,
    };
    const headers = oauth.toHeader(oauth.authorize(requestData, token));

    // Make the POST request using Axios
    axios({
      method: 'post',
      url: apiUrl,
      data: postData,
      headers: {
        ...headers,
      },
    })
      .then((response) => {
        setResponseMessage('List created successfully: ' + JSON.stringify(response.data));
        setErrorMessage('');
      })
      .catch((error) => {
        setErrorMessage('Error creating list: ' + error.message);
        setResponseMessage('');
      });
  };

  return (
    <div>
      {/* <h1>Create a Twitter List</h1> */}
      <button onClick={createTwitterList}>Create List</button>
      {responseMessage && <p>{responseMessage}</p>}
      {errorMessage && <p>{errorMessage}</p>}
    </div>
  );
};

export default CreateList;
