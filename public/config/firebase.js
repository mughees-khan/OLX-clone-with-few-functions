// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";

import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js'
import { getFirestore, setDoc, doc, addDoc, collection, getDocs, getDoc, where, query, onSnapshot, orderBy } from 'https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js'
import { getStorage, ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/9.10.0/firebase-storage.js'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAMDvzr8Iys_wLqN6fQXOyVWuH7ApkYB5E",
    authDomain: "olxfinal-cc788.firebaseapp.com",
    projectId: "olxfinal-cc788",
    storageBucket: "olxfinal-cc788.appspot.com",
    messagingSenderId: "130057586519",
    appId: "1:130057586519:web:b2dfc5043c17f6166ba012",
    measurementId: "G-TYQS1VSBCE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)


function signInFirebase(email, password) {
    return signInWithEmailAndPassword(auth, email, password)
}

async function signUpFirebase(userInfo) {
    const { email, password } = userInfo

    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    await addUserToDb(userInfo, userCredential.user.uid)
}
function addUserToDb(userInfo, uid) {
    const { email, fullName, age } = userInfo

    return setDoc(doc(db, "users", uid), { email, fullName, age })

}

function postAdToDb(title, price, imageUrl) {
    const userId = auth.currentUser.uid
    return addDoc(collection(db, "ads"), { title, price, imageUrl, userId })
}

async function uploadImage(image) {
    const storageRef = ref(storage, `image/${image.name}`)
    const snapshot = await uploadBytes(storageRef, image)
    const url = await getDownloadURL(snapshot.ref)
    return url
}
async function getAdsFromDb() {
    const querySnapshot = await getDocs(collection(db, 'ads'))
    const ads = []
    querySnapshot.forEach((doc) => {
        ads.push({ id: doc.id, ...doc.data() })
    });
    return ads
}
function getFirebaseAd(id) {
    const docRef = doc(db, "ads", id)
    return getDoc(docRef)
}

function getRealTimeAds(callback) {
    onSnapshot(collection(db, "ads"), (querySnapshot) => {
        const ads = []

        querySnapshot.forEach((doc) => {
            ads.push({ id: doc.id, ...doc.data() })
        });
        callback(ads)
    });
}


async function checkChatroom(adUserId) {
    const userId = auth.currentUser.uid

    const q = query(collection(db, "Chatroom"),
        where(`users.${userId}`, "==", true),
        where(`users.${adUserId}`, "==", true))

    const querySnapshot = await getDocs(q)

    let room
    querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
        room = { id: doc.id, ...doc.data() }
    })
    return room
}

function createChatroom(adUserId) {
    const userId = auth.currentUser.uid
    const obj = {
        users: {
            [userId]: true,
            [adUserId]: true
        },
        createdAt: Date.now()
    }
    return addDoc(collection(db, "Chatroom"), obj)
}


function sendMessageToDb(text, chatRoomId) {
    const userId = auth.currentUser.uid
    const message = { text, createdAt: new Date(Date.now()), userId: userId }
    return addDoc(collection(db, "Chatroom", `${chatRoomId}`, 'messages'), message)
}

function getRealtimeMessages(chatRoomId) {

    const q = query(collection(db, "Chatroom", `${chatRoomId}`, "messages"), orderBy("createdAt"))
    onSnapshot(q, (querySnapshot) => {

        const messages = []
        querySnapshot.forEach((doc) => {

            messages.push({ id: doc.id, ...doc.data() })
        })
        const messagesElem = document.getElementById('sentMessages')

        messagesElem.innerHTML = ''
        for (let item of messages) {

            if (item.userId == auth.currentUser.uid) {
                messagesElem.innerHTML += `<div class="txt-msg-style"><h4>${item.text}</h4></div>`
            } else {
                messagesElem.innerHTML += `<div class="txt-msg-style-left"><h4 >${item.text}</h4></div>`

            }
        }
    })
}



export {
    signInFirebase,
    signUpFirebase,
    postAdToDb,
    uploadImage,
    getAdsFromDb,
    getRealTimeAds,
    getFirebaseAd,
    createChatroom,
    checkChatroom,
    sendMessageToDb,
    getRealtimeMessages
}