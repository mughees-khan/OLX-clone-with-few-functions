import {getFirebaseAd,createChatroom,checkChatroom, sendMessageToDb, getRealtimeMessages} from "../config/firebase.js"

let data
getAdDetail()

async function getAdDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id')

    const doc = await getFirebaseAd(id)
    data = doc.data()

    const adElem = document.getElementById('detail')

            adElem.innerHTML = `
            <div class ="detail-ad">
                <div class="detail-card" >
                   <img src=${data.imageUrl} class="det-img" />
                   <h1 class="tile">${data.title}</h1>
    
                 </div>
                 <div class="det-left-side">
                     <h1>Rs ${data.price} </h1>
                    
                 </div>
            </div>
            
            ` 
}
window.initiateChat = async function () {
    console.log('userId ===>', data.userId)
    //1. check if chatroom exists
    let chatroom = await checkChatroom(data.userId)

    //2. if not exists then create it
    if (!chatroom) {
        chatroom = await createChatroom(data.userId)
        alert('chatroom created successfully')
    } else {
        alert('chatroom exists')
    }
    const chatId = chatroom.id

    location.href = `chat.html?id=${chatId}`

}





    
const urlParams = new URLSearchParams(window.location.search);
const chatRoomId = urlParams.get('id')
console.log('chatroom ID', chatRoomId)

window.sendMessage = async function () {

    
const urlParams = new URLSearchParams(window.location.search);
const chatRoomId = urlParams.get('id')
console.log('chatroom ID', chatRoomId)

    const message = document.getElementById('message').value
    try {
        await sendMessageToDb(message, chatRoomId)
    } catch (e) {
        console.log('e', e.message)
    }
    getRealtimeMessages(chatRoomId)
}

getRealtimeMessages(chatRoomId)