import storage from "../firebase/firebaseConfig"
import { ref, uploadBytesResumable, getDownloadURL, uploadBytes } from "firebase/storage";
import { uuid } from 'uuidv4';
import { Toggle } from "./Toggle";
import { Loading } from "./Loading";
import Instagram from "@/icons/Instagram";
import { DigitalCollectionSelect } from "./DigitalCollectionSelect";
import { useEffect, useState } from "react";

interface NewListFormProps {
  listData: any
  setListData: (listData: any) => void
  error: any
  loading: boolean
  setStep: (step: number) => void
}

export const NewListForm = ({ listData, setListData, error, loading, setStep }: NewListFormProps) => {
  const [requiredPoaps, setRequiredPoaps] = useState<any[]>([])
  const [requiredNFTs, setRequiredNFTs] = useState<any[]>([])

  useEffect(() => {
    setListData({ ...listData, requiredPoaps: requiredPoaps, requiredNFTs: requiredNFTs})
  }, [requiredPoaps])

  console.log('requiredNFTs', requiredNFTs);
  console.log('requiredPoaps', requiredPoaps);
  

  return (
    <div>
      <form className="mt-[20px]">
        <div className='mb-[20px] flex flex-col md:flex-col'>
          <p className="text-base font-medium mb-[5px]">List Image</p>
          <div className="file-upload w-full relative border rounded-[16px] shadow-sm h-min">

            <label htmlFor='image' className="w-full rounded-[16px] file-upload-label flex justify-center items-center py-[15px] px-4 bg-white cursor-pointer text-gray-700 hover:bg-gray-300">
              <Instagram className="mr-[5px]" />
              Add Image
            </label>
            <input
              placeholder="Add Image"
              className="absolute top-0 left-0 opacity-0 cursor-pointer w-[20px]"
              //className="border-solid border-red-500 border-2 w-full"
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
          {listData.image && <img src={listData.image} className="mt-[10px] w-[100px] h-[100px] object-cover m-auto rounded-full" />}
        </div>
        <div className='mb-[20px]'>
          <label htmlFor='name'>List Name</label>
          <input
            type='text'
            id='name'
            className='border border-gray-border p-2 w-full text-black rounded-[50px]'
            placeholder='Insert a name for your list'
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
            className='min-h-[90px] border border-gray-border rounded-md p-2 w-full text-black placeholder-top'
            placeholder='Enter the List Description'
            value={listData.description}
            onChange={(event) =>
              setListData({ ...listData, description: event.target.value })
            }
          />
        </div>

        <div className='mb-[20px] flex justify-between'>
          <div>
            <p className="text-base font-medium mb-[5px]">Digital Collection</p>
            <p>Select at least one digital collection that members will need to join this list</p>
          </div>

          <DigitalCollectionSelect
            requiredPoaps={requiredPoaps}
            setRequiredPoaps={setRequiredPoaps}
            requiredNFTs={requiredNFTs}
            setRequiredNFTs={setRequiredNFTs}
          />
        </div>

        <div className='mb-[20px] flex flex-col'>
          <div className='flex justify-between'>
            <div>
              <p className="text-base font-medium mb-[5px]">Private</p>
              <p>When you make a list private, just the members of the list will be able to see it</p>
            </div>
            <div className='ml-[10px] my-auto'>
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
          className='mt-[10px] !bg-primary rounded-[8px] text-white p-[10px] px-[20px] cursor-pointer w-full mb-[10px]'
        >
          Continue
        </button>
      </form>
    </div>
  )
}