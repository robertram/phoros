import firebaseApp from "../config";
import { getFirestore, doc, getDoc, getDocs, query, collection, where } from "firebase/firestore";

const db = getFirestore(firebaseApp);

export { db };

export async function getDocument(collection: string, id: string) {
  const docRef = doc(db, collection, id);

  let result = null;
  let error = null;

  try {
    result = await getDoc(docRef);
  } catch (e) {
    error = e;
  }

  return { result, error };
}

interface GetDocumentsProps {
  collectionName?: string
  customQuery?: any
}
//isTestEvent: activeChain === 'polygon' ? true : false
//
export async function getDocuments({ collectionName, customQuery }: GetDocumentsProps) {
  const collectionQuery = customQuery ? customQuery : collectionName ? collection(db, collectionName) : ''
  const querySnapshot = await getDocs(collectionQuery);

  let result = null;
  let error = null;
  const activeChain = process.env.NEXT_PUBLIC_CHAIN

  try {
    const data: any = []
    querySnapshot.forEach((doc) => {
      const newData: any = doc.data()
      const showTestEvents = activeChain === newData.chain || activeChain === "mumbai"

      if (!newData.hideEvent && showTestEvents) {
        newData.id = doc.id;
        data.push(newData)
      }
    });

    result = data
  } catch (e) {
    error = e;
  }

  return { result, error };
}