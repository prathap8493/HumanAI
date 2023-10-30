// src/firestoreFunctions.js
import { db } from '../utils/firebase'; 
import { collection, query, where,updateDoc,doc, onSnapshot,addDoc,getDocs } from "firebase/firestore";

export const getUsers = () => {
  const usersRef = collection(db, 'user_responses');
  return onSnapshot(usersRef, (snapshot) => {
    const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log(users)
    // setUsers(users);
  });
};

export const addUser = async (user) => {
    const usersRef = collection(db, 'user_responses');

    const q = query(usersRef, where("user_uuid", "==", user.user_uuid));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      await addDoc(usersRef, user);
      console.log('New user added');
    } 
    else {
      const existingUserDoc = querySnapshot.docs[0];
      await updateDoc(doc(usersRef, existingUserDoc.id), {
        correct_count: user.correct_count,
        incorrect_count: user.incorrect_count,
        imageData:user.imageData
      });
      console.log('User updated');
    }
};

export const getImageStatistics = async () => {
  const statsRef = collection(db, 'images');
  const querySnapshot = await getDocs(statsRef);
  const stats = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return stats;
};

export const addStatistics = async (stats) => {
  const statsRef = collection(db, 'images');
  // Query for the statistics with the matching image_src
  const q = query(statsRef, where("id", "==", stats.id));
  const querySnapshot = await getDocs(q);
  
  if (querySnapshot.empty) {
    await addDoc(statsRef, stats);
    console.log('New stats added');
  } 
  else {
    const existingStatsDoc = querySnapshot.docs[0];
    await updateDoc(doc(statsRef, existingStatsDoc.id), stats);
    console.log('Stats updated');
  }
};
