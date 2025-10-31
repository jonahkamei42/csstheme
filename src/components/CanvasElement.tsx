import React, { useState, useRef, useEffect } from 'react';
import { useBuilderStore } from '../store/useBuilderStore';
import clsx from 'clsx';
import { componentsConfig } from '../store/useBuilderStore';

interface CanvasElementProps {
  id: string;
}

export const CanvasElement: React.FC<CanvasElementProps> = ({ id }) => {
  const { elements, updateElement, setSelectedId, selectedId, commitHistory } = useBuilderStore();
  const element = elements[id];
  const isSelected = selectedId === id;
  const isContainer = componentsConfig[element.type].isContainer;

  const selfRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0, elementX: 0, elementY: 0 });
  const resizeStartPos = useRef({ x: 0, y: 0, width: 0, height: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).classList.contains('resize-handle')) return;
    e.stopPropagation();
    setSelectedId(element.id);

    setIsDragging(true);
    dragStartPos.current = { x: e.clientX, y: e.clientY, elementX: element.x, elementY: element.y };
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const dx = e.clientX - dragStartPos.current.x;
      const dy = e.clientY - dragStartPos.current.y;
      updateElement(element.id, { x: dragStartPos.current.elementX + dx, y: dragStartPos.current.elementY + dy }, false);
    } else if (isResizing) {
      const dx = e.clientX - resizeStartPos.current.x;
      const dy = e.clientY - resizeStartPos.current.y;
      updateElement(element.id, {
        width: Math.max(50, resizeStartPos.current.width + dx),
        height: Math.max(30, resizeStartPos.current.height + dy),
      }, false);
    }
  };

  const handleMouseUp = () => {
    if (isDragging || isResizing) {
      commitHistory();
    }
    setIsDragging(false);
    setIsResizing(false);
  };

  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, updateElement, commitHistory]);

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
    resizeStartPos.current = { x: e.clientX, y: e.clientY, width: element.width, height: element.height };
  };

  const getElementLabel = () => element.type.charAt(0).toUpperCase() + element.type.slice(1);

  const handleDragOver = (e: React.DragEvent) => {
    if (isContainer) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    if (isContainer) {
      e.preventDefault();
      e.stopPropagation();
      const type = e.dataTransfer.getData('application/reactflow');
      if (type && selfRef.current) {
        const rect = selfRef.current.getBoundingClientRect();
        const dropX = e.clientX - rect.left;
        const dropY = e.clientY - rect.top;
        useBuilderStore.getState().addElement(type as any, { x: dropX, y: dropY }, element.id);
      }
    }
  };

  const style: React.CSSProperties = {
    ...element.styles,
    position: 'absolute',
    left: `${element.x}px`,
    top: `${element.y}px`,
    width: `${element.width}px`,
    height: `${element.height}px`,
    zIndex: element.styles.zIndex,
  };
  
  return (
    <div
      ref={selfRef}
      style={style}
      className={clsx(
        'group',
        'cursor-move',
        isSelected && 'ring-2 ring-offset-2 ring-blue-500',
      )}
      onMouseDown={handleMouseDown}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {element.children.length === 0 && (
        <div className="w-full h-full flex items-center justify-center text-gray-700 font-medium text-sm pointer-events-none select-none">
          {getElementLabel()}
        </div>
      )}
      
      {element.children.map(childId => (
        <CanvasElement key={childId} id={childId} />
      ))}

      {isSelected && (
        <>
          <div className="absolute -top-6 left-0 bg-blue-500 text-white text-xs px-2 py-1 rounded">
            {element.width} x {element.height}
          </div>
          <div
            className="resize-handle absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-se-resize"
            onMouseDown={handleResizeMouseDown}
          />
        </>
      )}
    </div>
  );
};
