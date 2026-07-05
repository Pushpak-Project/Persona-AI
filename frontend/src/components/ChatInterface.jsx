import MessageList from './MessageList';
import ChatInput from './ChatInput';
import { usePersona } from './PersonaSwitcher';

export default function ChatInterface() {
  const { activePersona, activePersonaId, getHistory, loading } = usePersona();

  if (loading) {
    return <div className="chat-panel empty">Loading…</div>;
  }

  if (!activePersona) {
    return <div className="chat-panel empty">No persona selected.</div>;
  }

  const messages = getHistory(activePersonaId);

  return (
    <div className="chat-panel">
  <div className="chat-header">
    <h3>{activePersona.name}</h3>
    <p>{activePersona.description}</p>
  </div>
  <MessageList
    messages={messages}
    pipeline={activePersona.pipeline}
  />
  <ChatInput />
</div>
  );
}
