import React, { useState } from 'react';
import { ComponentPalette } from './components/ComponentPalette';
import { Canvas } from './components/Canvas';
import { CSSOutput } from './components/CSSOutput';
import { StyleEditor } from './components/StyleEditor';
import { ElementData, ComponentPaletteItem } from './types';
import { Code2, Trash2 } from 'lucide-react';

const paletteConfig: Record<ComponentPaletteItem['type'], Omit<ComponentPaletteItem, 'type' | 'label' | 'icon'>> = {
  container: {
    defaultWidth: 400,
    defaultHeight: 300,
    defaultStyles: { backgroundColor: '#f3f4f6', padding: '20px', borderRadius: '8px' }
  },
  box: {
    defaultWidth: 200,
    defaultHeight: 150,
    defaultStyles: { backgroundColor: '#dbeafe', padding: '16px', borderRadius: '6px' }
  },
  button: {
    defaultWidth: 120,
    defaultHeight: 40,
    defaultStyles: { backgroundColor: '#3b82f6', padding: '8px 16px', borderRadius: '6px' }
  },
  header: {
    defaultWidth: 800,
    defaultHeight: 80,
    defaultStyles: { backgroundColor: '#1f2937', padding: '20px', display: 'flex' }
  },
  footer: {
    defaultWidth: 800,
    defaultHeight: 60,
    defaultStyles: { backgroundColor: '#374151', padding: '16px' }
  },
  sidebar: {
    defaultWidth: 250,
    defaultHeight: 500,
    defaultStyles: { backgroundColor: '#1e293b', padding: '20px' }
  },
  nav: {
    defaultWidth: 600,
    defaultHeight: 50,
    defaultStyles: { backgroundColor: '#0f172a', padding: '12px', display: 'flex', gap: '16px' }
  },
  flex: {
    defaultWidth: 400,
    defaultHeight: 200,
    defaultStyles: { backgroundColor: '#fef3c7', padding: '16px', display: 'flex', gap: '12px', flexDirection: 'row' }
  },
  grid: {
    defaultWidth: 400,
    defaultHeight: 300,
    defaultStyles: { backgroundColor: '#e9d5ff', padding: '16px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }
  },
  list: {
    defaultWidth: 300,
    defaultHeight: 200,
    defaultStyles: { backgroundColor: '#fce7f3', padding: '16px' }
  }
};

function App() {
  const [elements, setElements] = useState<ElementData[]>([]);
  const [draggedType, setDraggedType] = useState<ComponentPaletteItem['type'] | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showCSSOutput, setShowCSSOutput] = useState(false);
  const [paletteCollapsed, setPaletteCollapsed] = useState(false);

  const handleDragStart = (type: ComponentPaletteItem['type']) => {
    setDraggedType(type);
  };

  const handleDrop = (x: number, y: number) => {
    if (!draggedType) return;

    const config = paletteConfig[draggedType];
    const newElement: ElementData = {
      id: `element-${Date.now()}`,
      type: draggedType,
      x,
      y,
      width: config.defaultWidth,
      height: config.defaultHeight,
      styles: { ...config.defaultStyles }
    };

    setElements([...elements, newElement]);
    setDraggedType(null);
  };

  const handleUpdateElement = (id: string, updates: Partial<ElementData>) => {
    setElements(elements.map(el => el.id === id ? { ...el, ...updates } : el));
  };

  const handleDeleteElement = (id: string) => {
    setElements(elements.filter(el => el.id !== id));
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear all elements?')) {
      setElements([]);
      setSelectedId(null);
    }
  };

  const selectedElement = elements.find(el => el.id === selectedId) || null;

  return (
    <div className="h-screen flex flex-col">
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Visual CSS Builder</h1>
            <p className="text-sm text-blue-100">Drag, drop, resize & generate CSS</p>
          </div>
          <div className="flex gap-3">
            {elements.length > 0 && (
              <button
                onClick={handleClearAll}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Trash2 size={18} />
                Clear All
              </button>
            )}
            <button
              onClick={() => setShowCSSOutput(true)}
              disabled={elements.length === 0}
              className="px-4 py-2 bg-white text-blue-600 hover:bg-blue-50 rounded-lg flex items-center gap-2 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Code2 size={18} />
              Get CSS ({elements.length})
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <ComponentPalette
          onDragStart={handleDragStart}
          isCollapsed={paletteCollapsed}
          onToggle={() => setPaletteCollapsed(!paletteCollapsed)}
        />
        
        <Canvas
          elements={elements}
          onDrop={handleDrop}
          onUpdateElement={handleUpdateElement}
          onDeleteElement={handleDeleteElement}
          selectedId={selectedId}
          onSelectElement={setSelectedId}
        />

        <StyleEditor
          element={selectedElement}
          onUpdate={handleUpdateElement}
        />
      </div>

      <CSSOutput
        elements={elements}
        isOpen={showCSSOutput}
        onClose={() => setShowCSSOutput(false)}
      />
    </div>
  );
}

export default App;
