import React, { useState, useRef } from 'react';
import { Box, Square, Layout, Navigation, Columns, Grid3x3, List, ChevronRight, ChevronLeft } from 'lucide-react';
import { ComponentPaletteItem } from '../types';
import clsx from 'clsx';

interface ComponentPaletteProps {}

const paletteItems: ComponentPaletteItem[] = [
  { type: 'container', label: 'Container', icon: 'Box' },
  { type: 'flex', label: 'Flex', icon: 'Columns' },
  { type: 'grid', label: 'Grid', icon: 'Grid3x3' },
  { type: 'box', label: 'Box', icon: 'Square' },
  { type: 'button', label: 'Button', icon: 'Square' },
  { type: 'header', label: 'Header', icon: 'Layout' },
  { type: 'footer', label: 'Footer', icon: 'Layout' },
  { type: 'sidebar', label: 'Sidebar', icon: 'Navigation' },
  { type: 'nav', label: 'Navigation', icon: 'Navigation' },
  { type: 'list', label: 'List', icon: 'List' },
];

const iconMap = { Box, Square, Layout, Navigation, Columns, Grid3x3, List };

export const ComponentPalette: React.FC<ComponentPaletteProps> = () => {
  const [isCollapsed, setCollapsed] = useState(false);
  const [width, setWidth] = useState(240); // Default width (corresponds to w-60)
  const sidebarRef = useRef<HTMLDivElement>(null);

  const handleDragStart = (e: React.DragEvent, type: ComponentPaletteItem['type']) => {
    e.dataTransfer.setData('application/reactflow', type);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = sidebarRef.current!.offsetWidth;

    const handleMouseMove = (e: MouseEvent) => {
      const newWidth = startWidth + (e.clientX - startX);
      if (newWidth >= 180 && newWidth <= 500) { // Min and max width constraints
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

  const toggleCollapse = () => {
    setCollapsed(prev => !prev);
  };

  return (
    <div
      ref={sidebarRef}
      className="bg-gray-900 text-white transition-[width] duration-300 ease-in-out flex-shrink-0 flex flex-col relative"
      style={{ width: isCollapsed ? 64 : width }}
    >
      <div className="p-4 border-b border-gray-700 flex items-center justify-between sticky top-0 bg-gray-900 z-10">
        {!isCollapsed && <h2 className="text-lg font-semibold">Components</h2>}
        <button
          onClick={toggleCollapse}
          className="p-1 hover:bg-gray-800 rounded"
          title={isCollapsed ? 'Expand Palette' : 'Collapse Palette'}
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>
      
      <div className="flex-1 p-2 space-y-2 overflow-y-auto">
        {paletteItems.map((item) => {
          const Icon = iconMap[item.icon as keyof typeof iconMap];
          return (
            <div
              key={item.type}
              draggable
              onDragStart={(e) => handleDragStart(e, item.type)}
              className={clsx(
                'bg-gray-800 rounded-lg cursor-move hover:bg-blue-600 transition-colors flex items-center gap-3 group',
                isCollapsed ? 'p-3 justify-center' : 'p-3'
              )}
              title={isCollapsed ? item.label : ''}
            >
              <Icon size={20} className="flex-shrink-0" />
              {!isCollapsed && <span className="text-sm whitespace-nowrap">{item.label}</span>}
            </div>
          );
        })}
      </div>

      {!isCollapsed && (
        <div
          onMouseDown={handleResizeMouseDown}
          className="absolute top-0 -right-1 h-full w-2 cursor-col-resize group z-20"
        >
          <div className="w-0.5 h-full bg-transparent group-hover:bg-blue-500 transition-colors duration-200" />
        </div>
      )}
    </div>
  );
};
