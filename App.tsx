import React, { useState } from 'react';
import useLocalStorage from './hooks/useLocalStorage';
import SettingsSheet from './components/SettingsSheet';
import MagicEditor from './components/MagicEditor';
import { PenTool } from 'lucide-react';

const DEFAULT_PHRASE = "Esta es una frase de prueba. No importa qué teclas toques, esto es lo que aparecerá en la pantalla. Es perfecto para gastar una broma o hacer un truco de magia. Configura tu propio texto en el panel de abajo.";

const App: React.FC = () => {
  // Use local storage to persist the prank phrase between reloads
  const [secretPhrase, setSecretPhrase] = useLocalStorage<string>('magic-writer-phrase', DEFAULT_PHRASE);

  return (
    <div className="min-h-screen w-full bg-stone-100 text-stone-900 overflow-hidden relative font-sans">
      
      {/* Background Aesthetic */}
      <div className="absolute inset-0 z-0 opacity-50 pointer-events-none">
         <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-stone-200 rounded-full blur-3xl mix-blend-multiply filter" />
         <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-stone-300 rounded-full blur-3xl mix-blend-multiply filter" />
      </div>

      {/* Main Content */}
      <main className="relative z-10 h-screen flex flex-col">
        {/* Header */}
        <header className="p-4 md:p-6 flex items-center justify-center md:justify-start gap-3 opacity-60 hover:opacity-100 transition-opacity">
          <div className="p-2 bg-stone-900 text-white rounded-lg shadow-lg">
            <PenTool size={20} />
          </div>
          <h1 className="text-xl font-serif font-bold tracking-tight">MagicWriter</h1>
        </header>

        {/* Editor Area */}
        <div className="flex-1 overflow-hidden pb-[60px]"> {/* Padding bottom for the drag handle area */}
          <MagicEditor targetPhrase={secretPhrase} />
        </div>
      </main>

      {/* Settings Drawer (Overlay) */}
      <SettingsSheet 
        secretPhrase={secretPhrase} 
        onPhraseChange={setSecretPhrase} 
      />

    </div>
  );
};

export default App;