import React, { useState } from 'react';
import { Copy, Check, Code, X } from 'lucide-react';
import { useBuilderStore } from '../store/useBuilderStore';
import toast from 'react-hot-toast';

interface CSSOutputProps {
  isOpen: boolean;
  onClose: () => void;
}

const formatCss = (css: string) => {
  let indentLevel = 0;
  const lines = css.split('\n');
  let formatted = '';
  lines.forEach(line => {
    if (line.includes('}')) indentLevel = Math.max(0, indentLevel - 1);
    formatted += '  '.repeat(indentLevel) + line.trim() + '\n';
    if (line.includes('{')) indentLevel++;
  });
  return formatted.trim();
};

export const CSSOutput: React.FC<CSSOutputProps> = ({ isOpen, onClose }) => {
  const { elements } = useBuilderStore();
  const [copied, setCopied] = useState(false);

  const generateCode = () => {
    let css = '';
    let html = '';
    const rootElements = Object.values(elements).filter(el => !el.parentId);

    const generateElementCode = (elementId: string, indent = 0) => {
      const element = elements[elementId];
      if (!element) return;

      const className = `${element.type}-${element.id.substring(0, 4)}`;
      const indentation = '  '.repeat(indent);
      const tagName = element.type === 'button' ? 'button' : 'div';
      
      html += `${indentation}<${tagName} class="${className}">\n`;
      if (element.children.length > 0) {
        element.children.forEach(childId => generateElementCode(childId, indent + 1));
      } else {
        html += `${indentation}  ${element.type.charAt(0).toUpperCase() + element.type.slice(1)}\n`;
      }
      html += `${indentation}</${tagName}>\n`;

      css += `.${className} {\n`;
      // For nested elements, their parent will be a positioned element,
      // so their absolute positioning will be relative to the parent.
      css += `  position: absolute;\n`;
      css += `  left: ${element.x}px;\n`;
      css += `  top: ${element.y}px;\n`;
      css += `  width: ${element.width}px;\n`;
      css += `  height: ${element.height}px;\n`;
      
      Object.entries(element.styles).forEach(([key, value]) => {
        if (value) {
          const cssKey = key.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
          css += `  ${cssKey}: ${value};\n`;
        }
      });
      css += '}\n\n';
    };

    const generateRecursive = (el: typeof rootElements[0]) => {
        generateElementCode(el.id, 0);
        // We need to generate CSS for all descendants as well
        const queue = [...el.children];
        while(queue.length > 0) {
            const childId = queue.shift()!;
            const child = elements[childId];
            if (child) {
                generateElementCode(child.id);
                queue.push(...child.children);
            }
        }
    }

    // Generate code for all elements, ensuring nested ones are processed
    Object.values(elements).forEach(el => generateElementCode(el.id));


    const generateHtmlStructure = (elementId: string, indent = 0) => {
        const element = elements[elementId];
        if (!element) return '';
        
        const className = `${element.type}-${element.id.substring(0, 4)}`;
        const indentation = '  '.repeat(indent);
        const tagName = element.type === 'button' ? 'button' : 'div';
        
        let elementHtml = `${indentation}<${tagName} class="${className}">\n`;
        if (element.children.length > 0) {
            element.children.forEach(childId => {
                elementHtml += generateHtmlStructure(childId, indent + 1);
            });
        } else {
            elementHtml += `${indentation}  ${element.type.charAt(0).toUpperCase() + element.type.slice(1)}\n`;
        }
        elementHtml += `${indentation}</${tagName}>\n`;
        return elementHtml;
    };

    html = rootElements.map(el => generateHtmlStructure(el.id)).join('');


    return { html, css: formatCss(css) };
  };

  const { html, css } = generateCode();

  const handleCopy = () => {
    const fullCode = `<!-- HTML -->\n${html}\n\n/* CSS */\n<style>\n${css}\n</style>`;
    navigator.clipboard.writeText(fullCode).then(() => {
      setCopied(true);
      toast.success('Code copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => toast.error('Failed to copy code.'));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <header className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code size={20} />
            <h2 className="text-xl font-semibold">Generated Code</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full"><X size={22} /></button>
        </header>
        
        <main className="flex-1 overflow-auto p-6 grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">HTML</h3>
            <pre className="bg-gray-900 text-white p-4 rounded-lg text-sm overflow-x-auto h-[calc(100%-2rem)]"><code>{html}</code></pre>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">CSS</h3>
            <pre className="bg-gray-900 text-white p-4 rounded-lg text-sm overflow-x-auto h-[calc(100%-2rem)]"><code>{css}</code></pre>
          </div>
        </main>
        
        <footer className="p-4 border-t border-gray-200 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg">Close</button>
          <button onClick={handleCopy} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2">
            {copied ? <Check size={18} /> : <Copy size={18} />}
            {copied ? 'Copied!' : 'Copy All'}
          </button>
        </footer>
      </div>
    </div>
  );
};
