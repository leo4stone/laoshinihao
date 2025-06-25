// 语音实录窗口组件
export const VoiceRecorder = {
    props: {
        isRecording: {
            type: Boolean,
            default: false
        },
        hasMessages: {
            type: Boolean,
            default: false
        },
        enableFragment: {
            type: Boolean,
            default: false
        },
        enableSelection: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            messages: [
                { id: 1, text: '同学们，今天我们来讨论一下人工智能在教育领域的应用。', time: '2025/6/17 16:33:11' },
                { id: 2, text: '首先，谁能说说AI在学习中给你们带来了什么帮助？', time: '2025/6/17 16:33:11' },
                { id: 3, text: '老师，我觉得AI可以帮助我们个性化学习。', time: '2025/6/17 16:33:46' },
                { id: 4, text: '比如根据我的学习进度和弱项，推荐适合的练习题。我用过一些学习APP，确实很有针对性。', time: '2025/6/17 16:33:46' },
                { id: 5, text: '我同意李明的观点，而且AI还能24小时回答问题，不像老师需要休息。', time: '2025/6/17 16:34:38' },
                { id: 6, text: '不过有时候AI的回答不够准确，特别是涉及到复杂概念的时候。', time: '2025/6/17 16:34:38' }
            ],
            selectionStart: null,
            selectionEnd: null,
            showSummaryDialog: false
        }
    },
    computed: {
        messageGroups() {
            const groups = [];
            for (let i = 0; i < this.messages.length; i += 2) {
                groups.push(this.messages.slice(i, i + 2));
            }
            return groups;
        },
        
        isInSelection() {
            return (messageId) => {
                if (!this.selectionStart || !this.selectionEnd) return false;
                return messageId >= this.selectionStart && messageId <= this.selectionEnd;
            }
        },
        
        selectedCount() {
            if (!this.selectionStart || !this.selectionEnd) return 0;
            return this.selectionEnd - this.selectionStart + 1;
        }
    },
    methods: {
        selectMessage(messageId) {
            if (!this.enableSelection) return;
            
            if (!this.selectionStart) {
                this.selectionStart = messageId;
            } else if (!this.selectionEnd) {
                this.selectionEnd = Math.max(messageId, this.selectionStart);
                this.showSummaryDialog = true;
            }
        },
        
        resetSelection() {
            this.selectionStart = null;
            this.selectionEnd = null;
            this.showSummaryDialog = false;
        },
        
        directSummary() {
            this.showSummaryDialog = false;
            // 处理直接总结逻辑
        },
        
        customSummary() {
            this.showSummaryDialog = false;
            // 处理按要求总结逻辑
        }
    },
    watch: {
        showSummaryDialog(newVal) {
            if (!newVal) {
                // 当弹窗关闭时，重置选区数据
                this.selectionStart = null;
                this.selectionEnd = null;
            }
        }
    },
    template: `
        <div class="voice-recorder">
            <div class="recorder-window">
                <div class="window-header">
                    <h3 class="window-title">课堂实录</h3>
                    <div v-if="hasMessages" class="download-icon"> <a href="#/7">📥<span>保存</span></a></div>
                </div>
                <div class="window-content">
                    <div v-if="!hasMessages" class="empty-state">
                        <div class="folder-icon"></div>
                        <div class="search-icon">
                            <div class="magnifier"></div>
                        </div>
                        <h4 class="empty-title">暂无记录</h4>
                        <p class="empty-text">请点击下方按钮开始录音</p>
                    </div>
                    <div v-else class="messages-list">
                        <div v-for="(message, index) in messages" :key="message.id" 
                             :class="['message-item', { 
                                 'fragment fade-up': enableFragment,
                                 'selected-start': enableSelection && selectionStart === message.id,
                                 'selected-range': enableSelection && isInSelection(message.id)
                             }]" 
                             :data-autoslide="enableFragment ? '300' : null">
                            <div v-if="index === 0 || message.time !== messages[index-1].time" class="time-stamp">{{ message.time }}</div>
                            <div class="message-content">
                                <div class="message-number" :style="{'cursor': enableSelection ? 'pointer' : 'default'}" @click.stop="enableSelection && !selectionEnd ? selectMessage(message.id) : null">{{ message.id }}</div>
                                <div class="message-text">{{ message.text }}</div>
                                <button class="delete-btn">✕</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="window-footer">
                    <div v-if="!isRecording && !(enableSelection && selectionStart && !selectionEnd)" class="color-buttons">
                        <a href="#/2"><button class="color-btn red"></button></a>
                        <a href="#/2"><button class="color-btn orange"></button></a>
                        <a href="#/2"><button class="color-btn yellow"></button></a>
                        <a href="#/2"><button class="color-btn green"></button></a>
                        <a href="#/2"><button class="color-btn blue"></button></a>
                        <a href="#/2"><button class="color-btn dark-blue"></button></a>
                        <a href="#/2"><button class="color-btn purple"></button></a>
                    </div>
                    <div v-else-if="!isRecording && enableSelection && selectionStart && !selectionEnd" class="selection-tip">
                        请选择一条消息的序号作为结束位置
                    </div>
                    <div v-else-if="isRecording" class="recording-controls">
                        <a href="#/3"><button class="stop-recording-btn">
                            <span class="recording-icon">⏺</span>
                            停止录音
                        </button>
                        </a>
                    </div>
                </div>
            </div>
            
            <!-- 总结弹窗 -->
            <div v-if="showSummaryDialog" class="summary-dialog-overlay" @click="resetSelection">
                <div class="summary-dialog" @click.stop>
                    <div class="summary-header">
                        <h3>消息总结</h3>
                        <button class="close-btn" @click="resetSelection">✕</button>
                    </div>
                    <div class="summary-content">
                        当前已选中从第{{ selectionStart }}条到第{{ selectionEnd }}条，共{{ selectedCount }}条消息
                    </div>
                    <div class="summary-actions">
                        <a href="#/5"><button class="action-btn primary" @click="directSummary">直接总结</button></a>
                        <a href="#/5"><button class="action-btn secondary" @click="customSummary">按要求总结</button></a>
                    </div>
                </div>
            </div>
        </div>
    `
}; 