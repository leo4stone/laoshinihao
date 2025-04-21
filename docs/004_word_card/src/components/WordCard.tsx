import React from 'react';
import '../styles/WordCard.css';

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

interface WordCardProps {
  wordData: WordData;
  showTranslation: boolean;
  onToggleTranslation: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

const WordCard: React.FC<WordCardProps> = ({
  wordData,
  showTranslation,
  onToggleTranslation,
  onNext,
  onPrevious,
}) => {
  if (!wordData) {
    return <div className="word-card empty">没有单词数据</div>;
  }

  return (
    <div className="word-card">
      <div className="card-content">
        <div className="word-header">
          <h2 className="word">{wordData.word}</h2>
          {wordData.phonetic && (
            <div className="phonetic">/{wordData.phonetic}/</div>
          )}
        </div>
        
        <div className="word-details">
          {wordData.pos && <div className="pos">{wordData.pos}</div>}
          
          <div className="translation-container">
            {showTranslation ? (
              <div className="translation">{wordData.translation}</div>
            ) : (
              <div className="translation-hidden">
                <button onClick={onToggleTranslation}>显示翻译</button>
              </div>
            )}
          </div>
          
          {showTranslation && wordData.definition && (
            <div className="definition">{wordData.definition}</div>
          )}
        </div>
      </div>
      
      <div className="card-controls">
        <button className="nav-button prev" onClick={onPrevious}>
          上一个
        </button>
        <button className="nav-button reveal" onClick={onToggleTranslation}>
          {showTranslation ? '隐藏翻译' : '显示翻译'}
        </button>
        <button className="nav-button next" onClick={onNext}>
          下一个
        </button>
      </div>
    </div>
  );
};

export default WordCard; 