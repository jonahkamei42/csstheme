import React from 'react';
import { ElementData } from '../types';
import { Palette } from 'lucide-react';

interface StyleEditorProps {
  element: ElementData | null;
  onUpdate: (id: string, updates: Partial<ElementData>) => void;
}

export const StyleEditor: React.FC<StyleEditorProps> = ({ element, onUpdate }) => {
  if (!element) {
    return (
      <div className="w-72 bg-gray-100 border-l border-gray-300 p-4">
        <div className="text-center text-gray-500 mt-8">
          <Palette size={48} className="mx-auto mb-2 opacity-50" />
          <p>Select an element to edit styles</p>
        </div>
      </div>
    );
  }

  const handleStyleChange = (property: keyof ElementData['styles'], value: string) => {
    onUpdate(element.id, {
      styles: {
        ...element.styles,
        [property]: value
      }
    });
  };

  return (
    <div className="w-72 bg-gray-100 border-l border-gray-300 overflow-auto">
      <div className="p-4 bg-gray-800 text-white">
        <h3 className="font-semibold">Style Editor</h3>
        <p className="text-sm text-gray-400 mt-1">{element.type}</p>
      </div>
      
      <div className="p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Background Color
          </label>
          <input
            type="color"
            value={element.styles.backgroundColor || '#ffffff'}
            onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
            className="w-full h-10 rounded border border-gray-300 cursor-pointer"
          />
          <input
            type="text"
            value={element.styles.backgroundColor || '#ffffff'}
            onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
            className="w-full mt-1 px-2 py-1 border border-gray-300 rounded text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Padding
          </label>
          <input
            type="text"
            value={element.styles.padding || ''}
            onChange={(e) => handleStyleChange('padding', e.target.value)}
            placeholder="e.g., 20px or 10px 20px"
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Margin
          </label>
          <input
            type="text"
            value={element.styles.margin || ''}
            onChange={(e) => handleStyleChange('margin', e.target.value)}
            placeholder="e.g., 10px"
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Border Radius
          </label>
          <input
            type="text"
            value={element.styles.borderRadius || ''}
            onChange={(e) => handleStyleChange('borderRadius', e.target.value)}
            placeholder="e.g., 8px"
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Border
          </label>
          <input
            type="text"
            value={element.styles.border || ''}
            onChange={(e) => handleStyleChange('border', e.target.value)}
            placeholder="e.g., 2px solid #000"
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
        </div>

        {(element.type === 'flex' || element.type === 'container') && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Display
              </label>
              <select
                value={element.styles.display || 'block'}
                onChange={(e) => handleStyleChange('display', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              >
                <option value="block">Block</option>
                <option value="flex">Flex</option>
                <option value="grid">Grid</option>
                <option value="inline-block">Inline Block</option>
              </select>
            </div>

            {element.styles.display === 'flex' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Flex Direction
                  </label>
                  <select
                    value={element.styles.flexDirection || 'row'}
                    onChange={(e) => handleStyleChange('flexDirection', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  >
                    <option value="row">Row</option>
                    <option value="column">Column</option>
                    <option value="row-reverse">Row Reverse</option>
                    <option value="column-reverse">Column Reverse</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gap
                  </label>
                  <input
                    type="text"
                    value={element.styles.gap || ''}
                    onChange={(e) => handleStyleChange('gap', e.target.value)}
                    placeholder="e.g., 16px"
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                </div>
              </>
            )}

            {element.styles.display === 'grid' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Grid Template Columns
                  </label>
                  <input
                    type="text"
                    value={element.styles.gridTemplateColumns || ''}
                    onChange={(e) => handleStyleChange('gridTemplateColumns', e.target.value)}
                    placeholder="e.g., repeat(3, 1fr)"
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gap
                  </label>
                  <input
                    type="text"
                    value={element.styles.gap || ''}
                    onChange={(e) => handleStyleChange('gap', e.target.value)}
                    placeholder="e.g., 16px"
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};
