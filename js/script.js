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