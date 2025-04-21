'use client';

import { useState } from 'react';
import { FaFileExport } from 'react-icons/fa';

const ExportWords = ({ words }) => {
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [exportFormat, setExportFormat] = useState('simple');

  const handleExport = () => {
    if (words.length === 0) {
      alert('没有可导出的单词');
      return;
    }
    
    let exportData;
    let fileName;
    let mimeType;
    
    if (exportFormat === 'simple') {
      // 简单文本格式：每行一个单词，格式：单词=含义=例句
      exportData = words.map(word => {
        return `${word.word}=${word.meaning}=${word.example || ''}`;
      }).join('\n');
      fileName = '单词列表.txt';
      mimeType = 'text/plain';
    } else {
      // JSON格式
      exportData = JSON.stringify(words, null, 2);
      fileName = 'exported_words.json';
      mimeType = 'application/json';
    }
    
    // 创建下载链接
    const blob = new Blob([exportData], { type: mimeType });
    const url = URL.createObjectURL(blob);
    
    // 创建下载链接并触发下载
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    
    // 清理
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setShowExportOptions(false);
    }, 0);
  };

  return (
    <div className="export-container">
      {!showExportOptions ? (
        <button 
          className="btn btn-accent" 
          onClick={() => setShowExportOptions(true)}
        >
          <FaFileExport /> 导出单词
        </button>
      ) : (
        <div className="export-options">
          <div className="export-format">
            <p>选择导出格式：</p>
            <div className="format-options">
              <label>
                <input 
                  type="radio" 
                  value="simple" 
                  checked={exportFormat === 'simple'} 
                  onChange={() => setExportFormat('simple')}
                />
                <span>简单文本格式 (.txt)</span>
              </label>
              <label>
                <input 
                  type="radio" 
                  value="json" 
                  checked={exportFormat === 'json'} 
                  onChange={() => setExportFormat('json')}
                />
                <span>JSON格式 (高级)</span>
              </label>
            </div>
          </div>
          <div className="export-actions">
            <button 
              className="btn btn-secondary btn-small" 
              onClick={() => setShowExportOptions(false)}
            >
              取消
            </button>
            <button 
              className="btn btn-primary btn-small" 
              onClick={handleExport}
            >
              导出
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportWords; 