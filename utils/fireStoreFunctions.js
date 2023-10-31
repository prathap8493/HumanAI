// src/firestoreFunctions.js
import { db } from '../utils/firebase'; 
import { collection, query,increment,where,select,writeBatch,updateDoc,doc,getDoc,onSnapshot,addDoc,getDocs } from "firebase/firestore";

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
  try {
    const statsRef = collection(db, 'images');
    const querySnapshot = await getDocs(statsRef);
    const allStats = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {id: doc.id,imageid:data.id,src: data.src }; 
    });

    // Function to get random elements from an array
    const getRandomElements = (arr, count) => {
      const shuffled = [...arr].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, count);
    }

    // Get 5 random stats
    const randomStats = getRandomElements(allStats, 5);
    return randomStats;

  } catch (error) {
    console.error("Error fetching image statistics:", error);
    throw error; 
  }
};
export const addStatistics = async (clickData) => {
  const statsRef = collection(db, 'images');
  const updatedDocs = [];
  const batch = writeBatch(db);

  // Step 1: Fetch all documents
  const allDocsSnapshot = await getDocs(statsRef);
  const allDocs = allDocsSnapshot.docs.map(doc => ({ firestoreId: doc.id, ...doc.data() }));

  // Step 2: Update in memory
  for (const { imageid, userAnswer } of clickData) {
    const doc = allDocs.find(d => d.id === imageid);
    if (doc) {
      const isCorrect = doc.answer === userAnswer;
      doc.correct = (doc.correct ?? 0) + (isCorrect ? 1 : 0);
      doc.incorrect = (doc.incorrect ?? 0) + (isCorrect ? 0 : 1);
      updatedDocs.push({ firestoreId: doc.firestoreId, ...doc, isCorrect, guessedAnswer: userAnswer });
    } else {
      console.log('No record found for image ID:', imageid);
    }
  }

  // Step 3: Batch write back to Firestore
  for (const docData of updatedDocs) {
    const docRef = doc(db, 'images', docData.firestoreId);
    batch.update(docRef, {
      correct: docData.correct,
      incorrect: docData.incorrect
    });
  }

  // Commit the batch
  try {
    await batch.commit();
  } catch (error) {
    console.error("Error updating documents: ", error);
    throw error;
  }

  // Return the updated documents
  return updatedDocs;
};

// export const addStatistics = async (clickData) => {
//   const statsRef = collection(db, 'images');
//   const updatedDocs = [];

//   for (const { id, userAnswer } of clickData) {
//     const q = query(statsRef, where("id", "==", id));
//     const querySnapshot = await getDocs(q);

//     if (!querySnapshot.empty) {
//       const docRef = querySnapshot.docs[0].ref; // Get the document reference
//       const docData = querySnapshot.docs[0].data();
//       const isCorrect = docData.answer === userAnswer;

//       if (isCorrect) {
//         console.log('Answer is correct for image ID:', id);
//         await updateDoc(docRef, {
//           correct: increment(1)
//         });
//       } else {
//         console.log('Answer is incorrect for image ID:', id);
//         await updateDoc(docRef, {
//           incorrect: increment(1)
//         });
//       }
      
//       // Get the updated document data
//       const updatedDocData = (await getDoc(docRef)).data();
//       if (updatedDocData) {
//         updatedDocs.push({ id, ...updatedDocData, isCorrect, guessedAnswer: userAnswer });
//       }

//     } else {
//       console.log('No record found for image ID:', id);
//     }
//   }

//   return updatedDocs;
// };





