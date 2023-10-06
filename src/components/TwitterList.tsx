import React, { useState } from 'react';
import { Toggle } from './Toggle';

interface EventType {
  name: string
  description: string
  isPrivate: boolean
}

function TwitterList() {
  const [error, setError] = useState(null);
  const [listCreated, setListCreated] = useState(false);
  const [createdListInformation, setCreatedListInformation] = useState<any>({});
  const [listData, setListData] = useState<EventType>({
    name: '',
    description: '',
    isPrivate: false
  })

  const createList = async (event: any) => {
    event.preventDefault()
    const response = await fetch('/api/twitter/create-list',
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(listData)
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json()
      })
      .then(response => {
        setCreatedListInformation(response);
        setListCreated(true)
      })
      .catch((err) => {
        setError(err.message);
        setListCreated(false)
      });
  }

  return (
    <div>
      <h1 className='text-3xl'>Create List</h1>

      {listCreated && <div>
        <p className='text-green-400'>List Created</p>
        <p>Id: <a
          className='underline'
          target="_blank"
          href={`https://twitter.com/i/lists/${createdListInformation?.data?.id}`}
        >{createdListInformation?.data?.name}</a></p>
      </div>}

      {error && <p className='text-red-500'>{error}</p>}

      <form>
        <div className='mb-[20px]'>
          <label htmlFor='name'>List Name</label>
          <input
            type='text'
            id='name'
            className='border border-gray-300 rounded-md p-2 w-full text-black'
            placeholder='Enter the List Name'
            value={listData.name}
            onChange={(event) =>
              setListData({ ...listData, name: event.target.value })
            }
          />
        </div>
        <div className='mb-[20px]'>
          <label htmlFor='name'>List Description</label>
          <input
            type='text'
            id='description'
            className='border border-gray-300 rounded-md p-2 w-full text-black'
            placeholder='Enter the List Description'
            value={listData.description}
            onChange={(event) =>
              setListData({ ...listData, description: event.target.value })
            }
          />
        </div>

        <div className='mb-[20px] flex flex-col'>
          <div className='flex justify-between'>
            <div>
              <p className='text-2xl'>Is Private?</p>
              {/* <p className='text-body'>The users can resell their event tickets</p> */}
            </div>
            <div className='my-auto'>
              <Toggle
                name='isPending'
                checked={listData.isPrivate}
                onChange={(event) => {
                  setListData({ ...listData, isPrivate: event.target.checked })
                }}
              />
            </div>
          </div>
        </div>
        <button
          onClick={createList}
          className='bg-blue-500 text-white font-semibold px-4 py-2 rounded-md mt-4 ml-[20px]'
        >
          Create List
        </button>
      </form>
    </div>
  );
}

export default TwitterList;
