import { useStorageUpload } from "@thirdweb-dev/react";
import React, { useEffect, useState } from "react";

interface IPFSUploadProps {
  text?: string
  setTicketImage: (ipfsUrl: string) => void
}

export default function IPFSUpload({ text, setTicketImage }: IPFSUploadProps) {
  const [file, setFile] = useState();
  const [imageUrl, setImageUrl] = useState('');
  const { mutateAsync: upload } = useStorageUpload();

  const uploadToIpfs = async () => {
    const uploadUrl = await upload({
      data: [file],
      options: { uploadWithGatewayUrl: true, uploadWithoutDirectory: true },
    });
    console.log('uploadUrl', uploadUrl);
    const url = uploadUrl[0].split('/ipfs/');
    setImageUrl(`https://ipfs.io/ipfs/${url[1]}`)
    setTicketImage(`https://ipfs.io/ipfs/${url[1]}`)
  };

  useEffect(() => {
    if (!imageUrl && file) {
      uploadToIpfs()
    }
  }, [file])

  return (
    <div>
      <div className='flex flex-col'>
        {text && <label htmlFor='image'>{text}</label>}
        <input type="file" onChange={(e: any) => setFile(e.target.files[0])} />
      </div>

      {imageUrl && <img src={imageUrl} className='w-auto h-[220px] object-cover' />}


      <p>{imageUrl}</p>
      <button onClick={() => { navigator.clipboard.writeText(imageUrl) }}
      >Copy to clipboard</button>
    </div>
  );
}
