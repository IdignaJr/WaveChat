document.addEventListener('DOMContentLoaded', () => {
    // Firebase konfigürasyonu
    const firebaseConfig = {
        apiKey: "AIzaSyBb6uSQ6ti3AMlUIHN2TaEFaXv5CjhHeV4",
        authDomain: "wavechat-d3286.firebaseapp.com",
        databaseURL: "https://wavechat-d3286-default-rtdb.firebaseio.com",
        projectId: "wavechat-d3286",
        storageBucket: "wavechat-d3286.appspot.com",
        messagingSenderId: "113730912490",
        appId: "1:113730912490:web:864204e8a2ec5a51e01793",
        measurementId: "G-QT7F2RQ976"
    };
    
    // Firebase'i başlat
    firebase.initializeApp(firebaseConfig);
    const database = firebase.database();
    const messagesRef = database.ref('messages');

    // Elementler
    const messageContainer = document.getElementById('message-container');
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');
    const usernameModal = document.getElementById('username-modal');
    const usernameInput = document.getElementById('username-input');
    const setUsernameButton = document.getElementById('set-username');
    const usernameDisplay = document.getElementById('username-display');
    const userAvatar = document.getElementById('user-avatar');

    // Kullanıcı adını kontrol et
    const savedUsername = localStorage.getItem('chat-username');
    if (!savedUsername) {
        usernameModal.style.display = 'flex';
    } else {
        usernameDisplay.textContent = savedUsername;
        userAvatar.textContent = savedUsername.charAt(0).toUpperCase();
        loadMessages();
    }

    // Kullanıcı adını ayarla - DÜZELTİLDİ
    setUsernameButton.onclick = function() {
        const username = usernameInput.value.trim();
        if (username) {
            localStorage.setItem('chat-username', username);
            usernameDisplay.textContent = username;
            userAvatar.textContent = username.charAt(0).toUpperCase();
            usernameModal.style.display = 'none';
            
            // Hoş geldin mesajı
            messagesRef.push({
                username: 'Sistem',
                text: `${username} sohbete katıldı!`,
                timestamp: firebase.database.ServerValue.TIMESTAMP,
                isSystem: true
            });
        } else {
            alert("Lütfen bir kullanıcı adı girin!");
        }
    };

    // Mesaj gönderme
    function sendMessage() {
        const message = messageInput.value.trim();
        const username = localStorage.getItem('chat-username') || 'Misafir';
        
        if (message) {
            messagesRef.push({
                username: username,
                text: message,
                timestamp: firebase.database.ServerValue.TIMESTAMP
            });
            messageInput.value = '';
        }
    }

    // Mesajları yükle
    function loadMessages() {
        messagesRef.limitToLast(100).on('child_added', (snapshot) => {
            const msg = snapshot.val();
            addMessage(msg.username, msg.text, msg.isSystem);
        });
    }
    messageInput.value = '';
    
    // Mesaj görüntüleme
    function addMessage(username, message, isSystem = false) {
        const messageElement = document.createElement('div');
        messageElement.className = 'message';
        
        const avatarElement = document.createElement('div');
        avatarElement.className = 'message-avatar';
        avatarElement.textContent = username.charAt(0).toUpperCase();
        
        const contentElement = document.createElement('div');
        contentElement.className = 'message-content';
        
        const userElement = document.createElement('div');
        userElement.className = 'message-user';
        userElement.textContent = username;
        
        const textElement = document.createElement('div');
        textElement.className = 'message-text';
        textElement.textContent = message;
        
        contentElement.appendChild(userElement);
        contentElement.appendChild(textElement);
        messageElement.appendChild(avatarElement);
        messageElement.appendChild(contentElement);
        
        if (isSystem) messageElement.style.opacity = '0.7';
        
        messageContainer.appendChild(messageElement);
        messageContainer.scrollTop = messageContainer.scrollHeight;
    }

    // Event listener'lar
    sendButton.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
        
    });
    
    // Başlangıç mesajları
    if (!savedUsername) {
        addMessage('Sistem', 'WaveChat sohbet uygulamasına hoş geldiniz!', true);
        addMessage('Sistem', 'Lütfen bir kullanıcı adı seçin', true);
    }
});