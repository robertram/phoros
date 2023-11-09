import { Loading } from "./Loading";
import { CardButton } from "./CardButton";
import Rocket from "@/icons/Rocket";
import Edit from "@/icons/Edit";
import { useEffect, useState } from "react";

interface NewListFormProps {
  listData: any
  setListData: (listData: any) => void
  error: any
  onSubmit: (event?: any) => Promise<void>
  loading: boolean
  setStep: (step: number) => void
}

export const NewListPreview = ({ listData, error, onSubmit, loading, setStep }: NewListFormProps) => {
  const [requiredCollectible, setRequiredCollectible] = useState<any>()

  const getPoap = async () => {
    const tokenId = listData?.requiredPoaps[0]?.split('-')

    await fetch(`https://api.poap.tech/token/${tokenId[1]}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'x-api-key': `${process.env.NEXT_PUBLIC_POAP_API_KEY}`
        },
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json()
      })
      .then(response => {
        console.log('poap', response);
        setRequiredCollectible(response)
        return response
      })
      .catch((err) => {
        console.log('err', err);
      });
  }

  useEffect(() => {
    if (listData?.requiredPoaps > 0) {
      getPoap()
    }
  }, [listData])

  return (
    <div>
      <div className=" mt-[20px]">
        {listData ?
          <div>
            <div className="m-auto">
              <img src={listData?.image} className="w-[100px] h-[100px] object-cover m-auto rounded-full bg-gray-500" />
            </div>
            <h1 className="text-3xl text-center mt-[10px]">{listData?.name}</h1>
            <p className="text-base mt-[10px]">{listData?.description}</p>
            {requiredCollectible &&
              <div className="mt-[10px] flex justify-between">
                <p className="text-base font-bold text-[16px]">Digital Collectible</p>
                <div className="flex">
                  <img
                    className="w-[20px] h-[20px] m-auto mr-[5px] rounded-full"
                    src={requiredCollectible?.event?.image_url}
                  />
                  <p className="text-[14px]">{requiredCollectible?.event?.name}</p>
                </div>
              </div>
            }
            <div className="mt-[10px] flex justify-between">
              <p className="text-base font-bold text-[16px]">Private</p>
              <p className="text-[14px]">{listData.private ? 'Yes' : 'No'}</p>
            </div>
          </div>
          :
          <div className="w-full flex justify-center">
            <Loading />
          </div>
        }

        <div>
          {listData &&
            <div className="flex justify-between gap-4 mt-[50px]">
              <CardButton
                onClick={() => {
                  setStep(0)
                }}
                title="Edit details"
                icon={<Edit className="m-auto" />}
              />
              <CardButton
                disabled={loading}
                onClick={() => onSubmit()}
                title="Launch List"
                icon={<Rocket className="m-auto" />}
                loading={loading}
              />
            </div>
          }
        </div>
      </div>

    </div>
  )
}