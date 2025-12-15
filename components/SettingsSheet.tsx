import React, { useState, useEffect } from 'react';
import { motion, useAnimation, PanInfo, useDragControls } from 'framer-motion';
import { ChevronUp } from 'lucide-react';

interface SettingsSheetProps {
  secretPhrase: string;
  onPhraseChange: (newPhrase: string) => void;
}

const SettingsSheet: React.FC<SettingsSheetProps> = ({ secretPhrase, onPhraseChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const controls = useAnimation();
  const dragControls = useDragControls();

  // Screen height detection for drag limits
  const [windowHeight, setWindowHeight] = useState(0);

  useEffect(() => {
    setWindowHeight(window.innerHeight);
    const handleResize = () => setWindowHeight(window.innerHeight);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 100; // Pixels to drag to trigger change
    const velocityThreshold = 500;

    if (info.offset.y < -threshold || info.velocity.y < -velocityThreshold) {
      // Dragged up significantly
      setIsOpen(true);
      controls.start({ y: 0 });
    } else if (info.offset.y > threshold || info.velocity.y > velocityThreshold) {
      // Dragged down
      setIsOpen(false);
      controls.start({ y: "calc(100% - 60px)" }); // Keep handle visible
    } else {
      // Snap back to current state
      if (isOpen) {
        controls.start({ y: 0 });
      } else {
        controls.start({ y: "calc(100% - 60px)" });
      }
    }
  };

  // Initial position
  useEffect(() => {
    controls.start({ y: "calc(100% - 60px)" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      drag="y"
      dragControls={dragControls}
      dragConstraints={{ top: 0, bottom: windowHeight - 60 }}
      dragElastic={0.1}
      dragMomentum={false}
      onDragEnd={handleDragEnd}
      animate={controls}
      initial={{ y: "calc(100% - 60px)" }}
      className="fixed bottom-0 left-0 right-0 z-50 h-[85vh] bg-white rounded-t-3xl shadow-[0_-5px_20px_rgba(0,0,0,0.1)] border-t border-stone-200 flex flex-col"
    >
      {/* Handle Area - Always Visible at bottom when closed */}
      <div 
        className="h-[60px] w-full flex items-center justify-center cursor-grab active:cursor-grabbing shrink-0 touch-none"
        onPointerDown={(e) => dragControls.start(e)}
      >
        <div className="flex flex-col items-center gap-1">
          <div className="w-12 h-1.5 bg-stone-300 rounded-full" />
          <div className="flex items-center text-xs text-stone-400 uppercase tracking-widest font-semibold gap-1">
            <ChevronUp size={14} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            <span>Propiedades</span>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-6 overflow-y-auto bg-stone-50">
        <div className="max-w-md mx-auto space-y-8">
          
          <div className="text-center mb-8">
            <h2 className="text-2xl font-serif text-stone-800 font-bold">Configuración</h2>
            <p className="text-stone-500 text-sm mt-2">
              Define lo que quieres que se escriba automáticamente.
            </p>
          </div>

          <div className="space-y-4">
            <label htmlFor="phrase" className="block text-sm font-medium text-stone-700">
              Frase Secreta
            </label>
            <textarea
              id="phrase"
              rows={6}
              className="w-full p-4 rounded-xl border border-stone-300 bg-white text-stone-800 focus:ring-2 focus:ring-stone-400 focus:border-transparent outline-none transition-all resize-none shadow-sm"
              placeholder="Escribe aquí la frase que aparecerá..."
              value={secretPhrase}
              onChange={(e) => onPhraseChange(e.target.value)}
            />
            <p className="text-xs text-stone-400 italic">
              * Cuando escribas en el bloc de notas, esta frase aparecerá letra por letra, sin importar qué teclas presiones.
            </p>
          </div>

          <div className="pt-6 border-t border-stone-200">
             <button 
               onClick={() => {
                 setIsOpen(false);
                 controls.start({ y: "calc(100% - 60px)" });
               }}
               className="w-full py-3 bg-stone-900 text-white rounded-xl font-medium hover:bg-stone-800 transition-colors shadow-lg active:scale-95 transform duration-150"
             >
               Guardar y Cerrar
             </button>
          </div>

        </div>
      </div>
    </motion.div>
  );
};

export default SettingsSheet;