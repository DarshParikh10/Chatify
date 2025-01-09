// Selectors
const sendButton = document.getElementById('sendButton');
const emojiPickerButton = document.getElementById('emojiPicker');
const gifPickerButton = document.getElementById('gifPicker');
const messageInput = document.getElementById('messageInput');
const mediaInput = document.getElementById('mediaInput');
const uploadButton = document.getElementById('uploadButton');
const chatBody = document.getElementById('chatBody');
const themeToggle = document.getElementById('themeToggle');
const gifContainer = document.getElementById('gifContainer');

// Giphy API Key (Replace with your Giphy API Key)
const API_KEY = 'YOUR_GIPHY_API_KEY';

// Event Listeners
sendButton.addEventListener('click', sendMessage);
emojiPickerButton.addEventListener('click', openEmojiPicker);
gifPickerButton.addEventListener('click', toggleGifPicker);
uploadButton.addEventListener('click', () => mediaInput.click());
mediaInput.addEventListener('change', handleMediaUpload);
messageInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendMessage();
});

// Functions
function sendMessage() {
    const messageText = messageInput.value.trim();

    if (messageText) {
        // Create a new message element
        const message = document.createElement('div');
        message.classList.add('message', 'sent');
        message.innerHTML = `<p>${messageText}</p><span class="timestamp">${getTime()}</span>`;

        // Append message to chat body
        chatBody.appendChild(message);

        // Clear input field
        messageInput.value = '';

        // Scroll to the bottom
        chatBody.scrollTop = chatBody.scrollHeight;
    }
}

function openEmojiPicker() {
    // Simple Emoji Picker Implementation
    const emojis = ['😀', '😂', '😍', '👍', '🎉', '🙌', '🙏', '❤️'];
    const emojiMenu = document.createElement('div');
    emojiMenu.classList.add('emoji-menu');
    emojiMenu.style.position = 'absolute';
    emojiMenu.style.bottom = '60px';
    emojiMenu.style.background = 'var(--chat-bg)';
    emojiMenu.style.padding = '10px';
    emojiMenu.style.borderRadius = '5px';
    emojiMenu.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
    emojiMenu.style.display = 'flex';
    emojiMenu.style.gap = '10px';
    emojiMenu.style.zIndex = '1000';

    emojis.forEach(emoji => {
        const emojiButton = document.createElement('button');
        emojiButton.innerText = emoji;
        emojiButton.style.background = 'none';
        emojiButton.style.border = 'none';
        emojiButton.style.fontSize = '1.5rem';
        emojiButton.style.cursor = 'pointer';
        emojiButton.addEventListener('click', () => {
            messageInput.value += emoji;
            document.body.removeChild(emojiMenu);
        });
        emojiMenu.appendChild(emojiButton);
    });

    document.body.appendChild(emojiMenu);

    // Close emoji menu on outside click
    document.addEventListener(
        'click',
        e => {
            if (!emojiMenu.contains(e.target) && e.target !== emojiPickerButton) {
                document.body.removeChild(emojiMenu);
            }
        },
        { once: true }
    );
}

function toggleGifPicker() {
    if (gifContainer.classList.contains('hidden')) {
        fetchTrendingGifs();
    } else {
        gifContainer.classList.add('hidden');
    }
}

async function fetchTrendingGifs() {
    gifContainer.innerHTML = '<p>Loading...</p>';
    gifContainer.classList.remove('hidden');

    try {
        const response = await fetch(
            `https://api.giphy.com/v1/gifs/trending?api_key=${API_KEY}&limit=20`
        );
        const data = await response.json();
        displayGifs(data.data);
    } catch (error) {
        console.error('Error fetching trending GIFs:', error);
        gifContainer.innerHTML = '<p>Failed to load GIFs. Try again later.</p>';
    }
}

function displayGifs(gifs) {
    gifContainer.innerHTML = '';
    gifs.forEach(gif => {
        const gifElement = document.createElement('img');
        gifElement.src = gif.images.fixed_width.url;
        gifElement.alt = gif.title;
        gifElement.addEventListener('click', () => sendGif(gifElement.src));
        gifContainer.appendChild(gifElement);
    });
}

function sendGif(gifUrl) {
    const message = document.createElement('div');
    message.classList.add('message', 'sent');

    const gif = document.createElement('img');
    gif.src = gifUrl;
    gif.alt = 'GIF';
    message.appendChild(gif);

    message.innerHTML += `<span class="timestamp">${getTime()}</span>`;
    chatBody.appendChild(message);

    chatBody.scrollTop = chatBody.scrollHeight;
    gifContainer.classList.add('hidden');
}

function handleMediaUpload(event) {
    const file = event.target.files[0];

    if (file) {
        const message = document.createElement('div');
        message.classList.add('message', 'sent');

        if (file.type.startsWith('image/')) {
            const img = document.createElement('img');
            img.src = URL.createObjectURL(file);
            img.alt = 'Uploaded Image';
            message.appendChild(img);
        } else if (file.type.startsWith('video/')) {
            const video = document.createElement('video');
            video.src = URL.createObjectURL(file);
            video.controls = true;
            message.appendChild(video);
        } else if (file.type === 'image/gif') {
            const gif = document.createElement('img');
            gif.src = URL.createObjectURL(file);
            gif.alt = 'Uploaded GIF';
            message.appendChild(gif);
        }

        message.innerHTML += `<span class="timestamp">${getTime()}</span>`;
        chatBody.appendChild(message);
        chatBody.scrollTop = chatBody.scrollHeight;

        // Clear file input
        mediaInput.value = '';
    }
}

function getTime() {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
