import React, { useEffect, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { ComponentPalette } from './components/ComponentPalette';
import { Canvas } from './components/Canvas';
import { CSSOutput } from './components/CSSOutput';
import { StyleEditor } from './components/StyleEditor';
import { useBuilderStore } from './store/useBuilderStore';
import { Code2, Trash2, Undo, Redo } from 'lucide-react';

function App() {
  const {
    elements,
    selectedId,
    showCSSOutput,
    setShowCSSOutput,
    clearCanvas,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useBuilderStore();
  
  const [isStyleEditorCollapsed, setStyleEditorCollapsed] = useState(true);

  const handleClearAll = () => {
    toast((t) => (
      <span className="flex items-center gap-4">
        <span>Are you sure?</span>
        <button
          onClick={() => {
            clearCanvas();
            toast.dismiss(t.id);
            toast.success('Canvas cleared!');
          }}
          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Confirm
        </button>
        <button
          onClick={() => toast.dismiss(t.id)}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          Cancel
        </button>
      </span>
    ));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z') {
          e.preventDefault();
          undo();
        } else if (e.key === 'y') {
          e.preventDefault();
          redo();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  const selectedElement = elements[selectedId] || null;

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <Toaster position="top-center" reverseOrder={false} />
      <header className="bg-gradient-to-r from-gray-800 to-gray-900 text-white px-6 py-3 shadow-lg z-20">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Visual CSS Builder</h1>
            <p className="text-sm text-gray-400">Production Edition</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={undo}
              disabled={!canUndo}
              className="p-2 hover:bg-gray-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Undo (Ctrl+Z)"
            >
              <Undo size={18} />
            </button>
            <button
              onClick={redo}
              disabled={!canRedo}
              className="p-2 hover:bg-gray-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Redo (Ctrl+Y)"
            >
              <Redo size={18} />
            </button>
            <div className="w-px h-6 bg-gray-600 mx-1"></div>
            {Object.keys(elements).length > 0 && (
              <button
                onClick={handleClearAll}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg flex items-center gap-2 transition-colors text-sm font-medium"
              >
                <Trash2 size={16} />
                Clear
              </button>
            )}
            <button
              onClick={() => setShowCSSOutput(true)}
              disabled={Object.keys(elements).length === 0}
              className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg flex items-center gap-2 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              <Code2 size={16} />
              Get Code
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <ComponentPalette />
        <Canvas />
        <StyleEditor 
          element={selectedElement} 
          isCollapsed={isStyleEditorCollapsed}
          onToggle={() => setStyleEditorCollapsed(!isStyleEditorCollapsed)}
        />
      </div>

      <CSSOutput
        isOpen={showCSSOutput}
        onClose={() => setShowCSSOutput(false)}
      />
    </div>
  );
}

export default App;
