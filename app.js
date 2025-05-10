// DOM Elements
const chatDiv = document.getElementById("chat");
const nameInput = document.getElementById("name");
const messageInput = document.getElementById("message");
const sendBtn = document.getElementById("sendBtn");
const uploadBtn = document.getElementById("uploadBtn");
const imageInput = document.getElementById("imageInput");

// Load saved messages on page load
loadMessages();

// Send text message
sendBtn.addEventListener("click", () => {
  const name = nameInput.value || "Anonymous";
  const text = messageInput.value;
  if (!text.trim()) return;

  saveMessage({ name, text, timestamp: new Date().toISOString() });
  messageInput.value = "";
});

// Upload image (convert to Data URL)
uploadBtn.addEventListener("click", () => imageInput.click());
imageInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    const name = nameInput.value || "Anonymous";
    saveMessage({ 
      name, 
      image: event.target.result, 
      timestamp: new Date().toISOString() 
    });
  };
  reader.readAsDataURL(file); // Convert image to base64
});

// Save message to localStorage
function saveMessage(message) {
  const messages = JSON.parse(localStorage.getItem("chatMessages") || "[]");
  messages.push(message);
  localStorage.setItem("chatMessages", JSON.stringify(messages));
  updateChatUI(messages);
}

// Load messages from localStorage
function loadMessages() {
  const messages = JSON.parse(localStorage.getItem("chatMessages") || "[]");
  updateChatUI(messages);
}

// Display messages
function updateChatUI(messages) {
  chatDiv.innerHTML = "";
  messages.forEach((msg) => {
    const msgElement = document.createElement("div");
    msgElement.innerHTML = `
      <strong>${msg.name || "Anonymous"}:</strong>
      ${msg.image ? `<img src="${msg.image}" width="200" />` : msg.text}
      <small>${new Date(msg.timestamp).toLocaleTimeString()}</small>
      <hr>
    `;
    chatDiv.appendChild(msgElement);
  });
  chatDiv.scrollTop = chatDiv.scrollHeight; // Auto-scroll
}
