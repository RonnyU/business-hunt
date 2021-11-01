import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  increment,
  arrayUnion,
  deleteDoc,
  query,
  orderBy,
} from 'firebase/firestore';
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

  async getBusinesses(sort) {
    //const coll = await getDocs(collection(this.db, 'business'));

    const refbusinesses = await getDocs(
      query(collection(this.db, 'business'), orderBy(sort, 'desc'))
    );

    const businesses = refbusinesses.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
      };
    });

    return businesses;
  }

  async getBusiness(id) {
    const docRef = doc(this.db, 'business', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      // doc.data() will be undefined in this case
      console.log('No such document!');
      return 0;
    }
  }

  async updateLikes(id, userId) {
    const docRef = doc(this.db, 'business', id);

    // Atomically increment the likes  by 1.
    await updateDoc(docRef, {
      likesGivenBy: arrayUnion(userId),
      likes: increment(1),
    });
  }

  async updateComments(id, newComments) {
    const docRef = doc(this.db, 'business', id);

    // Atomically increment the likes  by 1.
    await updateDoc(docRef, {
      comments: newComments,
    });
  }

  async deleteDocument(id) {
    await deleteDoc(doc(this.db, 'business', id));
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
