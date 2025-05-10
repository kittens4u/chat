// ... (keep existing Firebase config code)

// Listen for new messages
db.collection("messages")
  .orderBy("timestamp", "desc")
  .limit(50)
  .onSnapshot((snapshot) => {
    const messages = [];
    snapshot.forEach((doc) => {
      messages.push(doc.data());
    });
    
    // Save to localStorage
    localStorage.setItem("cachedMessages", JSON.stringify(messages));
    
    // Display messages
    updateChatUI(messages);
  });

// Display messages from cache on page load
window.addEventListener("load", () => {
  const cachedMessages = localStorage.getItem("cachedMessages");
  if (cachedMessages) {
    updateChatUI(JSON.parse(cachedMessages));
  }
});

// Helper function to render messages
function updateChatUI(messages) {
  chatDiv.innerHTML = "";
  messages.forEach((msg) => {
    const msgElement = document.createElement("div");
    msgElement.innerHTML = `
      <strong>${msg.name || "Anonymous"}:</strong>
      ${msg.image ? `<img src="${msg.image}" />` : msg.text}
      <small>${msg.timestamp?.toDate().toLocaleTimeString()}</small>
      <hr>
    `;
    chatDiv.appendChild(msgElement);
  });
}
