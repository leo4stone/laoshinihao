import { useState, useEffect } from 'react'
import Papa from 'papaparse'
import WordCard from './components/WordCard'
import WordList from './components/WordList'
import './styles/App.css'

// 定义单词数据类型
interface WordData {
  word: string;
  phonetic: string;
  definition: string;
  translation: string;
  pos: string;
  collins: string;
  oxford: string;
  tag: string;
  bnc: string;
  frq: string;
  exchange: string;
  detail: string;
  audio: string;
}

function App() {
  const [words, setWords] = useState<WordData[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showTranslation, setShowTranslation] = useState(false);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/ecdict.csv');
        const csvData = await response.text();
        
        Papa.parse(csvData, {
          header: true,
          complete: (results) => {
            // 过滤掉不完整或不必要的数据
            const filteredWords = (results.data as WordData[])
              .filter(word => word.word && word.translation)
              .slice(0, 1000); // 限制词汇量以提高性能
            
            setWords(filteredWords);
            setLoading(false);
          },
          error: (error) => {
            console.error("解析CSV文件出错:", error);
            setLoading(false);
          }
        });
      } catch (error) {
        console.error("加载CSV文件出错:", error);
        setLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  const handleNext = () => {
    setShowTranslation(false);
    setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
  };
  
  const handlePrevious = () => {
    setShowTranslation(false);
    setCurrentWordIndex((prevIndex) => 
      prevIndex === 0 ? words.length - 1 : prevIndex - 1
    );
  };
  
  const toggleTranslation = () => {
    setShowTranslation(!showTranslation);
  };
  
  const selectWord = (index: number) => {
    setCurrentWordIndex(index);
    setShowTranslation(false);
  };

  return (
    <div className="app-container">
      <header>
        <h1>单词卡片</h1>
      </header>
      
      <main>
        {loading ? (
          <div className="loading">加载中...</div>
        ) : words.length > 0 ? (
          <div className="content">
            <WordCard 
              wordData={words[currentWordIndex]} 
              showTranslation={showTranslation}
              onToggleTranslation={toggleTranslation}
              onNext={handleNext}
              onPrevious={handlePrevious}
            />
            
            <WordList 
              words={words} 
              currentIndex={currentWordIndex}
              onSelectWord={selectWord}
            />
          </div>
        ) : (
          <div className="error">无法加载单词数据</div>
        )}
      </main>
      
      <footer>
        <p>学习使我快乐 © {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}

export default App; 