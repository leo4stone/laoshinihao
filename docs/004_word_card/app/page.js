'use client';

import { useState, useEffect } from 'react';
import { FaFileImport, FaFileExport } from 'react-icons/fa';
import FlashCard from './components/FlashCard';
import ControlPanel from './components/ControlPanel';
import Header from './components/Header';
import ProgressBar from './components/ProgressBar';
import ImportWords from './components/ImportWords';
import ExportWords from './components/ExportWords';
import './styles/globals.css';

export default function Home() {
  const [words, setWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showImport, setShowImport] = useState(false);

  useEffect(() => {
    // 尝试从本地存储加载单词
    const savedWords = localStorage.getItem('customWords');
    
    async function loadWords() {
      try {
        // 如果有本地存储的自定义单词，优先使用
        if (savedWords) {
          setWords(JSON.parse(savedWords));
          setIsLoading(false);
          return;
        }
        
        // 否则加载默认单词数据
        const data = await import('./data/words.json');
        setWords(data.default);
        setIsLoading(false);
      } catch (error) {
        console.error('加载单词数据失败', error);
        setIsLoading(false);
      }
    }
    
    loadWords();
  }, []);

  const handleCardFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleRandom = () => {
    const randomIndex = Math.floor(Math.random() * words.length);
    setCurrentIndex(randomIndex);
    setIsFlipped(false);
  };

  const handleImportClick = () => {
    setShowImport(true);
  };

  const handleImportClose = () => {
    setShowImport(false);
  };

  const handleImportWords = (importedWords) => {
    // 确保ID是唯一的
    const maxId = words.length > 0 ? Math.max(...words.map(word => word.id)) : 0;
    
    const processedWords = importedWords.map((word, index) => ({
      ...word,
      id: word.id || maxId + index + 1
    }));
    
    const newWords = [...words, ...processedWords];
    setWords(newWords);
    
    // 保存到本地存储
    localStorage.setItem('customWords', JSON.stringify(newWords));
    
    // 提示导入成功
    alert(`成功导入 ${processedWords.length} 个单词`);
  };

  const handleResetToDefault = async () => {
    if (confirm('确定要恢复默认单词列表吗？这将删除所有导入的自定义单词。')) {
      try {
        localStorage.removeItem('customWords');
        const data = await import('./data/words.json');
        setWords(data.default);
        setCurrentIndex(0);
        setIsFlipped(false);
      } catch (error) {
        console.error('重置单词数据失败', error);
      }
    }
  };

  if (isLoading) {
    return <div className="container">加载中...</div>;
  }

  if (words.length === 0) {
    return <div className="container">没有找到单词数据</div>;
  }

  const progress = ((currentIndex + 1) / words.length) * 100;

  return (
    <div className="container">
      <div className="action-bar">
        <div>
          <button className="btn import-btn" onClick={handleImportClick}>
            <FaFileImport /> 导入单词
          </button>
          <ExportWords words={words} />
        </div>
        {localStorage.getItem('customWords') && (
          <button className="btn btn-secondary" onClick={handleResetToDefault}>
            恢复默认单词
          </button>
        )}
      </div>

      <Header />
      
      <ProgressBar progress={progress} />
      
      <FlashCard 
        word={words[currentIndex]} 
        isFlipped={isFlipped} 
        onFlip={handleCardFlip} 
      />
      
      <ControlPanel 
        onPrevious={handlePrevious} 
        onNext={handleNext} 
        onRandom={handleRandom}
        hasPrevious={currentIndex > 0}
        hasNext={currentIndex < words.length - 1}
      />
      
      {showImport && (
        <ImportWords 
          onImport={handleImportWords} 
          onClose={handleImportClose} 
        />
      )}
    </div>
  );
} 