const STEP_COLORS = {
  INITAL: '#6366f1',
  THINK: '#8b5cf6',
  ANALYSE: '#06b6d4',
  OUTPUT: '#10b981',
};

function PipelineMessage({ message }) {
  const color = STEP_COLORS[message.step?.toUpperCase()] ?? '#64748b';

  return (
    <div className="message assistant">
  <div className="message-content pipeline-step">
    <span
      className="step-badge"
      style={{ backgroundColor: color }}
    >
      {message.step}
    </span>

    <p>{message.content}</p>
  </div>
</div>
  );
}

function StandardMessage({ message }) {
  return (
    <div className={`message ${message.role}`}>
      <div className="message-content">
        <p>{message.content}</p>
      </div>
    </div>
  );
}

export default function MessageList({ messages, pipeline }) {
  if (messages.length === 0) {
    return (
      <div className="message-list empty">
        <p>Start a conversation with {pipeline ? 'the pipeline engineer' : 'Creative Muse'}.</p>
      </div>
    );
  }

  return (
    <div className="message-list">
      <div className="messages-container">
      {messages.map((msg, i) =>
        msg.step ? (
          <PipelineMessage key={`${msg.step}-${i}`} message={msg} />
        ) : (
          <StandardMessage key={`${msg.role}-${i}`} message={msg} />
        )
      )}
    </div>
    </div>  
  );
}
