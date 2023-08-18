import {
  collection,
  getDocs,
  deleteDoc,
  addDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { firestore } from "../config/firebaseConfig";

export type userProp = {
  firstname: string;
  id: string;
  lastname: string;
  middlename: string;
  password: string;
  username: string;
};

export const getUser = async () => {
  return new Promise((resolve, reject) => {
    getDocs(collection(firestore, "user"))
      .then(function (response: any) {
        const newData: userProp[] = response.docs.map((doc: any) => ({
          ...doc.data(),
          id: doc.id,
        }));
        return resolve(newData);
      })
      .catch(function (error: any) {
        return reject(error);
      });
  });
};

export const addUser = async (data: userProp[]) => {
  return new Promise((resolve, reject) => {
    addDoc(collection(firestore, "user"), data)
      .then(function (response: any) {
        return resolve(response);
      })
      .catch(function (error: any) {
        return reject(error);
      });
  });
};
