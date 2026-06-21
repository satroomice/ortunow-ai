const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

const conversation = [];

form.addEventListener('submit', async function (event) {
  event.preventDefault();

  const userMessage = input.value.trim();
  if (!userMessage) return;

  appendMessage('user', userMessage);
  input.value = '';

  conversation.push({ role: 'user', text: userMessage });

  const thinkingMessage = appendMessage('bot', 'Thinking...');

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ conversation }),
    });

    if (!response.ok) {
      throw new Error(`Server responded with status ${response.status}`);
    }

    const data = await response.json();
    const result = data && typeof data.result === 'string' ? data.result.trim() : '';

    if (!result) {
      updateMessage(thinkingMessage, 'bot', 'Sorry, no response received.');
      return;
    }

    updateMessage(thinkingMessage, 'bot', result);
    conversation.push({ role: 'model', text: result });
  } catch (error) {
    console.error('Chat request failed:', error);
    updateMessage(thinkingMessage, 'bot', 'Failed to get response from server.');
  }
});

function appendMessage(role, text) {
  const message = document.createElement('div');
  message.className = `message ${role}`;
  message.innerHTML = formatMarkdown(text);
  chatBox.appendChild(message);
  chatBox.scrollTop = chatBox.scrollHeight;
  return message;
}

function updateMessage(element, role, text) {
  if (!element) return;
  element.className = `message ${role}`;
  element.innerHTML = formatMarkdown(text);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function formatMarkdown(text) {
  const escaped = escapeHtml(text);
  const withBold = escaped.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  const withItalic = withBold.replace(/\*(?!\*)(.+?)\*(?!\*)/g, '<em>$1</em>');
  const lines = withItalic.split('\n');
  let html = '';
  let inList = false;

  for (const line of lines) {
    const trimmed = line.trim();
    const headingMatch = /^(#{1,6})\s+(.+)$/.exec(trimmed);
    const listMatch = /^\*\s+(.+)$/.exec(trimmed);

    if (headingMatch) {
      if (inList) {
        html += '</ul>';
        inList = false;
      }
      const level = Math.min(6, headingMatch[1].length);
      html += `<h${level}>${headingMatch[2]}</h${level}>`;
      continue;
    }

    if (listMatch) {
      if (!inList) {
        html += '<ul>';
        inList = true;
      }
      html += `<li>${listMatch[1]}</li>`;
      continue;
    }

    if (inList) {
      html += '</ul>';
      inList = false;
    }

    if (trimmed === '') {
      html += '<br>';
    } else {
      html += `<p>${trimmed}</p>`;
    }
  }

  if (inList) {
    html += '</ul>';
  }

  return html;
}

function escapeHtml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
