import { createClient } from "contentful";

const useContentful = () => {
  const client = createClient({
    space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID || "",
    accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN || "",
  });

  const getEntries = async (entryType: string) => {
    try {
      const entries = await client.getEntries({
        content_type: entryType,
        include: 2,
      });

      const sanitizedEntries = entries.items.map((item) => {
        return {
          ...item.fields
        };
      });

      return sanitizedEntries;
    } catch (error) {
      console.log(`Error fetching authors ${error}`);
    }
  };

  return { getEntries };
};

export default useContentful;
