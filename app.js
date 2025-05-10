// Firebase Config (replace with yours!)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_BUCKET.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();

// DOM Elements
const chatDiv = document.getElementById("chat");
const nameInput = document.getElementById("name");
const messageInput = document.getElementById("message");
const imageInput = document.getElementById("imageInput");

// Listen for new messages (real-time!)
db.collection("messages")
  .orderBy("timestamp", "desc")
  .limit(50)
  .onSnapshot((snapshot) => {
    chatDiv.innerHTML = "";
    snapshot.forEach((doc) => {
      const msg = doc.data();
      const msgElement = document.createElement("div");
      msgElement.innerHTML = `
        <strong>${msg.name || "Anonymous"}:</strong>
        ${msg.image ? `<img src="${msg.image}" />` : msg.text}
        <small>${msg.timestamp?.toDate().toLocaleTimeString()}</small>
        <hr>
      `;
      chatDiv.appendChild(msgElement);
    });
  });

// Send a text message
function sendMessage() {
  const name = nameInput.value || "Anonymous";
  const text = messageInput.value;
  if (!text.trim()) return;

  db.collection("messages").add({
    name,
    text,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  });

  messageInput.value = "";
}

// Upload an image
function uploadImage() {
  imageInput.click();
  imageInput.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const name = nameInput.value || "Anonymous";
    const storageRef = storage.ref(`images/${file.name + Date.now()}`);
    await storageRef.put(file);
    const imageUrl = await storageRef.getDownloadURL();

    db.collection("messages").add({
      name,
      image: imageUrl,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
  };
}
