import Trash from '@/icons/Trash';
import { getSocialLogo } from '@/icons/utils';
import { generateSocialLinks, removeAtSymbol } from '@/utils/utils';
import React, { useEffect, useState } from 'react';
import Button from './Button';

interface TokenGatedLinksProps {
  setData: (data: any) => void
  data: any
}

export const TokenGatedLinks = ({ setData, data }: TokenGatedLinksProps) => {
  const [socialLinks, setSocialLinks] = useState<any[]>([]);
  const [socialPlatform, setSocialPlatform] = useState<string>('twitter');

  const updateSocialLink = (index: any, key: any, value: any) => {
    const updatedLinks = [...socialLinks];
    updatedLinks[index][key] = value;
    const platform = updatedLinks[index].platform
    setSocialLinks(updatedLinks);
    setData({ ...data, [platform]: value })
  };

  const removeSocialLink = (index: number) => {
    const filteredLinks = socialLinks.filter((_, i) => i !== index);
    setSocialLinks(filteredLinks);

    // Optionally, update listData if needed
    const updatedListData = { ...data };
    delete updatedListData[socialLinks[index].platform];
    setData(updatedListData);
  };

  useEffect(() => {
    if (data) {
      const newSocialLinks = generateSocialLinks(data, socialLinks);
      if (newSocialLinks.length > 0) {
        setSocialLinks(prevLinks => [...prevLinks, ...newSocialLinks]);
      }
    }
  }, [data, socialLinks]);

  const platformPlaceholders: { [key: string]: string } = {
    twitter: '@username',
    facebook: 'https://www.facebook.com/profile',
    instagram: '@username',
    discord: 'https://discord.com/invite/code',
    youtube: 'https://www.youtube.com/channel/channel',
    telegram: 'https://t.me/username',
    linkedin: 'https://www.linkedin.com/in/username',
  };

  return (
    <div>
      <h3 className='text-base'>Socials</h3>
      <div className='flex'>
        <select
          className='bg-transparent'
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
          <option value="linkedin">LinkedIn</option>
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
            <div className='mb-[20px] w-full flex'>
              <div className='my-auto mr-[5px] w-[40px]'>
                {getSocialLogo(social.platform)}
              </div>
              <input
                type='text'
                id='social'
                className={`border border-gray-border p-2 w-full text-black rounded-[50px]`}
                placeholder={platformPlaceholders[social.platform] || 'Insert a link for your social'}
                value={social.url}
                onChange={(e) =>
                  updateSocialLink(index, 'url', e.target.value)
                }
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
