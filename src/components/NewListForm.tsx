import storage from "../firebase/firebaseConfig"
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { uuid } from 'uuidv4';
import { Toggle } from "./Toggle";
import Picture from "@/icons/Picture";
import { DigitalCollectionSelect } from "./DigitalCollectionSelect";
import { useEffect, useState } from "react";
import { TokenGatedLinks } from "./TokenGatedLinks";

interface NewListFormProps {
  listData: any
  setListData: (listData: any) => void
  error: any
  loading: boolean
  setStep: (step: number) => void
  isEdit?: boolean
}

export const NewListForm = ({ listData, setListData, error, loading, setStep, isEdit }: NewListFormProps) => {
  const [eligibility, setEligibility] = useState<string>('one')
  const [requiredPoaps, setRequiredPoaps] = useState<any[]>([])
  const [requiredNFTs, setRequiredNFTs] = useState<any[]>([])
  const [firstLoad, setFirstLoad] = useState<boolean>(false)

  useEffect(() => {
    setListData({ ...listData, requiredPoaps: requiredPoaps, requiredNFTs: requiredNFTs, eligibility: eligibility })
  }, [requiredPoaps, requiredNFTs, eligibility])

  useEffect(() => {
    if (!firstLoad) {
      if (listData.requiredNFTs) {
        setRequiredNFTs(listData.requiredNFTs)
      }
      if (listData.requiredPoaps) {
        setRequiredPoaps(listData.requiredPoaps)
      }
    }
    setFirstLoad(true)
  }, [listData])

  return (
    <div>
      <form className="mt-[20px]">
        <div className='mb-[20px] flex flex-col md:flex-col'>
          <p className="text-base font-medium mb-[5px]">List Image</p>
          <div className="file-upload w-full relative border rounded-[16px] shadow-sm h-min">

            <label htmlFor='image' className="w-full rounded-[16px] file-upload-label flex justify-center items-center py-[15px] px-4 bg-white cursor-pointer text-gray-700 hover:bg-gray-300">
              <Picture className="mr-[5px]" />
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
          {listData?.image && <img src={listData?.image} className="mt-[10px] w-[100px] h-[100px] object-cover m-auto rounded-full" />}
        </div>
        <div className='mb-[20px]'>
          <label htmlFor='name'>List Name</label>
          <input
            type='text'
            id='name'
            className={`border border-gray-border p-2 w-full text-black rounded-[50px] ${isEdit ? 'text-gray-400' : ''}`}
            placeholder='Insert a name for your list'
            value={listData?.name}
            disabled={isEdit}
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
            className={`min-h-[90px] border border-gray-border rounded-md p-2 w-full text-black placeholder-top ${isEdit ? 'text-gray-400' : ''}`}
            placeholder='Enter the List Description'
            value={listData?.description}
            disabled={isEdit}
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
            eligibility={eligibility}
            setEligibility={setEligibility}
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
                checked={listData?.isPrivate}
                disabled={isEdit}
                onChange={(event) => {
                  setListData({ ...listData, isPrivate: event.target.checked })
                }}
              />
            </div>
          </div>
        </div>

        {/* <TokenGatedLinks setData={setListData} data={listData} /> */}

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