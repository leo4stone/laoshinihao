// DOM元素
const hoursElement = document.getElementById('hours');
const minutesElement = document.getElementById('minutes');
const secondsElement = document.getElementById('seconds');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const countUpRadio = document.getElementById('countUp');
const countDownRadio = document.getElementById('countDown');
const countdownInputs = document.getElementById('countdownInputs');
const timerDisplayElement = document.querySelector('.timer-display');

// 语音控制相关元素
const toggleVoiceBtn = document.getElementById('toggleVoiceBtn');
const voiceIndicator = document.getElementById('voiceIndicator');
const voiceText = document.getElementById('voiceText');
const networkStatusText = document.getElementById('networkStatusText');

// 时间设置输入
const setHours = document.getElementById('setHours');
const setMinutes = document.getElementById('setMinutes');
const setSeconds = document.getElementById('setSeconds');

// 添加时钟元素
const hourHand = document.querySelector('.hour-hand');
const minuteHand = document.querySelector('.minute-hand');
const secondHand = document.querySelector('.second-hand');

// 计时器变量
let timerInterval;
let isRunning = false;
let isPaused = false;
let isCountUp = true;
let totalSeconds = 0;
let targetSeconds = 0;

// 语音识别相关变量
let recognition = null;
let isListening = false;
let networkErrorCount = 0;
let maxNetworkRetries = 3;
let reconnectDelay = 1000; // 初始重连延迟为1秒

// 添加事件监听器
startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);
countUpRadio.addEventListener('change', toggleTimerType);
countDownRadio.addEventListener('change', toggleTimerType);
toggleVoiceBtn.addEventListener('click', toggleVoiceRecognition);

// 网络状态监听
window.addEventListener('online', updateNetworkStatus);
window.addEventListener('offline', updateNetworkStatus);

// 初始化
toggleTimerType();
initializeSpeechRecognition();
updateNetworkStatus();
initParticles();
startClockAnimation();

// 初始化粒子效果
function initParticles() {
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            "particles": {
                "number": {
                    "value": 80,
                    "density": {
                        "enable": true,
                        "value_area": 800
                    }
                },
                "color": {
                    "value": "#4cc9f0"
                },
                "shape": {
                    "type": "circle",
                    "stroke": {
                        "width": 0,
                        "color": "#000000"
                    },
                    "polygon": {
                        "nb_sides": 5
                    }
                },
                "opacity": {
                    "value": 0.5,
                    "random": true,
                    "anim": {
                        "enable": true,
                        "speed": 1,
                        "opacity_min": 0.1,
                        "sync": false
                    }
                },
                "size": {
                    "value": 3,
                    "random": true,
                    "anim": {
                        "enable": true,
                        "speed": 2,
                        "size_min": 0.1,
                        "sync": false
                    }
                },
                "line_linked": {
                    "enable": true,
                    "distance": 150,
                    "color": "#3498db",
                    "opacity": 0.4,
                    "width": 1
                },
                "move": {
                    "enable": true,
                    "speed": 1,
                    "direction": "none",
                    "random": true,
                    "straight": false,
                    "out_mode": "out",
                    "bounce": false,
                    "attract": {
                        "enable": false,
                        "rotateX": 600,
                        "rotateY": 1200
                    }
                }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": {
                    "onhover": {
                        "enable": true,
                        "mode": "bubble"
                    },
                    "onclick": {
                        "enable": true,
                        "mode": "push"
                    },
                    "resize": true
                },
                "modes": {
                    "grab": {
                        "distance": 140,
                        "line_linked": {
                            "opacity": 1
                        }
                    },
                    "bubble": {
                        "distance": 150,
                        "size": 5,
                        "duration": 2,
                        "opacity": 8,
                        "speed": 3
                    },
                    "repulse": {
                        "distance": 100,
                        "duration": 0.4
                    },
                    "push": {
                        "particles_nb": 4
                    },
                    "remove": {
                        "particles_nb": 2
                    }
                }
            },
            "retina_detect": true
        });
    } else {
        console.warn('particles.js 未加载');
    }
}

// 启动时钟背景动画
function startClockAnimation() {
    updateClock();
    setInterval(updateClock, 1000);
}

// 更新时钟动画
function updateClock() {
    const now = new Date();
    const seconds = now.getSeconds();
    const minutes = now.getMinutes();
    const hours = now.getHours() % 12;
    
    const secondsDegrees = (seconds / 60) * 360;
    const minutesDegrees = ((minutes + seconds / 60) / 60) * 360;
    const hoursDegrees = ((hours + minutes / 60) / 12) * 360;
    
    secondHand.style.transform = `translateY(-50%) rotate(${secondsDegrees}deg)`;
    minuteHand.style.transform = `translateY(-50%) rotate(${minutesDegrees}deg)`;
    hourHand.style.transform = `translateY(-50%) rotate(${hoursDegrees}deg)`;
}

// 初始化语音识别
function initializeSpeechRecognition() {
    // 检查浏览器是否支持语音识别API
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
        // 创建SpeechRecognition对象
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        
        // 配置语音识别参数
        recognition.lang = 'zh-CN'; // 设置语言为中文
        recognition.continuous = true; // 持续监听
        recognition.interimResults = false; // 只返回最终结果
        recognition.maxAlternatives = 1;
        
        // 添加事件监听器
        recognition.onstart = function() {
            isListening = true;
            updateVoiceStatus('正在监听...', true);
            console.log('语音识别已启动');
            
            // 重置网络错误计数
            networkErrorCount = 0;
            reconnectDelay = 1000;
        };
        
        recognition.onresult = handleVoiceCommand;
        
        recognition.onerror = function(event) {
            console.error('语音识别错误:', event.error);
            
            // 不同类型的错误处理
            if (event.error === 'no-speech') {
                // 无语音输入，这是正常的，不需要显示错误
                updateVoiceStatus('正在等待语音...', true);
            } else if (event.error === 'aborted') {
                updateVoiceStatus('语音识别被中止，正在重启...', true);
            } else if (event.error === 'network') {
                // 网络错误处理
                networkErrorCount++;
                const message = `网络连接错误 (${networkErrorCount}/${maxNetworkRetries})，正在尝试重新连接...`;
                updateVoiceStatus(message, false, true);
                
                // 如果超过最大重试次数，提示用户检查网络
                if (networkErrorCount >= maxNetworkRetries) {
                    updateVoiceStatus('网络连接持续失败，请检查您的网络连接', false, true);
                    
                    // 延长重试时间，避免频繁重试占用资源
                    reconnectDelay = Math.min(reconnectDelay * 2, 10000); // 最大延迟10秒
                }
            } else {
                updateVoiceStatus('语音识别出错: ' + event.error + '，正在重启...', false, true);
            }
            
            // 关键修改：不再在错误时将isListening设为false
            // 而是保持为true，让onend事件重启识别
        };
        
        recognition.onend = function() {
            console.log('语音识别会话结束');
            
            // 如果仍应该保持监听状态，则自动重启识别
            if (isListening) {
                try {
                    // 设置短暂延迟后重启，以避免立即重启可能导致的问题
                    // 如果是网络错误，使用动态增加的延迟
                    const currentDelay = (networkErrorCount > 0) ? reconnectDelay : 300;
                    
                    setTimeout(() => {
                        if (isListening) { // 再次检查，以防在延迟期间状态改变
                            console.log(`正在重启语音识别...(延迟: ${currentDelay}ms)`);
                            updateVoiceStatus('正在重新连接语音服务...', true);
                            
                            // 尝试检测网络连接
                            checkNetworkAndRestart();
                        }
                    }, currentDelay);
                } catch (error) {
                    console.error('重启语音识别出错:', error);
                    updateVoiceStatus('重启语音识别失败，请手动重启', false, true);
                    toggleVoiceBtn.textContent = '启用语音控制';
                    isListening = false;
                }
            } else {
                updateVoiceStatus('语音控制已停用', false);
            }
        };
        
    } else {
        updateVoiceStatus('您的浏览器不支持语音识别', false, true);
        toggleVoiceBtn.disabled = true;
    }
}

// 更新网络状态显示
function updateNetworkStatus() {
    if (navigator.onLine) {
        networkStatusText.textContent = '在线';
        networkStatusText.className = 'online';
    } else {
        networkStatusText.textContent = '离线 (语音控制不可用)';
        networkStatusText.className = 'offline';
        
        // 如果正在监听，提示用户网络已断开
        if (isListening) {
            updateVoiceStatus('网络连接已断开，语音控制暂不可用', false, true);
        }
    }
}

// 检查网络连接并重启语音识别
function checkNetworkAndRestart() {
    // 更新网络状态
    updateNetworkStatus();
    
    // 检查网络连接
    if (navigator.onLine) {
        try {
            recognition.start();
            updateVoiceStatus('语音识别已重启，正在监听...', true);
        } catch (error) {
            console.error('启动语音识别出错:', error);
            updateVoiceStatus('启动语音识别失败，请刷新页面重试', false, true);
        }
    } else {
        // 网络离线，继续等待并定期检查
        updateVoiceStatus('网络连接已断开，等待恢复连接...', false, true);
        setTimeout(checkNetworkAndRestart, reconnectDelay);
    }
}

// 处理语音命令
function handleVoiceCommand(event) {
    const result = event.results[event.results.length - 1];
    const transcript = result[0].transcript.trim().toLowerCase();
    
    console.log('识别到语音:', transcript);
    updateVoiceStatus('识别到: ' + transcript, true);
    
    // 基本控制命令
    if (/^开始$|^启动$|^开始计时$/.test(transcript)) {
        startTimer();
    } else if (/^暂停$|^停止$|^暂停计时$/.test(transcript)) {
        pauseTimer();
    } else if (/^继续$|^继续计时$/.test(transcript)) {
        if (isPaused) startTimer();
    } else if (/^重置$|^重新开始$|^清零$/.test(transcript)) {
        resetTimer();
    }
    // 计时器类型切换
    else if (/^正计时$|^正向计时$|^向上计时$/.test(transcript)) {
        countUpRadio.checked = true;
        toggleTimerType();
    } else if (/^倒计时$|^倒数$|^向下计时$/.test(transcript)) {
        countDownRadio.checked = true;
        toggleTimerType();
    }
    // 设置倒计时时间
    else if (/设置.*(时间|小时|分钟|秒钟)/.test(transcript)) {
        // 切换到倒计时模式
        countDownRadio.checked = true;
        toggleTimerType();
        
        // 解析时间
        let hours = 0;
        let minutes = 0;
        let seconds = 0;
        
        // 提取小时
        const hourMatch = transcript.match(/(\d+)\s*小时/);
        if (hourMatch) {
            hours = parseInt(hourMatch[1]);
        }
        
        // 提取分钟
        const minuteMatch = transcript.match(/(\d+)\s*分钟/);
        if (minuteMatch) {
            minutes = parseInt(minuteMatch[1]);
        }
        
        // 提取秒
        const secondMatch = transcript.match(/(\d+)\s*秒/);
        if (secondMatch) {
            seconds = parseInt(secondMatch[1]);
        }
        
        // 设置时间
        if (hours > 0 || minutes > 0 || seconds > 0) {
            setHours.value = hours;
            setMinutes.value = minutes;
            setSeconds.value = seconds;
            
            updateVoiceStatus(`设置倒计时: ${hours}时 ${minutes}分 ${seconds}秒`, true);
        }
    }
}

// 更新语音状态显示
function updateVoiceStatus(message, isActive = false, isError = false) {
    voiceText.textContent = message;
    
    // 更新指示器状态
    voiceIndicator.className = '';
    if (isActive) {
        voiceIndicator.classList.add('active');
    } else if (isError) {
        voiceIndicator.classList.add('error');
    }
}

// 切换语音识别开关
function toggleVoiceRecognition() {
    if (!recognition) return;
    
    if (isListening) {
        // 停止监听
        isListening = false;
        try {
            recognition.stop();
        } catch (error) {
            console.error('停止语音识别出错:', error);
        }
        toggleVoiceBtn.textContent = '启用语音控制';
        updateVoiceStatus('语音控制已停用', false);
    } else {
        // 检查网络连接
        if (!navigator.onLine) {
            updateVoiceStatus('网络连接已断开，无法启用语音控制', false, true);
            return;
        }
        
        // 开始监听
        isListening = true;
        try {
            recognition.start();
            toggleVoiceBtn.textContent = '停用语音控制';
            updateVoiceStatus('正在监听...', true);
        } catch (error) {
            console.error('启动语音识别出错:', error);
            updateVoiceStatus('启动语音识别出错', false, true);
            isListening = false;
        }
    }
}

// 切换计时器类型
function toggleTimerType() {
    isCountUp = countUpRadio.checked;
    
    if (isCountUp) {
        countdownInputs.style.display = 'none';
    } else {
        countdownInputs.style.display = 'flex';
    }
    
    resetTimer();
}

// 开始计时器
function startTimer() {
    if (isRunning && !isPaused) return;
    
    if (!isRunning || (isRunning && isPaused)) {
        // 如果是第一次启动或者从暂停状态恢复
        if (!isRunning) {
            // 第一次启动
            if (!isCountUp) {
                // 倒计时模式，设置目标时间
                const hours = parseInt(setHours.value) || 0;
                const minutes = parseInt(setMinutes.value) || 0;
                const seconds = parseInt(setSeconds.value) || 0;
                
                targetSeconds = hours * 3600 + minutes * 60 + seconds;
                
                if (targetSeconds <= 0) {
                    alert('请设置倒计时时间！');
                    return;
                }
                
                totalSeconds = targetSeconds;
            } else {
                // 正计时，从0开始
                totalSeconds = 0;
            }
        }
        
        isRunning = true;
        isPaused = false;
        
        // 添加运行动画类
        timerDisplayElement.classList.add('running');
        timerDisplayElement.classList.remove('ending');
        
        // 更新UI
        startBtn.textContent = '继续';
        pauseBtn.disabled = false;
        
        // 禁用输入和类型切换
        setHours.disabled = true;
        setMinutes.disabled = true;
        setSeconds.disabled = true;
        countUpRadio.disabled = true;
        countDownRadio.disabled = true;
        
        // 启动计时器
        timerInterval = setInterval(updateTimer, 1000);
        updateDisplay();
    }
}

// 暂停计时器
function pauseTimer() {
    if (isRunning && !isPaused) {
        clearInterval(timerInterval);
        isPaused = true;
        pauseBtn.textContent = '已暂停';
        startBtn.textContent = '继续';
        
        // 移除运行动画类
        timerDisplayElement.classList.remove('running');
    }
}

// 重置计时器
function resetTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    isPaused = false;
    
    // 移除所有动画类
    timerDisplayElement.classList.remove('running', 'ending');
    
    if (isCountUp) {
        totalSeconds = 0;
    } else {
        // 读取输入的值
        const hours = parseInt(setHours.value) || 0;
        const minutes = parseInt(setMinutes.value) || 0;
        const seconds = parseInt(setSeconds.value) || 0;
        totalSeconds = hours * 3600 + minutes * 60 + seconds;
    }
    
    // 重置UI
    updateDisplay();
    startBtn.textContent = '开始';
    pauseBtn.textContent = '暂停';
    pauseBtn.disabled = true;
    
    // 启用输入和类型切换
    setHours.disabled = false;
    setMinutes.disabled = false;
    setSeconds.disabled = false;
    countUpRadio.disabled = false;
    countDownRadio.disabled = false;
}

// 更新计时器
function updateTimer() {
    if (isCountUp) {
        // 正计时
        totalSeconds++;
    } else {
        // 倒计时
        totalSeconds--;
        
        // 检查是否接近结束
        if (totalSeconds <= 10 && totalSeconds > 0) {
            // 添加结束动画类
            timerDisplayElement.classList.add('ending');
        }
        
        // 检查是否到零
        if (totalSeconds <= 0) {
            totalSeconds = 0;
            clearInterval(timerInterval);
            isRunning = false;
            
            // 播放完成动画
            timerDisplayElement.classList.remove('running');
            timerDisplayElement.classList.add('ending');
            
            // 播放声音提醒
            playCompletionSound();
            
            setTimeout(() => {
                alert('倒计时结束！');
                resetTimer();
            }, 500);
            
            return;
        }
    }
    
    updateDisplay();
}

// 播放完成声音
function playCompletionSound() {
    try {
        const audio = new Audio('data:audio/wav;base64,UklGRigBAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQQBAACBgIF/gnmBd4J5gnuBfYJ9gX6BfoGAgXp5fXx+f4GFiIyQkpWVlJOSkpKTlJWUlJOUlZaXmJmZmZmYl5WUk5KRkZCPkI6Ojo2Oi4qJiIeGhYSHgkVHP0VHR0JCRkpKSEhIR0dHR0dGR0dFRUVEQkFAQkRDQ0A/QUFBQkFAPz8/Pj08Ozw7PDw9PTg1MzIzMzMxMC8vLi4uLS0uLi8vMDEwMTIzMzUzMjIyMzM0NDQ0NDM0NDQ0NDQ0MzMyMjIxMTEwMDAvMC8yL0JTFxkXGRcSFBMTExMSEhIREREQERAREREREBEQEBAPDw8ODw4PDw8ODw4PDw8AAAA=');
        audio.volume = 0.7;
        audio.play();
    } catch (e) {
        console.error('无法播放声音:', e);
    }
}

// 更新显示
function updateDisplay() {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    hoursElement.textContent = formatTime(hours);
    minutesElement.textContent = formatTime(minutes);
    secondsElement.textContent = formatTime(seconds);
}

// 格式化时间，确保两位数字显示
function formatTime(time) {
    return time < 10 ? `0${time}` : time;
} 