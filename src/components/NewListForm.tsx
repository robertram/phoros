import storage from "../firebase/firebaseConfig"
import { ref, uploadBytesResumable, getDownloadURL, uploadBytes } from "firebase/storage";
import { uuid } from 'uuidv4';
import { Toggle } from "./Toggle";
import { Loading } from "./Loading";

interface NewListFormProps {
  listData: any
  setListData: (listData: any) => void
  error: any
  onSubmit: (event: any) => Promise<void>
  loading: boolean
  setStep: (step: number) => void
}

export const NewListForm = ({ listData, setListData, error, onSubmit, loading, setStep }: NewListFormProps) => {

  return (
    <div>
      {/* {listCreated && <div>
        <p className='text-green-400'>List Created</p>
        <div className='flex'>
          <a
            className='underline'
            rel="noreferrer"
            target="_blank"
            href={`https://twitter.com/i/lists/${createdListInformation?.data?.id}`}
          >{createdListInformation?.data?.name}</a>
          <button
            className='flex'
            onClick={() => { navigator.clipboard.writeText(`https://twitter.com/i/lists/${createdListInformation?.data?.id}`) }}
          >
            <AiOutlineCopy size={20} />
          </button>
        </div>
      </div>} */}

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
          <label htmlFor='description'>List Description</label>
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

        <div className='mb-[20px] flex flex-col md:flex-row'>
          <div className='flex flex-col'>
            <label htmlFor='image'>Image</label>
            <input
              type='file'
              id='image'
              onChange={(event) => {
                const image = event?.target?.files ? event.target.files[0] : ''
                if (image) {
                  const storageRef = ref(storage, `/${listData?.name + uuid()}/${image.name + uuid()}`)
                  const uploadTask = uploadBytesResumable(storageRef, image);
                  uploadTask.on(
                    "state_changed",
                    (snapshot) => {
                      const percent = Math.round(
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                      );
                      //setImageUploadPercentage(percent)
                    },
                    (err) => console.log(err),
                    () => {
                      getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                        setListData({ ...listData, image: url })
                      });
                    }
                  );
                }

              }}
            />
          </div>

          {/* <div>{imageUploadPercentage > 1 && imageUploadPercentage < 100 ? `Uploading ${imageUploadPercentage}%...` : ''}</div> */}
          {listData.image && <img src={listData.image} className='w-auto h-[220px] object-cover' />}
        </div>

        <div className='mb-[20px] flex flex-col'>
          <div className='flex justify-between'>
            <div>
              <p className='text-2xl'>Is Private?</p>
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
          disabled={loading}
          onClick={(e) => {
            e.preventDefault()
            setStep && setStep(1)
          }}
          className='bg-blue-500 text-white font-semibold px-4 py-2 rounded-md mt-4 w-full'
        >
          Continue
        </button>
      </form>


    </div>
  )
}