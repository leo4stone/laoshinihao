'use client';

import { motion } from 'framer-motion';
import { FaVolumeUp } from 'react-icons/fa';
import { useState, useEffect } from 'react';

const FlashCard = ({ word, isFlipped, onFlip }) => {
  const [voices, setVoices] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // 获取可用的语音列表
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    // 确保语音已加载
    if (window.speechSynthesis) {
      loadVoices();
      // Chrome有时需要等待声音加载
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    // 组件卸载时清理
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speakWord = (text) => {
    if (!window.speechSynthesis) {
      console.error('浏览器不支持语音合成功能');
      return;
    }

    // 如果有正在播放的，先停止
    window.speechSynthesis.cancel();

    // 创建语音请求
    const utterance = new SpeechSynthesisUtterance(text);
    
    // 尝试找到英语声音
    const englishVoice = voices.find(voice => 
      voice.lang.includes('en-') && voice.name.includes('Female')
    ) || voices.find(voice => 
      voice.lang.includes('en-')
    );

    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    // 设置语速和音调
    utterance.rate = 0.9; // 稍微慢一点
    utterance.pitch = 1;

    // 开始和结束事件
    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    // 播放语音
    window.speechSynthesis.speak(utterance);
  };

  if (!word) {
    return <div>没有单词数据</div>;
  }

  return (
    <div className={`flashcard ${isFlipped ? 'flipped' : ''}`} onClick={onFlip}>
      <div className="flashcard-inner">
        <div className="flashcard-front">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="word">{word.word}</h2>
            <p className="phonetic">{word.phonetic}</p>
            <button 
              className="pronunciation-btn"
              onClick={(e) => {
                e.stopPropagation(); // 阻止冒泡，避免触发翻转
                speakWord(word.word);
              }}
              disabled={isPlaying}
            >
              <FaVolumeUp 
                size={22} 
                className={isPlaying ? 'pulse' : ''} 
              />
            </button>
          </motion.div>
        </div>
        
        <div className="flashcard-back">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="meaning">{word.meaning}</h3>
            <p className="example">{word.example}</p>
            
            <div className="media-section">
              {word.image && (
                <div className="image-container">
                  {/* 图片将在实际应用中显示 */}
                  <p>相关图片将在这里显示</p>
                </div>
              )}
              
              {word.movieClip && (
                <p className="movie-clip">
                  <strong>影视片段:</strong> {word.movieClip}
                </p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default FlashCard; 