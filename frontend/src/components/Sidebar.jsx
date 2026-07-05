import { usePersona } from "./PersonaSwitcher";
import ThemeToggle from "./ThemeToggle";

const PERSONA_ICONS = {
    hitesh: "☕",
    piyush: "⚙️",
  };

export default function Sidebar() {
  const {
    personas,
    activePersonaId,
    setActivePersonaId,
    activePersona,
  } = usePersona();

  return (
    <aside className="sidebar">
      <div>
        <h2 className="logo">Persona AI</h2>

        <div className="persona-list">
          {personas.map((persona) => (
            <button
              key={persona.id}
              className={`persona-card ${
                persona.id === activePersonaId ? "active" : ""
              }`}
              onClick={() => setActivePersonaId(persona.id)}
            >
                <div className="persona-name">
  <span className="persona-icon">
    {PERSONA_ICONS[persona.id] || "🤖"}
  </span>

  {persona.name}
</div>
              <div className="persona-small-desc">
                {persona.description}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="sidebar-footer">
        {activePersona && (
          <div className="current-persona">
            {activePersona.name}
          </div>
        )}

        <ThemeToggle />
      </div>
    </aside>
  );
}