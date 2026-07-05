import ChatInterface from "./components/ChatInterface";
import Sidebar from "./components/Sidebar";

import {
  PersonaProvider,
} from "./components/PersonaSwitcher";

import {
  ThemeProvider,
} from "./context/ThemeContext";

export default function App() {
  return (
    <ThemeProvider>
      <PersonaProvider>
        <div className="layout">
          <Sidebar />

          <main className="chat-layout">
            <ChatInterface />
          </main>
        </div>
      </PersonaProvider>
    </ThemeProvider>
  );
}