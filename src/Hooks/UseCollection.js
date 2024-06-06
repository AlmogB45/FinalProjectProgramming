import { useState, useEffect } from "react";
import { db } from "../Firebase/config";
import { collection, onSnapshot } from "firebase/firestore";


export const useCollection = (c) => {
const [docs, setDocs] = useState([]);
useEffect(() => {
let ref = collection(db, c)
// will work every change in the cols
const unSub = onSnapshot(ref, (snapshot) => {
let fire_ar = [];
snapshot.docs.forEach(item => {
fire_ar.push({ id: item.id, ...item.data() })
// console.log(item.id, item.data());
})
setDocs(fire_ar);
})
return () => unSub();
}, [c])
return { docs };
}