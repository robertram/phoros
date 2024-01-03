import { getShortAddress } from "@/lib/utils";
import { useEnsName } from "wagmi";
import { useDisconnect } from 'wagmi'
import { CardButton } from "@/components/CardButton";
import Edit from "@/icons/Edit";
import Rocket from "@/icons/Rocket";
import { InfoCard } from "@/components/InfoCard";
import { useRouter } from "next/router";
import usePoaps from "@/hooks/usePoaps";
import { SocialsButtons } from "./SocialsButtons";
import { useEffect, useState } from "react";
import { generateSocialLinks, getWhereParam } from "@/utils/utils";
import Logout from "@/icons/Logout";
import useFetchNFTBalance from "@/hooks/useFetchNFTBalance";
import { Loading } from "./Loading";
import { useAuth } from "@/context/AuthContext";
import storage from "../firebase/firebaseConfig"
import { ref, uploadBytesResumable, getDownloadURL, uploadBytes } from "firebase/storage";
import { uuid } from 'uuidv4';
import { query, collection, where, getDocs, getDoc } from "firebase/firestore";
import { db, getDocuments } from '@/firebase/firestore/getData';
import { doc, setDoc } from 'firebase/firestore';

interface ProfileProps {
  loggedIn: boolean
}

export const Profile = ({ loggedIn }: ProfileProps) => {
  const router = useRouter();
  const addressParam = Array.isArray(router.query.address) ? router.query.address[1] : router.query.address;
  const [user, setUser] = useState<any>()
  const { disconnect } = useDisconnect()
  const { address } = useAuth()
  const { poaps, loading: poapsLoading, error: poapsError } = usePoaps(user?.id ?? '');
  const { nfts, loading: nftsLoading } = useFetchNFTBalance(user?.id ?? '');
  const { data: ens, isError, isLoading } = useEnsName({
    address: user?.id
  })
  const [socialLinks, setSocialLinks] = useState<any[]>([]);
  const [addedToClipboard, setAddedToClipboard] = useState<boolean>(false);
  const [lists, setLists] = useState<any[]>([]);
  const [bannerUploaded, setBannerUploaded] = useState(true)
  const [loading, setLoading] = useState(false)
  const [bannerImage, setBannerImage] = useState('')

  const getAllData = async () => {
    const customQuery = query(collection(db, "lists"), where("owner", "==", user?.id));
    return await getDocuments({ customQuery })
  }

  useEffect(() => {
    const getUserInfo = async () => {
      const usersRef = doc(db, 'users', addressParam ?? '')
      const docSnap = await getDoc(usersRef)

      return { ...docSnap.data(), id: docSnap.id };
    }

    if (addressParam) {
      getUserInfo().then((result: any) => {
        console.log('result', result);

        setUser(result)
      })
    }
  }, [addressParam, bannerUploaded]);

  useEffect(() => {
    console.log('refresh user!');
    if (user?.id) {
      getAllData().then((result: any) => {
        setLists(result.result)
      })
    }
  }, [user, bannerUploaded]);

  useEffect(() => {
    if (addedToClipboard) {
      setTimeout(() => {
        setAddedToClipboard(false)
      }, 2000);
    }
  }, [addedToClipboard])

  useEffect(() => {
    if (user) {
      const newSocialLinks = generateSocialLinks(user, socialLinks);

      if (newSocialLinks.length > 0) {
        setSocialLinks((prevLinks: any) => [...prevLinks, ...newSocialLinks]);
      }
    }
  }, [user, socialLinks]);

  const onChangeImage = async (image: string) => {
    setLoading(true)
    const usersRef = doc(db, 'users', address ?? '')

    console.log('banner! image', image);

    try {
      await setDoc(usersRef, { bannerImage: image }, { merge: true })
      setBannerUploaded(true)
    } catch (err) {
      console.error('You dont have permission')
    }

    setLoading(false)
    setBannerUploaded(false)
  }

  useEffect(() => {
    if (bannerImage) {
      onChangeImage(bannerImage)
    }
  }, [bannerImage])

  return (
    <div className='max-w-large flex items-center m-auto'>
      <div className="w-full">
        <div className="relative">
          <div className="banner w-full h-[124px] md:h-[200px] bg-gradient-to-b from-[#5CFF63] to-[#009657]">
            {/* <div className="absolute md:bottom-[20px] md:right-[50px] bottom-[10px] right-[20px]">
               <Button secondary onClick={() => { router.push('/account/edit') }}>Edit Profile</Button> 
            </div> */}

            <input
              className="hidden z-50"
              type="file" id="image" accept="image/*"
              onChange={(event) => {
                if (!loggedIn || user?.id != address) {
                  return
                }
                const image = event?.target?.files ? event.target.files[0] : ''
                if (image) {
                  const storageRef = ref(storage, `/${uuid()}/${image.name + uuid()}`)
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
                        console.log('url', url);
                        setBannerImage(url)
                      });
                    }
                  );
                }
              }}
            />
            {loggedIn && user?.id === address ?
              <label htmlFor="image"
                className="w-full h-full bg-transparent cursor-pointer overflow-hidden flex items-center justify-center">
                <img src={user?.bannerImage} className='w-full object-cover' />
                <div className="text-white absolute inset-0 flex justify-center items-center">
                  <Edit className="" color="white" />
                </div>
              </label> :
              <div className="w-full h-full bg-transparent  overflow-hidden flex items-center justify-center">
                <img src={user?.bannerImage} className='w-full object-cover' />
              </div>
            }

          </div>

          <div className="absolute left-[20px] md:left-[30px] bottom-[-30px] md:bottom-[-50px] rounded-full w-[100px] h-[100px] bg-slate-800 md:w-[150px] md:h-[150px]">
            <img
              className="rounded-full object-cover h-full w-full"
              src={user?.profilePicture}
            />
          </div>
        </div>

        <div className="px-[16px]">
          <div className="mt-[40px] md:mt-[70px]">
            <p className="text-base font-bold text-grayed">{ens ? ens : getShortAddress(user?.id)}</p>
            {user?.username && <p className="text-base font-bold text-grayed">{user?.username}</p>}
            <p className="mt-[10px] text-grayed">{user?.bio}</p>
          </div>

          <div className="flex justify-between gap-4 mt-[30px]">
            <InfoCard
              title="Collectibles"
              value={poapsLoading || nftsLoading ? '-' : poaps?.length + nfts?.length}
            />
            <InfoCard
              title="Lists"
              value={`${lists?.length ?? '0'}`}
              className="cursor-pointer"
              onClick={() => {
                router.push(`/u/${user?.username ? user?.username : user?.id}/lists`)
              }}
            />
          </div>

          <div className="mt-[30px]">
            <SocialsButtons socialLinks={socialLinks} />
          </div>

          {loggedIn && user?.id === address &&
            <div>
              <div className="flex justify-between gap-4 mt-[50px]">
                <CardButton
                  onClick={() => {
                    router.push('/edit-profile')
                  }}
                  title="Edit"
                  icon={<Edit className="m-auto" />}
                />
                <CardButton
                  onClick={() => {
                    // if (user?.username) {
                    if (navigator.share) {
                      navigator.share({
                        url: `https://app.phoros.io/user/${user?.username}`,
                      })
                        .then(() => console.log('Successful share'))
                        .catch((error) => console.log('Error sharing:', error));
                    } else {
                      navigator.clipboard.writeText(`https://app.phoros.io/user/${user?.username}`)
                      setAddedToClipboard(true)
                      console.log('Web Share API is not supported in your browser.');
                    }
                    // } else {
                    //   setOpenUsernameModal(true)
                    // }
                  }}
                  title={addedToClipboard ? "Link copied to your Clipboard" : "Share"}
                  icon={<Rocket className="m-auto" />}
                //loading={loading}
                />
              </div>
              <CardButton
                onClick={() => disconnect()}
                title="Logout"
                icon={<Logout className="m-auto" />}
                className="mt-[20px]"
              //loading={loading}
              />
            </div>
          }

          {/* <UsernameModal open={openUsernameModal} setOpen={setOpenUsernameModal} setRefreshUser={setRefreshUser} /> */}
        </div>
      </div>
    </div>
  )
}