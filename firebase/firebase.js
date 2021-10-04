import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} from 'firebase/storage';
import {
  createUserWithEmailAndPassword,
  getAuth,
  updateProfile,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';

import firebaseConfig from './config';

class Firebase {
  constructor() {
    const app = initializeApp(firebaseConfig);
    this.auth = getAuth();
    this.db = getFirestore();
    this.storage = getStorage();
  }

  async register(name, email, password) {
    const newUser = await createUserWithEmailAndPassword(
      this.auth,
      email,
      password
    );

    return await updateProfile(this.auth.currentUser, {
      displayName: name,
    });
  }

  async login(email, password) {
    return await signInWithEmailAndPassword(this.auth, email, password);
  }

  async logout() {
    await signOut(this.auth);
  }

  async saveBusiness(business) {
    return await addDoc(collection(this.db, 'business'), business);
  }

  async getBusinesses() {
    const query = await getDocs(collection(this.db, 'business'));

    const businesses = query.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
      };
    });

    return businesses;
  }
  // async saveImage(file) {
  //   const storageRef = ref(this.storage, 'business/' + file.name);
  //   return await uploadBytesResumable(storageRef, file);
  // }

  // async downloadURL(imageRef) {
  //   const starsRef = ref(this.storage, imageRef);

  //   return await getDownloadURL(starsRef);
  // }

  returnStorage() {
    return this.storage;
  }
  returnDb() {
    return this.db;
  }
}

const firebaseClass = new Firebase();

export default firebaseClass;
