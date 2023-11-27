import Trash from '@/icons/Trash';
import { getSocialLogo } from '@/icons/utils';
import React, { useEffect, useState } from 'react';
import Button from './Button';

interface TokenGatedLinksProps {
  setListData: (listData: any) => void
  listData: any
}

export const TokenGatedLinks = ({ setListData, listData }: TokenGatedLinksProps) => {
  const [socialLinks, setSocialLinks] = useState<any[]>([]);
  const [socialPlatform, setSocialPlatform] = useState<string>('twitter');

  const updateSocialLink = (index: any, key: any, value: any) => {
    const updatedLinks = [...socialLinks];
    updatedLinks[index][key] = value;
    const platform = updatedLinks[index].platform
    setSocialLinks(updatedLinks);
    setListData({ ...listData, [platform]: value })
  };

  const removeSocialLink = (index: number) => {
    const filteredLinks = socialLinks.filter((_, i) => i !== index);
    setSocialLinks(filteredLinks);

    // Optionally, update listData if needed
    const updatedListData = { ...listData };
    delete updatedListData[socialLinks[index].platform];
    setListData(updatedListData);
  };

  useEffect(() => {
    const platforms = ['facebook', 'instagram', 'twitter', 'discord', 'youtube', 'telegram'];

    const linkExists = (platform: string, url: string) => {
      return socialLinks.some(link => link.platform === platform && link.url === url);
    };

    const newSocialLinks = platforms.reduce((acc: any, platform) => {
      const url = listData[platform];
      if (url && !linkExists(platform, url)) {
        acc.push({ platform: platform, url: url });
      }
      return acc;
    }, []);

    if (newSocialLinks.length > 0) {
      setSocialLinks(prevLinks => [...prevLinks, ...newSocialLinks]);
    }
  }, [listData, socialLinks]);

  console.log('socialLinks', socialLinks);

  return (
    <div>
      <h3 className='text-base'>Socials</h3>
      <div className='flex'>
        <select
          value={socialPlatform}
          onChange={(e) => setSocialPlatform(e.target.value)}
        >
          <option value="twitter">Platform</option>
          <option value="facebook">Facebook</option>
          <option value="twitter">Twitter</option>
          <option value="instagram">Instagram</option>
          <option value="discord">Discord</option>
          <option value="youtube">Youtube</option>
          <option value="telegram">Telegram</option>
        </select>

        <Button
          className='w-max ml-[5px]'
          onClick={(e) => {
            e.preventDefault()
            setSocialLinks([...socialLinks, { platform: socialPlatform, url: '' }]);
            setSocialPlatform('')
          }}>
          Add platform+
        </Button>
      </div>
      <div className='mt-[15px]'>
        {socialLinks.map((social, index) => (
          <div key={index} className="flex">
            <div className='mb-[20px] w-full max-w-[400px] flex'>
              <div className='my-auto mr-[5px] w-[40px]'>
                {getSocialLogo(social.platform)}
              </div>
              <input
                type='text'
                id='social'
                className={`border border-gray-border p-2 w-full text-black rounded-[50px]`}
                placeholder='Insert a link for your social'
                value={social.url}
                onChange={(e) => updateSocialLink(index, 'url', e.target.value)}
              />
              <button
                className="ml-2 p-1 text-sm text-red-500"
                onClick={(e) => {
                  e.preventDefault()
                  removeSocialLink(index)
                }}
              >
                <Trash />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
