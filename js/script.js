import { db } from "./firebase.js";

import {
    collection,
    addDoc,
    getDocs,
    query,
    orderBy,
    serverTimestamp,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const nameInput = document.getElementById("guest-name");
const messageInput = document.getElementById("guest-message");
const submitBtn = document.getElementById("guest-submit");
const guestbookList = document.getElementById("guestbook-list");


// 방명록 불러오기
async function loadGuestbook() {

    guestbookList.innerHTML = "";

    const q = query(
        collection(db, "guestbook"),
        orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {

    const data = doc.data();

    const date = data.createdAt?.toDate();

    let dateText = "";

    if (date) {

        dateText =
            `${date.getFullYear()}.` +
            `${String(date.getMonth() + 1).padStart(2, "0")}.` +
            `${String(date.getDate()).padStart(2, "0")} ` +
            `${String(date.getHours()).padStart(2, "0")}:` +
            `${String(date.getMinutes()).padStart(2, "0")}`;

    }

    guestbookList.innerHTML += `

        <div class="guest-card">

            <div class="guest-header">

                <strong>${escapeHtml(data.name)}</strong>

                <span class="guest-date">${dateText}</span>

            </div>

            <p>${escapeHtml(data.message)}</p>

        </div>

    `;

});

}


// 저장
submitBtn.addEventListener("click", async () => {

    const name = nameInput.value.trim();
    const message = messageInput.value.trim();

    if (!name) {

        alert("이름을 입력해주세요.");
        return;

    }

    if (!message) {

        alert("축하 메시지를 입력해주세요.");
        return;

    }

    if (name.length > 10) {

        alert("이름은 10자 이하만 가능합니다.");
        return;

    }

    if (message.length > 100) {

        alert("메시지는 100자 이하만 가능합니다.");
        return;

    }

    submitBtn.disabled = true;

    try {

        await addDoc(collection(db, "guestbook"), {

            name,
            message,
            createdAt: serverTimestamp()

        });

        nameInput.value = "";
        messageInput.value = "";

        await loadGuestbook();

        alert("축하 메시지가 등록되었습니다.");

    } catch (error) {

        console.error(error);

        alert("등록 중 오류가 발생했습니다.");

    }

    submitBtn.disabled = false;

});


// XSS 방지
function escapeHtml(text) {

    const div = document.createElement("div");

    div.innerText = text;

    return div.innerHTML;

}


loadGuestbook();

// 갤러리 더보기

const photos = document.querySelectorAll(".gallery-grid img");
const galleryBtn = document.getElementById("galleryBtn");

const initialCount = 6;

// 처음에는 6장만 표시
photos.forEach((photo,index)=>{

    if(index >= initialCount){

        photo.classList.add("hidden");

    }

});

let expanded = false;

galleryBtn.addEventListener("click", ()=>{

    expanded = !expanded;

    photos.forEach((photo,index)=>{

        if(index >= initialCount){

            if(index >= initialCount){

    if(expanded){

        photo.classList.remove("hidden");
        photo.classList.add("show");

    }else{

        photo.classList.remove("show");
        photo.classList.add("hidden");

    }

}

        }

    });

    galleryBtn.textContent = expanded ? "사진 접기" : "사진 더보기";

});

/* =====================
   Lightbox Gallery
===================== */

const galleryImages = document.querySelectorAll(".gallery-grid img");

const lightbox = document.getElementById("lightbox");

const lightboxImg = document.getElementById("lightbox-img");

const closeBtn = document.querySelector(".close");

const prevBtn = document.querySelector(".prev");

const nextBtn = document.querySelector(".next");

const counter = document.getElementById("photo-counter");

let currentIndex = 0;


// 현재 사진 표시

function showImage(index){

    lightboxImg.src = galleryImages[index].src;

    counter.innerHTML = `${index+1} / ${galleryImages.length}`;

}


// 열기

galleryImages.forEach((img,index)=>{

    img.addEventListener("click",()=>{

        currentIndex = index;

        showImage(currentIndex);

        lightbox.classList.add("show");

        document.body.style.overflow="hidden";

    });

});


// 닫기

function closeLightbox(){

    lightbox.classList.remove("show");

    document.body.style.overflow="";

}

closeBtn.addEventListener("click",closeLightbox);


// 이전

prevBtn.addEventListener("click",()=>{

    currentIndex--;

    if(currentIndex<0){

        currentIndex=galleryImages.length-1;

    }

    showImage(currentIndex);

});


// 다음

nextBtn.addEventListener("click",()=>{

    currentIndex++;

    if(currentIndex>=galleryImages.length){

        currentIndex=0;

    }

    showImage(currentIndex);

});


// 배경 클릭 닫기

lightbox.addEventListener("click",(e)=>{

    if(e.target===lightbox){

        closeLightbox();

    }

});


// 키보드

document.addEventListener("keydown",(e)=>{

    if(!lightbox.classList.contains("show")) return;

    if(e.key==="ArrowRight"){

        nextBtn.click();

    }

    if(e.key==="ArrowLeft"){

        prevBtn.click();

    }

    if(e.key==="Escape"){

        closeLightbox();

    }

});


// ======================
// 모바일 스와이프
// ======================

let touchStartX = 0;

let touchEndX = 0;

lightbox.addEventListener("touchstart",(e)=>{

    touchStartX = e.changedTouches[0].screenX;

});

lightbox.addEventListener("touchend",(e)=>{

    touchEndX = e.changedTouches[0].screenX;

    const distance = touchEndX - touchStartX;

    if(distance > 60){

        prevBtn.click();

    }

    if(distance < -60){

        nextBtn.click();

    }

});