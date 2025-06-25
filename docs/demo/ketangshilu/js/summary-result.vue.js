// 总结结果窗口组件
export const SummaryResult = {
    props: {
        transparent: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {}
    },
    methods: {
        copyContent() {
            const content = this.$refs.summaryContent.innerText;
            navigator.clipboard.writeText(content).then(() => {
                // 可以添加复制成功提示
                console.log('内容已复制到剪贴板');
            }).catch(err => {
                console.error('复制失败:', err);
            });
        },
        
        closeWindow() {
            // 关闭窗口的逻辑
            console.log('关闭总结窗口');
        }
    },
    template: `
        <div class="summary-result" :class="{ 'transparent-mode': transparent }">
            <div class="summary-window">
                <div v-if="!transparent" class="window-header">
                    <h3 class="window-title">直接总结结果</h3>
                    <div class="header-actions">
                        <a href="#/6"><button class="copy-btn" @click="copyContent">
                            粘贴到黑板
                        </button></a>
                        <a href="#/4"><button class="close-btn" @click="closeWindow">✕</button></a>
                    </div>
                </div>
                <div class="window-content">
                    <div class="summary-text" ref="summaryContent">
                        <p>这段对话围绕<strong>"AI在学习中的帮助"</strong>展开，主要包含以下要点：</p>
                        
                        <h4>1. <strong>AI的个性化学习优势</strong></h4>
                        <ul>
                            <li><span class="speaker-tag blue">[深蓝]</span>（可能代表学生李明）指出AI能根据个人学习进度和弱项推荐针对性练习题，并提到自己使用学习APP的体验，认为其具有高度个性化特点。</li>
                        </ul>
                        
                        <h4>2. <strong>AI的即时响应便利性</strong></h4>
                        <ul>
                            <li><span class="speaker-tag green">[绿色]</span>（可能代表另一名学生）赞同李明的观点，补充说明AI可24小时答疑问题，弥补了教师休息时间的局限性，体现了数字化教学的优势。</li>
                        </ul>
                        
                        <div class="summary-conclusion">
                            <strong>总结</strong>：对话肯定了AI在个性化学习和即时答疑方面的价值，但也客观指出了其在复杂问题处理上的不足，整体呈现辩证观点。
                        </div>
                        
                        <div class="mindmap-container">
                            <svg width="460" height="200" viewBox="0 0 460 200">
                                <!-- 中心节点 -->
                                <circle cx="230" cy="100" r="40" fill="#3498db" stroke="#2980b9" stroke-width="2"/>
                                <text x="230" y="105" text-anchor="middle" fill="white" font-size="12" font-weight="bold">AI学习帮助</text>
                                
                                <!-- 个性化学习分支 -->
                                <line x1="190" y1="80" x2="120" y2="40" stroke="#e74c3c" stroke-width="2"/>
                                <circle cx="120" cy="40" r="25" fill="#e74c3c" stroke="#c0392b" stroke-width="2"/>
                                <text x="120" y="45" text-anchor="middle" fill="white" font-size="10" font-weight="bold">个性化</text>
                                
                                <!-- 个性化子节点 -->
                                <line x1="95" y1="40" x2="50" y2="25" stroke="#e74c3c" stroke-width="1"/>
                                <rect x="20" y="15" width="60" height="20" rx="10" fill="#ecf0f1" stroke="#bdc3c7"/>
                                <text x="50" y="27" text-anchor="middle" fill="#2c3e50" font-size="8">推荐练习题</text>
                                
                                <line x1="95" y1="40" x2="50" y2="55" stroke="#e74c3c" stroke-width="1"/>
                                <rect x="20" y="45" width="60" height="20" rx="10" fill="#ecf0f1" stroke="#bdc3c7"/>
                                <text x="50" y="57" text-anchor="middle" fill="#2c3e50" font-size="8">学习APP体验</text>
                                
                                <!-- 即时响应分支 -->
                                <line x1="270" y1="80" x2="340" y2="40" stroke="#2ecc71" stroke-width="2"/>
                                <circle cx="340" cy="40" r="25" fill="#2ecc71" stroke="#27ae60" stroke-width="2"/>
                                <text x="340" y="45" text-anchor="middle" fill="white" font-size="10" font-weight="bold">即时响应</text>
                                
                                <!-- 即时响应子节点 -->
                                <line x1="365" y1="40" x2="410" y2="25" stroke="#2ecc71" stroke-width="1"/>
                                <rect x="380" y="15" width="60" height="20" rx="10" fill="#ecf0f1" stroke="#bdc3c7"/>
                                <text x="410" y="27" text-anchor="middle" fill="#2c3e50" font-size="8">24小时答疑</text>
                                
                                <line x1="365" y1="40" x2="410" y2="55" stroke="#2ecc71" stroke-width="1"/>
                                <rect x="380" y="45" width="60" height="20" rx="10" fill="#ecf0f1" stroke="#bdc3c7"/>
                                <text x="410" y="57" text-anchor="middle" fill="#2c3e50" font-size="8">弥补时限</text>
                                
                                <!-- 问题与挑战分支 -->
                                <line x1="230" y1="140" x2="230" y2="180" stroke="#f39c12" stroke-width="2"/>
                                <circle cx="230" cy="180" r="20" fill="#f39c12" stroke="#e67e22" stroke-width="2"/>
                                <text x="230" y="185" text-anchor="middle" fill="white" font-size="9" font-weight="bold">挑战</text>
                                
                                <!-- 挑战子节点 -->
                                <line x1="210" y1="180" x2="150" y2="180" stroke="#f39c12" stroke-width="1"/>
                                <rect x="100" y="170" width="50" height="20" rx="10" fill="#ecf0f1" stroke="#bdc3c7"/>
                                <text x="125" y="182" text-anchor="middle" fill="#2c3e50" font-size="8">复杂概念</text>
                                
                                <line x1="250" y1="180" x2="310" y2="180" stroke="#f39c12" stroke-width="1"/>
                                <rect x="310" y="170" width="50" height="20" rx="10" fill="#ecf0f1" stroke="#bdc3c7"/>
                                <text x="335" y="182" text-anchor="middle" fill="#2c3e50" font-size="8">准确性问题</text>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
}; 