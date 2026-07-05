import { createContext, useContext, useEffect, useState } from 'react';
import { fetchPersonas } from '../api/chat';

const PersonaContext = createContext(null);

export function PersonaProvider({ children }) {
  const [personas, setPersonas] = useState([]);
  const [activePersonaId, setActivePersonaId] = useState(null);
  const [histories, setHistories] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPersonas()
      .then((list) => {
        setPersonas(list);
        if (list.length > 0) setActivePersonaId(list[0].id);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const activePersona = personas.find((p) => p.id === activePersonaId) ?? null;

  const getHistory = (personaId) => histories[personaId] ?? [];

  const setHistory = (personaId, messages) => {
    setHistories((prev) => ({ ...prev, [personaId]: messages }));
  };

  const clearHistory = (personaId) => {
    setHistories((prev) => ({ ...prev, [personaId]: [] }));
  };

  return (
    <PersonaContext.Provider
      value={{
        personas,
        activePersona,
        activePersonaId,
        setActivePersonaId,
        getHistory,
        setHistory,
        clearHistory,
        loading,
      }}
    >
      {children}
    </PersonaContext.Provider>
  );
}

export function usePersona() {
  const ctx = useContext(PersonaContext);
  if (!ctx) throw new Error('usePersona must be used within PersonaProvider');
  return ctx;
}

export default function PersonaSwitcher() {
  const { personas, activePersonaId, setActivePersonaId, activePersona, loading } = usePersona();

  if (loading) return <div className="persona-switcher loading">Loading personas…</div>;

  return (
    <div className="persona-switcher">
      <span className="label">Active persona</span>
      <div className="persona-tabs">
        {personas.map((persona) => (
          <button
            key={persona.id}
            type="button"
            className={`persona-tab ${persona.id === activePersonaId ? 'active' : ''}`}
            onClick={() => setActivePersonaId(persona.id)}
          >
            {persona.name}
          </button>
        ))}
      </div>
      {activePersona && <p className="persona-desc">{activePersona.description}</p>}
    </div>
  );
}
