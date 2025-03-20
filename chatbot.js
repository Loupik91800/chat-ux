class ChatWidget {
    // Initialize the chat widget with a WebSocket URL and optional color
    static init({ serverUrl, color = "#306eb1" }) {
        if (!serverUrl) {
            console.error("ChatWidget: serverUrl is required.");
            return;
        }
        new ChatWidget(serverUrl, color);
    }

    constructor(serverUrl, color) {
        this.serverUrl = serverUrl;
        this.color = color;
        this.socket = null;
        this.initUI();
        this.connectWebSocket();
    }

    // Create and initialize the chat UI
    initUI() {
        this.widget = document.createElement("div");
        this.widget.id = "chat-widget";
        this.widget.innerHTML = `
            <style>
                /* Main chat container */
                #chat-widget {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    width: 380px;
                    background: white;
                    border: 1px solid #ddd;
                    border-radius: 10px;
                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
                    overflow: hidden;
                    font-family: 'Heebo', sans-serif;
                }
                /* Chat header styling */
                #chat-header {
                    height: 35px;
                    background: ${this.color};
                    color: white;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-weight: bold;
                    padding: 10px;
                }
                /* Chat messages container */
                #chat-messages {
                    display: flex;
                    overflow-y: auto;
                    flex-direction: column;
                    gap: 10px;
                    height: 350px;
                    padding: 10px;
                    font-size: 14px;
                }
                /* Chat input and send button container */
                #chat-send-container {
                    display: flex;
                    border-top: 1px solid #ddd;
                }
                /* Message styling */
                .message {
                    padding: 10px;
                    border-radius: 10px;
                    max-width: 70%;
                    word-wrap: break-word;
                    white-space: pre-wrap;
                }
                /* User message styling */
                .message.user {
                    background-color: ${this.color};
                    color: white;
                    align-self: flex-end;
                }
                /* Server (assistant) message styling */
                .message.server {
                    background-color: #f1f1f1;
                    color: black;
                }
                /* Chat input field styling */
                #chat-input {
                    flex: 1;
                    border: none;
                    outline: none;
                    padding: 10px;
                    font-size: 14px;
                }
                /* Send button styling */
                #send-btn {
                    border: none;
                    background: ${this.color};
                    color: white;
                    padding: 10px 15px;
                    cursor: pointer;
                }
            </style>
            <div id="chat-header">iDisco-chat</div>
            <div id="chat-messages"></div>
            <div id="chat-send-container">
                <textarea id="chat-input" placeholder="Tapez un message..."></textarea>
                <button id="send-btn">Envoyer</button>
            </div>
        `;
        document.body.appendChild(this.widget);

        // Add event listeners for message sending
        document.getElementById("send-btn").addEventListener("click", () => this.sendMessage());
        document.getElementById("chat-input").addEventListener("keypress", (event) => {
            if (event.key === "Enter") this.sendMessage();
        });
    }

    // Connect to the WebSocket server
    connectWebSocket() {
        this.socket = new WebSocket(this.serverUrl);
        this.socket.onopen = () => this.addMessage("Connecté au serveur.", "system");
        this.socket.onmessage = (event) => this.addMessage(JSON.parse(event.data).content, "server");
        this.socket.onclose = () => setTimeout(() => this.connectWebSocket(), 3000);
        this.socket.onerror = (error) => console.error("WebSocket Error:", error);
    }

    // Send a user message through WebSocket
    sendMessage() {
        const input = document.getElementById("chat-input");
        const message = input.value.trim();
        if (!message) return;
        this.addMessage(message, "user");
        this.socket.send(JSON.stringify({ content: message }));
        input.value = "";
    }

    // Add a message to the chat window
    addMessage(content, sender) {
        const messagesDiv = document.getElementById("chat-messages");
        const msgDiv = document.createElement("div");
        msgDiv.className = `message ${sender}`;
        msgDiv.innerText = content;
        messagesDiv.appendChild(msgDiv);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }
}

// Make ChatWidget globally accessible
window.ChatWidget = ChatWidget;
