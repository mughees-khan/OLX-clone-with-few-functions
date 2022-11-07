import{ signInFirebase, signUpFirebase, postAdToDb,uploadImage,getRealTimeAds} from '../config/firebase.js'

getAds()
window.signUp = async function(){
    //value get
    const allInputs = document.getElementsByTagName('input')

    const email = allInputs[0].value
    const password = allInputs[1].value
    const fullName = allInputs[2].value
    const age = allInputs[3].value

    //firebase sign up func call

    try{
        await signUpFirebase({email,password,fullName,age})
        alert('registered successfully')
    }catch(e){
        const errorElem = document.getElementById('error')
        errorElem.innerHTML = e.message
    }

}

window.signIn = async function(){
    const email = document.getElementsByTagName('input')[0].value
    const password = document.getElementsByTagName('input')[1].value

 
    //firebase sign in function call

    try{
        await signInFirebase(email,password)
        window.location.href = '../index.html'
    }catch(e){
        const errorElem = document.getElementById('error')
        errorElem.innerHTML = e.message
    }
}

window.postAd =  async function(){
    const title = document.getElementById('title').value
    const price = document.getElementById('price').value

    const image = document.getElementById('image').files[0]

    try{
        const imageUrl = await uploadImage(image)
        await postAdToDb(title,price,imageUrl)
        alert('ad post successfully')
    }catch(e){
        console.log('e',e.message)
    }
    window.location.href ='../index.html'
}
function getAds(){
    //1
    getRealTimeAds((ads)=>{

        //4
        const adsElem = document.getElementById('ads')
        adsElem.innerHTML = ''
        for(let item of ads){
            adsElem.innerHTML += `<div onclick="goToDetail('${item.id}')" class="card" style="width: 18rem;">
            <img src=${item.imageUrl} class="card-img-top" alt="...">
            <div class="card-body">
              <h5 class="card-title">${item.title}</h5>
              <p class="card-text">Rs ${item.price} </p>
              <a href="#" class="btn btn-primary">Detail</a>
            </div>
            </div>`
        }
    }) 
}


window.goToDetail = async function(id){
    location.href = `view/detail.html?id=${id}`
}