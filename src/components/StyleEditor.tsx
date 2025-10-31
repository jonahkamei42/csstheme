import React, { useState, useRef } from 'react';
import { ElementData } from '../types';
import { useBuilderStore } from '../store/useBuilderStore';
import { Palette, ChevronDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';

interface StyleEditorProps {
  element: ElementData | null;
  isCollapsed: boolean;
  onToggle: () => void;
}

const StylePropertyInput: React.FC<{ label: string; value: string; placeholder?: string; onChange: (value: string) => void }> = ({ label, value, placeholder, onChange }) => (
  <div>
    <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
    <input
      type="text"
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
    />
  </div>
);

const StyleSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <details className="border-b border-gray-200" open>
    <summary className="flex justify-between items-center p-2 cursor-pointer hover:bg-gray-100">
      <h4 className="font-semibold text-sm">{title}</h4>
      <ChevronDown size={16} className="transition-transform transform details-open:rotate-180" />
    </summary>
    <div className="p-3 space-y-3 bg-white">{children}</div>
  </details>
);

export const StyleEditor: React.FC<StyleEditorProps> = ({ element, isCollapsed, onToggle }) => {
  const { updateElement } = useBuilderStore();
  const [width, setWidth] = useState(288); // Default width (w-72)
  const editorRef = useRef<HTMLDivElement>(null);

  const handleStyleChange = (property: keyof ElementData['styles'], value: string | number) => {
    if (!element) return;
    updateElement(element.id, { styles: { ...element.styles, [property]: value } });
  };
  
  const handleZIndexChange = (direction: 'up' | 'down') => {
    if (!element) return;
    const currentZ = element.styles.zIndex || 0;
    handleStyleChange('zIndex', direction === 'up' ? currentZ + 1 : Math.max(0, currentZ - 1));
  };

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!editorRef.current) return;
    const startX = e.clientX;
    const startWidth = editorRef.current.offsetWidth;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const newWidth = startWidth - (moveEvent.clientX - startX);
      if (newWidth >= 250 && newWidth <= 500) { // Min and max width
        setWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div 
      ref={editorRef}
      className={clsx('bg-gray-50 border-l border-gray-200 flex flex-col transition-[width] duration-300 flex-shrink-0 relative')}
      style={{ width: isCollapsed ? 64 : width }}
    >
      <div className={clsx(
        'p-4 bg-gray-800 text-white flex-shrink-0 flex items-center',
        isCollapsed ? 'justify-center' : 'justify-between'
      )}>
        {!isCollapsed && (
          <div>
            <h3 className="font-semibold">Style Editor</h3>
            {element && <p className="text-sm text-gray-400 mt-1 capitalize">{element.type}</p>}
          </div>
        )}
        <button
          onClick={onToggle}
          className='p-1 hover:bg-gray-700 rounded'
          title={isCollapsed ? 'Expand Editor' : 'Collapse Editor'}
        >
          {isCollapsed ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>
      
      <div className={clsx('flex-1 overflow-auto', isCollapsed && 'hidden')}>
        {!element ? (
          <div className="text-center text-gray-400 mt-8 p-4">
            <Palette size={48} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">Select an element to edit styles</p>
          </div>
        ) : (
          <>
            <StyleSection title="Layout">
              <StylePropertyInput label="Display" value={element.styles.display} onChange={v => handleStyleChange('display', v)} />
              <div className="flex items-center gap-2">
                <StylePropertyInput label="Z-Index" value={String(element.styles.zIndex || 0)} onChange={v => handleStyleChange('zIndex', parseInt(v) || 0)} />
                <button onClick={() => handleZIndexChange('up')} className="mt-5 p-2 border rounded hover:bg-gray-100" title="Bring Forward"><ArrowUp size={16}/></button>
                <button onClick={() => handleZIndexChange('down')} className="mt-5 p-2 border rounded hover:bg-gray-100" title="Send Backward"><ArrowDown size={16}/></button>
              </div>
            </StyleSection>

            {(element.styles.display === 'flex' || element.styles.display === 'grid') && (
                <StyleSection title={element.styles.display === 'flex' ? 'Flexbox' : 'Grid'}>
                    <StylePropertyInput label="Gap" value={element.styles.gap} placeholder="16px" onChange={v => handleStyleChange('gap', v)} />
                    {element.styles.display === 'flex' && (
                        <StylePropertyInput label="Direction" value={element.styles.flexDirection} placeholder="row" onChange={v => handleStyleChange('flexDirection', v)} />
                    )}
                    {element.styles.display === 'grid' && (
                        <StylePropertyInput label="Grid Columns" value={element.styles.gridTemplateColumns} placeholder="repeat(3, 1fr)" onChange={v => handleStyleChange('gridTemplateColumns', v)} />
                    )}
                </StyleSection>
            )}

            <StyleSection title="Spacing">
              <StylePropertyInput label="Padding" value={element.styles.padding} placeholder="10px 20px" onChange={v => handleStyleChange('padding', v)} />
              <StylePropertyInput label="Margin" value={element.styles.margin} placeholder="10px" onChange={v => handleStyleChange('margin', v)} />
            </StyleSection>

            <StyleSection title="Appearance">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Background Color</label>
                <input type="color" value={element.styles.backgroundColor || '#ffffff'} onChange={(e) => handleStyleChange('backgroundColor', e.target.value)} className="w-full h-8 rounded border border-gray-300 cursor-pointer" />
              </div>
              <StylePropertyInput label="Border Radius" value={element.styles.borderRadius} placeholder="8px" onChange={v => handleStyleChange('borderRadius', v)} />
              <StylePropertyInput label="Border" value={element.styles.border} placeholder="1px solid #ccc" onChange={v => handleStyleChange('border', v)} />
              <StylePropertyInput label="Box Shadow" value={element.styles.boxShadow} placeholder="0 4px 6px rgba(0,0,0,0.1)" onChange={v => handleStyleChange('boxShadow', v)} />
            </StyleSection>

            <StyleSection title="Typography">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Text Color</label>
                <input type="color" value={element.styles.color || '#000000'} onChange={(e) => handleStyleChange('color', e.target.value)} className="w-full h-8 rounded border border-gray-300 cursor-pointer" />
              </div>
              <StylePropertyInput label="Font Size" value={element.styles.fontSize} placeholder="16px" onChange={v => handleStyleChange('fontSize', v)} />
              <StylePropertyInput label="Font Weight" value={element.styles.fontWeight} placeholder="normal" onChange={v => handleStyleChange('fontWeight', v)} />
            </StyleSection>
          </>
        )}
      </div>

      {!isCollapsed && (
        <div
          onMouseDown={handleResizeMouseDown}
          className="absolute top-0 -left-1 h-full w-2 cursor-col-resize group z-20"
        >
          <div className="w-0.5 h-full bg-transparent group-hover:bg-blue-500 transition-colors duration-200" />
        </div>
      )}
    </div>
  );
};
