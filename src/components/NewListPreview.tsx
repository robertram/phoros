import { Loading } from "./Loading";
import { CardButton } from "./CardButton";
import Rocket from "@/icons/Rocket";
import Edit from "@/icons/Edit";

interface NewListFormProps {
  listData: any
  setListData: (listData: any) => void
  error: any
  onSubmit: (event?: any) => Promise<void>
  loading: boolean
  setStep: (step: number) => void
}

export const NewListPreview = ({ listData, error, onSubmit, loading, setStep }: NewListFormProps) => {

  return (
    <div>
      <div className="flex flex-col justify-between">
        {listData ?
          <div>
            <div className="m-auto">
              <img src={listData?.image} className="w-[100px] h-[100px] object-cover m-auto rounded-full bg-gray-500" />
            </div>
            <h1 className="text-3xl text-center mt-[10px]">{listData?.name}</h1>
            <p className="text-base mt-[10px]">{listData?.description}</p>
            <div className="mt-[10px] flex justify-between">
              <p className="text-base font-bold">Private</p>
              <p>{listData.private ? 'Yes' : 'No'}</p>
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