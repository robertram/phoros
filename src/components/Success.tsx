import storage from "../firebase/firebaseConfig"
import { ref, uploadBytesResumable, getDownloadURL, uploadBytes } from "firebase/storage";
import { uuid } from 'uuidv4';
import { Toggle } from "./Toggle";
import { Loading } from "./Loading";
import AddUser from "@/icons/AddUser";
import Twitter from "@/icons/Twitter";
import { CardButton } from "./CardButton";
import Rocket from "@/icons/Rocket";
import Edit from "@/icons/Edit";

interface NewListCreatedProps {
  title?: string
  description?: string
  firstButtonText?: string
  firstButtonLink?: string
  firstButtonIcon?: any
  secondButtonText?: string
  secondButtonLink?: string
  secondButtonOnClick?: () => void
  secondButtonIcon?: any
}

export const Success = ({
  title,
  description,
  firstButtonLink,
  firstButtonText,
  firstButtonIcon,
  secondButtonLink,
  secondButtonOnClick,
  secondButtonText,
  secondButtonIcon
}: NewListCreatedProps) => {

  return (
    <div className="mt-[20px]">
      <img src="https://firebasestorage.googleapis.com/v0/b/phoros-a6fb0.appspot.com/o/Success.png?alt=media&token=46b69227-16b5-46a6-97b9-0434623397e9" className="w-full" />
      <h1 className="text-2xl mt-[20px]">{title}</h1>
      <p className='text-base'>{description}</p>

      <div className="flex justify-between gap-4 mt-[50px]">
        {firstButtonText &&
          <CardButton
            onClick={() => {
              window.open(`${firstButtonLink}`)
            }}
            title={firstButtonText ?? ''}
            icon={firstButtonIcon}
          />
        }
        {secondButtonText &&
          <CardButton
            onClick={
              secondButtonOnClick ? secondButtonOnClick :
                () => {

                  window.open(`${secondButtonLink}`)
                }}
            title={secondButtonText ?? ''}
            icon={secondButtonIcon}
          />
        }
      </div>
    </div>
  )
}