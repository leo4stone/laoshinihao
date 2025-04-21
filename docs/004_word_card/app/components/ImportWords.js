'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

const ImportWords = ({ onImport, onClose }) => {
  const [importMethod, setImportMethod] = useState('simple');
  const [simpleText, setSimpleText] = useState('');
  const [tableWords, setTableWords] = useState([{ word: '', meaning: '', example: '' }]);
  const [jsonText, setJsonText] = useState('');
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        // 判断文件类型
        if (file.name.endsWith('.json')) {
          // JSON格式处理
          const jsonData = JSON.parse(event.target.result);
          setJsonText(event.target.result);
        } else {
          // 文本格式处理
          setSimpleText(event.target.result);
        }
        setError('');
      } catch (error) {
        setError('文件格式错误，请检查文件内容');
      }
    };
    
    reader.onerror = () => {
      setError('读取文件时出错');
    };
    
    reader.readAsText(file);
  };

  const handleImport = () => {
    try {
      let wordsToImport = [];

      if (importMethod === 'simple') {
        // 处理简单文本格式：每行一个单词，格式：单词=含义=例句
        if (!simpleText.trim()) {
          setError('请输入单词数据');
          return;
        }

        const lines = simpleText.split('\n').filter(line => line.trim());
        
        wordsToImport = lines.map((line, index) => {
          const parts = line.split('=');
          return {
            id: index + 1,
            word: parts[0]?.trim() || '',
            meaning: parts[1]?.trim() || '',
            example: parts[2]?.trim() || '',
            phonetic: '',
          };
        });

        // 验证至少有单词和含义
        if (wordsToImport.some(word => !word.word || !word.meaning)) {
          setError('某些行格式不正确，请确保至少包含"单词=含义"');
          return;
        }
      } else if (importMethod === 'table') {
        // 处理表格输入
        const validWords = tableWords.filter(row => row.word.trim() && row.meaning.trim());
        if (validWords.length === 0) {
          setError('请至少输入一个有效的单词和含义');
          return;
        }
        
        wordsToImport = validWords.map((row, index) => ({
          id: index + 1,
          word: row.word.trim(),
          meaning: row.meaning.trim(),
          example: row.example.trim(),
          phonetic: '',
        }));
      } else if (importMethod === 'json') {
        // JSON格式处理
        if (!jsonText.trim()) {
          setError('请输入JSON数据');
          return;
        }
        
        const jsonData = JSON.parse(jsonText);
        
        if (!Array.isArray(jsonData)) {
          setError('JSON数据必须是数组格式');
          return;
        }
        
        wordsToImport = jsonData;
      }

      onImport(wordsToImport);
      onClose();
    } catch (error) {
      setError(error.message || '数据格式错误，请检查内容');
    }
  };

  const handleAddTableRow = () => {
    setTableWords([...tableWords, { word: '', meaning: '', example: '' }]);
  };

  const handleTableChange = (index, field, value) => {
    const newWords = [...tableWords];
    newWords[index][field] = value;
    setTableWords(newWords);
  };

  const handleRemoveTableRow = (index) => {
    if (tableWords.length > 1) {
      const newWords = tableWords.filter((_, i) => i !== index);
      setTableWords(newWords);
    }
  };

  const downloadTemplate = () => {
    const templateContent = "单词=含义=例句\nserendipity=偶然发现美好事物的天赋=Meeting you was pure serendipity.";
    const blob = new Blob([templateContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = '单词导入模板.txt';
    document.body.appendChild(a);
    a.click();
    
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 0);
  };

  return (
    <motion.div
      className="import-modal"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
    >
      <div className="import-container">
        <h2>导入自定义单词</h2>
        
        <div className="import-tabs">
          <button 
            className={`tab-btn ${importMethod === 'simple' ? 'active' : ''}`}
            onClick={() => setImportMethod('simple')}
          >
            简单文本
          </button>
          <button 
            className={`tab-btn ${importMethod === 'table' ? 'active' : ''}`}
            onClick={() => setImportMethod('table')}
          >
            表格输入
          </button>
          <button 
            className={`tab-btn ${importMethod === 'json' ? 'active' : ''}`}
            onClick={() => setImportMethod('json')}
          >
            高级(JSON)
          </button>
        </div>
        
        <div className="import-content">
          {importMethod === 'simple' && (
            <div className="simple-import">
              <div className="template-section">
                <p className="template-info">
                  简单格式: 每行一个单词，格式为"单词=含义=例句"
                </p>
                <button className="btn btn-small" onClick={downloadTemplate}>
                  下载模板
                </button>
              </div>
              
              <div className="file-upload">
                <label className="file-label">
                  选择文本文件
                  <input 
                    type="file" 
                    accept=".txt,.text" 
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                  />
                </label>
                {fileName && <p className="file-name">已选择: {fileName}</p>}
              </div>
              
              <p className="or-divider">- 或者 -</p>
              
              <textarea
                className="simple-textarea"
                placeholder="直接输入单词数据，每行一个，格式：单词=含义=例句"
                value={simpleText}
                onChange={(e) => setSimpleText(e.target.value)}
                rows={10}
              />
            </div>
          )}
          
          {importMethod === 'table' && (
            <div className="table-import">
              <div className="table-form">
                {tableWords.map((row, index) => (
                  <div key={index} className="table-row">
                    <input
                      type="text"
                      placeholder="单词"
                      value={row.word}
                      onChange={(e) => handleTableChange(index, 'word', e.target.value)}
                      className="table-input"
                    />
                    <input
                      type="text"
                      placeholder="含义"
                      value={row.meaning}
                      onChange={(e) => handleTableChange(index, 'meaning', e.target.value)}
                      className="table-input"
                    />
                    <input
                      type="text"
                      placeholder="例句 (可选)"
                      value={row.example}
                      onChange={(e) => handleTableChange(index, 'example', e.target.value)}
                      className="table-input"
                    />
                    <button 
                      className="btn-icon" 
                      onClick={() => handleRemoveTableRow(index)}
                      disabled={tableWords.length <= 1}
                    >
                      X
                    </button>
                  </div>
                ))}
                <button className="btn btn-small" onClick={handleAddTableRow}>
                  添加一行
                </button>
              </div>
            </div>
          )}
          
          {importMethod === 'json' && (
            <div className="json-import">
              <p className="advanced-info">
                高级用户: 请输入JSON格式的单词数据
              </p>
              <textarea
                className="json-textarea"
                placeholder="请输入JSON格式的单词数据数组..."
                value={jsonText}
                onChange={(e) => setJsonText(e.target.value)}
                rows={10}
              />
              <div className="example-format">
                <h3>JSON格式示例：</h3>
                <pre>
{`[
  {
    "id": 1,
    "word": "单词",
    "meaning": "含义",
    "example": "例句"
  }
]`}
                </pre>
              </div>
            </div>
          )}
          
          {error && <p className="error-message">{error}</p>}
          
          <div className="import-actions">
            <button className="btn btn-secondary" onClick={onClose}>
              取消
            </button>
            <button className="btn btn-primary" onClick={handleImport}>
              导入
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ImportWords; 