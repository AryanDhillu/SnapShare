import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase";

const fireupload = async(file) => {

    const storage = getStorage();
    const date = new Date();
    const storageRef = ref(storage, `images/${date + file.name}`);

    return new Promise((resolve,reject) => {

    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on('state_changed', 
    (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
    }, 
    (error) => {
        reject("Something went Wrong!" + error.code)             
    }, 
    () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL)
        });
    }
    );
})
}

export default fireupload;