import React, { useState, useRef, useEffect } from 'react';

interface MagicEditorProps {
  targetPhrase: string;
}

const MagicEditor: React.FC<MagicEditorProps> = ({ targetPhrase }) => {
  const [displayValue, setDisplayValue] = useState("");
  const [cursorIndex, setCursorIndex] = useState(0); // Tracks real length of intended input
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // If the target phrase is empty, provide a default to prevent errors
  const safeTargetPhrase = targetPhrase.length > 0 
    ? targetPhrase 
    : "La configuración está vacía. Por favor arrastra el panel inferior hacia arriba para configurar la frase.";

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    const newLength = newValue.length;
    const oldLength = displayValue.length;

    // Determine if user added or deleted content
    if (newLength > oldLength) {
      // User typed something (added)
      // We calculate the new substring of the magic phrase
      // We use modulo to loop the phrase if they type longer than the phrase
      let nextCharIndex = oldLength % safeTargetPhrase.length;
      let charToAdd = safeTargetPhrase[nextCharIndex];

      // Handle edge case: Newline characters
      // If the user presses ENTER, we usually want to respect that layout, 
      // OR we can force the magic phrase format (which might include newlines).
      // For this implementation, we rigidly follow the magic phrase.
      
      setDisplayValue(prev => prev + charToAdd);
    } else {
      // User deleted (backspace)
      // Remove the last character
      setDisplayValue(newValue);
    }
  };

  // Keep focus on the textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  return (
    <div className="w-full h-full flex flex-col items-center justify-start pt-10 px-4 md:px-0">
      <div className="w-full max-w-3xl h-[80vh] relative bg-white shadow-sm border border-stone-200 rounded-lg overflow-hidden">
        {/* Paper Header / Toolbar simulation */}
        <div className="h-12 bg-stone-50 border-b border-stone-200 flex items-center px-4 justify-between">
           <div className="flex gap-2">
             <div className="w-3 h-3 rounded-full bg-red-300"></div>
             <div className="w-3 h-3 rounded-full bg-yellow-300"></div>
             <div className="w-3 h-3 rounded-full bg-green-300"></div>
           </div>
           <span className="text-xs font-serif text-stone-400">Sin título.txt</span>
           <div className="w-8"></div>
        </div>

        {/* The actual typing area */}
        <textarea
          ref={textareaRef}
          value={displayValue}
          onChange={handleChange}
          className="w-full h-full p-6 md:p-10 resize-none outline-none font-serif text-xl md:text-2xl text-stone-800 leading-relaxed bg-transparent"
          spellCheck={false}
          placeholder="Empieza a escribir..."
        />
        
        {/* Background lines effect (optional, css driven) */}
        <div className="absolute top-12 left-0 right-0 bottom-0 pointer-events-none -z-10 opacity-10" 
             style={{ 
               backgroundImage: 'linear-gradient(#000 1px, transparent 1px)', 
               backgroundSize: '100% 2.5rem',
               backgroundPosition: '0 0.5rem'
             }} 
        />
      </div>
    </div>
  );
};

export default MagicEditor;