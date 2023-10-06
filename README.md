# Phoros

# Set Up

```sh
npm install
npm run dev
```

# Firebase Examples

## Add data

```sh
import addData from "@/firebase/firestore/addData";
const handleForm = async () => {
    const data = {
      name: 'John snow',
      house: 'Stark'
    }
    const { result, error } = await addData('users', 'user-id', data);

    if (error) {
      return console.log(error)
    }
  }
```

## Read data

```sh
import getDocument from "@/firebase/firestore/getData";
useEffect(() => {
    const getData = async () => {
      return await getDocument('users', 'user-id')
    }

    getData().then((result: any) => {
      setUserData(result.result._document.data.value.mapValue.fields)
    })
  }, []);
```# phoros
