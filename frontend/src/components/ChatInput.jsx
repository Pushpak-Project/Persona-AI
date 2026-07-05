import { useState } from 'react';
import { sendChatMessage } from '../api/chat';
import { usePersona } from './PersonaSwitcher';

function buildApiMessages(displayMessages) {
  const apiMessages = [];
  let pipelineSteps = [];

  const flushPipeline = () => {
    if (pipelineSteps.length === 0) return;
    apiMessages.push({
      role: 'assistant',
      content: pipelineSteps.map((s) => `[${s.step}] ${s.content}`).join('\n'),
    });
    pipelineSteps = [];
  };

  for (const msg of displayMessages) {
    if (msg.role === 'user') {
      flushPipeline();
      apiMessages.push({ role: 'user', content: msg.content });
    } else if (msg.step) {
      pipelineSteps.push(msg);
    } else if (msg.role === 'assistant') {
      flushPipeline();
      apiMessages.push({ role: 'assistant', content: msg.content });
    }
  }

  return apiMessages;
}

export default function ChatInput() {
  const { activePersonaId, activePersona, getHistory, setHistory, clearHistory } = usePersona();
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text || sending || !activePersonaId) return;

    setError(null);
    setSending(true);
    setInput('');

    const prior = getHistory(activePersonaId);
    const apiMessages = buildApiMessages(prior);

    const userMessage = { role: 'user', content: text };
    const optimistic = [...prior, userMessage];
    setHistory(activePersonaId, optimistic);

    try {
      const result = await sendChatMessage(activePersonaId, [...apiMessages, userMessage]);

      if (activePersona?.pipeline) {
        const withSteps = [...optimistic, ...result.messages];
        setHistory(activePersonaId, withSteps);
      } else {
        setHistory(activePersonaId, [...optimistic, ...result.messages]);
      }
    } catch (err) {
      setError(err.message);
      setHistory(activePersonaId, prior);
    } finally {
      setSending(false);
    }
  }

  return (
      <div className="chat-input-area">
        {error && <p className="error-banner">{error}</p>}
    
        <form className="chat-input-form" onSubmit={handleSubmit}>
          <div className="chat-composer">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Message ${activePersona?.name ?? "persona"}...`}
              disabled={sending}
              rows={1}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
    
            <div className="composer-actions">
              <button
                type="button"
                className="clear-btn"
                onClick={() => clearHistory(activePersonaId)}
                disabled={sending}
              >
                Clear
              </button>
    
              <button
                type="submit"
                className="send-btn"
                disabled={sending || !input.trim()}
              >
                ↑
              </button>
            </div>
          </div>
        </form>
      </div>
  );
}
