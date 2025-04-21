'use client';

import { FaArrowLeft, FaArrowRight, FaRandom } from 'react-icons/fa';

const ControlPanel = ({ onPrevious, onNext, onRandom, hasPrevious, hasNext }) => {
  return (
    <div className="controls">
      <button 
        className="btn btn-secondary" 
        onClick={onPrevious}
        disabled={!hasPrevious}
        style={{ opacity: hasPrevious ? 1 : 0.5 }}
      >
        <FaArrowLeft /> 上一个
      </button>
      
      <button className="btn btn-accent" onClick={onRandom}>
        <FaRandom /> 随机
      </button>
      
      <button 
        className="btn btn-primary" 
        onClick={onNext}
        disabled={!hasNext}
        style={{ opacity: hasNext ? 1 : 0.5 }}
      >
        下一个 <FaArrowRight />
      </button>
    </div>
  );
};

export default ControlPanel; 