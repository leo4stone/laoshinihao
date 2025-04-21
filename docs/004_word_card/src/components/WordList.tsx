import React from 'react';
import '../styles/WordList.css';

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

interface WordListProps {
  words: WordData[];
  currentIndex: number;
  onSelectWord: (index: number) => void;
}

const WordList: React.FC<WordListProps> = ({ words, currentIndex, onSelectWord }) => {
  return (
    <div className="word-list">
      <h3>单词列表</h3>
      <div className="list-container">
        {words.map((word, index) => (
          <div
            key={index}
            className={`word-item ${index === currentIndex ? 'active' : ''}`}
            onClick={() => onSelectWord(index)}
          >
            <span className="word-text">{word.word}</span>
            {index === currentIndex && <span className="current-indicator">➤</span>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WordList; 