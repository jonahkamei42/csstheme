import React, { useState } from 'react';
import { Copy, Check, Code, X } from 'lucide-react';
import { ElementData } from '../types';

interface CSSOutputProps {
  elements: ElementData[];
  isOpen: boolean;
  onClose: () => void;
}

export const CSSOutput: React.FC<CSSOutputProps> = ({ elements, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  const generateCSS = (): string => {
    let css = '/* Generated CSS */\n\n';
    
    elements.forEach((element, index) => {
      const className = `${element.type}-${index + 1}`;
      css += `.${className} {\n`;
      css += `  position: absolute;\n`;
      css += `  left: ${element.x}px;\n`;
      css += `  top: ${element.y}px;\n`;
      css += `  width: ${element.width}px;\n`;
      css += `  height: ${element.height}px;\n`;
      
      if (element.styles.backgroundColor) {
        css += `  background-color: ${element.styles.backgroundColor};\n`;
      }
      if (element.styles.padding) {
        css += `  padding: ${element.styles.padding};\n`;
      }
      if (element.styles.margin) {
        css += `  margin: ${element.styles.margin};\n`;
      }
      if (element.styles.borderRadius) {
        css += `  border-radius: ${element.styles.borderRadius};\n`;
      }
      if (element.styles.border) {
        css += `  border: ${element.styles.border};\n`;
      }
      if (element.styles.display) {
        css += `  display: ${element.styles.display};\n`;
      }
      if (element.styles.flexDirection) {
        css += `  flex-direction: ${element.styles.flexDirection};\n`;
      }
      if (element.styles.gridTemplateColumns) {
        css += `  grid-template-columns: ${element.styles.gridTemplateColumns};\n`;
      }
      if (element.styles.gap) {
        css += `  gap: ${element.styles.gap};\n`;
      }
      
      css += '}\n\n';
    });

    return css;
  };

  const generateHTML = (): string => {
    let html = '<!-- Generated HTML -->\n';
    
    elements.forEach((element, index) => {
      const className = `${element.type}-${index + 1}`;
      const tagName = element.type === 'button' ? 'button' : 'div';
      html += `<${tagName} class="${className}">${element.type.charAt(0).toUpperCase() + element.type.slice(1)}</${tagName}>\n`;
    });

    return html;
  };

  const handleCopy = () => {
    const html = generateHTML();
    const css = generateCSS();
    const fullCode = `${html}\n\n${css}`;

    const fallbackCopy = (text: string) => {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      
      // Make the textarea out of sight
      textArea.style.position = 'fixed';
      textArea.style.top = '-9999px';
      textArea.style.left = '-9999px';

      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      try {
        const successful = document.execCommand('copy');
        if (successful) {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } else {
          console.error('Fallback: Unable to copy');
          alert('Failed to copy code. Please copy it manually.');
        }
      } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
        alert('Failed to copy code. Please copy it manually.');
      }

      document.body.removeChild(textArea);
    };

    if (navigator.clipboard) {
      navigator.clipboard.writeText(fullCode).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }).catch(err => {
        console.warn('Clipboard API failed. Falling back to execCommand.', err);
        fallbackCopy(fullCode);
      });
    } else {
      fallbackCopy(fullCode);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[80vh] flex flex-col">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code size={20} />
            <h2 className="text-xl font-semibold">Generated Code</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="flex-1 overflow-auto p-4">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">HTML</h3>
            <pre className="bg-gray-50 p-4 rounded border border-gray-200 text-sm overflow-x-auto">
              <code>{generateHTML()}</code>
            </pre>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">CSS</h3>
            <pre className="bg-gray-50 p-4 rounded border border-gray-200 text-sm overflow-x-auto">
              <code>{generateCSS()}</code>
            </pre>
          </div>
        </div>
        
        <div className="p-4 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
          >
            Close
          </button>
          <button
            onClick={handleCopy}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2"
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
            {copied ? 'Copied!' : 'Copy All'}
          </button>
        </div>
      </div>
    </div>
  );
};
