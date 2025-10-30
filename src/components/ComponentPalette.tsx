import React from 'react';
import { Box, Square, Layout, Navigation, Columns, Grid3x3, List, ChevronRight, ChevronLeft } from 'lucide-react';
import { ComponentPaletteItem } from '../types';

interface ComponentPaletteProps {
  onDragStart: (type: ComponentPaletteItem['type']) => void;
  isCollapsed: boolean;
  onToggle: () => void;
}

const paletteItems: ComponentPaletteItem[] = [
  {
    type: 'container',
    label: 'Container',
    icon: 'Box',
    defaultWidth: 400,
    defaultHeight: 300,
    defaultStyles: { backgroundColor: '#f3f4f6', padding: '20px', borderRadius: '8px' }
  },
  {
    type: 'box',
    label: 'Box',
    icon: 'Square',
    defaultWidth: 200,
    defaultHeight: 150,
    defaultStyles: { backgroundColor: '#dbeafe', padding: '16px', borderRadius: '6px' }
  },
  {
    type: 'button',
    label: 'Button',
    icon: 'Square',
    defaultWidth: 120,
    defaultHeight: 40,
    defaultStyles: { backgroundColor: '#3b82f6', padding: '8px 16px', borderRadius: '6px' }
  },
  {
    type: 'header',
    label: 'Header',
    icon: 'Layout',
    defaultWidth: 800,
    defaultHeight: 80,
    defaultStyles: { backgroundColor: '#1f2937', padding: '20px', display: 'flex' }
  },
  {
    type: 'footer',
    label: 'Footer',
    icon: 'Layout',
    defaultWidth: 800,
    defaultHeight: 60,
    defaultStyles: { backgroundColor: '#374151', padding: '16px' }
  },
  {
    type: 'sidebar',
    label: 'Sidebar',
    icon: 'Navigation',
    defaultWidth: 250,
    defaultHeight: 500,
    defaultStyles: { backgroundColor: '#1e293b', padding: '20px' }
  },
  {
    type: 'nav',
    label: 'Navigation',
    icon: 'Navigation',
    defaultWidth: 600,
    defaultHeight: 50,
    defaultStyles: { backgroundColor: '#0f172a', padding: '12px', display: 'flex', gap: '16px' }
  },
  {
    type: 'flex',
    label: 'Flex Container',
    icon: 'Columns',
    defaultWidth: 400,
    defaultHeight: 200,
    defaultStyles: { backgroundColor: '#fef3c7', padding: '16px', display: 'flex', gap: '12px', flexDirection: 'row' }
  },
  {
    type: 'grid',
    label: 'Grid Container',
    icon: 'Grid3x3',
    defaultWidth: 400,
    defaultHeight: 300,
    defaultStyles: { backgroundColor: '#e9d5ff', padding: '16px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }
  },
  {
    type: 'list',
    label: 'List',
    icon: 'List',
    defaultWidth: 300,
    defaultHeight: 200,
    defaultStyles: { backgroundColor: '#fce7f3', padding: '16px' }
  }
];

const iconMap = {
  Box,
  Square,
  Layout,
  Navigation,
  Columns,
  Grid3x3,
  List
};

export const ComponentPalette: React.FC<ComponentPaletteProps> = ({ onDragStart, isCollapsed, onToggle }) => {
  return (
    <div className={`bg-gray-900 text-white transition-all duration-300 ${isCollapsed ? 'w-12' : 'w-64'} flex-shrink-0 overflow-hidden`}>
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        {!isCollapsed && <h2 className="text-lg font-semibold">Components</h2>}
        <button
          onClick={onToggle}
          className="p-1 hover:bg-gray-800 rounded"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>
      
      <div className="p-4 space-y-2">
        {paletteItems.map((item) => {
          const Icon = iconMap[item.icon as keyof typeof iconMap];
          return (
            <div
              key={item.type}
              draggable
              onDragStart={() => onDragStart(item.type)}
              className={`${isCollapsed ? 'p-2 justify-center' : 'p-3'} bg-gray-800 rounded-lg cursor-move hover:bg-gray-700 transition-colors flex items-center gap-3`}
            >
              <Icon size={20} className="flex-shrink-0" />
              {!isCollapsed && <span className="text-sm">{item.label}</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
};
