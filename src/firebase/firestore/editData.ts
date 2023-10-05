import firebaseApp from "../config";
import { getFirestore, doc, updateDoc } from "firebase/firestore";

const db = getFirestore(firebaseApp);

export default async function editData(colllection: string, id: string, data: any) {
  let result = null;
  let error = null;

  try {
    result = await updateDoc(doc(db, colllection, id), data, {
      merge: true,
    });
  } catch (e) {
    error = e;
  }

  return { result, error };
}
