// PDF预览窗口组件
export const PdfViewer = {
    data() {
        return {
            currentPage: 1,
            totalPages: 3,
            zoomLevel: 100
        }
    },
    methods: {
        closeWindow() {
            console.log('关闭PDF预览窗口');
        },
        
        previousPage() {
            if (this.currentPage > 1) {
                this.currentPage--;
            }
        },
        
        nextPage() {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
            }
        },
        
        zoomIn() {
            if (this.zoomLevel < 200) {
                this.zoomLevel += 25;
            }
        },
        
        zoomOut() {
            if (this.zoomLevel > 50) {
                this.zoomLevel -= 25;
            }
        }
    },
    template: `
        <div class="pdf-viewer">
            <div class="pdf-window">
                <div class="window-header">
                    <div class="window-controls">
                        <a href="#/7"><button class="control-btn close" @click="closeWindow"></button></a>
                        <a><button class="control-btn minimize"></button></a>
                        <a><button class="control-btn maximize"></button></a>
                    </div>
                    <h3 class="window-title">课堂实录 01.pdf</h3>
                </div>
                <div class="pdf-toolbar">
                    <div class="nav-controls">
                        <button class="nav-btn" @click="previousPage" :disabled="currentPage <= 1">←</button>
                        <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
                        <button class="nav-btn" @click="nextPage" :disabled="currentPage >= totalPages">→</button>
                    </div>
                    <div class="zoom-controls">
                        <button class="zoom-btn" @click="zoomOut" :disabled="zoomLevel <= 50">-</button>
                        <span class="zoom-info">{{ zoomLevel }}%</span>
                        <button class="zoom-btn" @click="zoomIn" :disabled="zoomLevel >= 200">+</button>
                    </div>
                </div>
                <div class="pdf-content">
                    <div class="pdf-page" :style="{ transform: 'scale(' + (zoomLevel / 100) + ')' }">
                        <div class="page-header">
                            <h2>AI在教育中的应用讨论记录</h2>
                            <div class="page-meta">
                                <span>日期：2025年1月17日</span>
                                <span>时间：16:33-16:35</span>
                            </div>
                        </div>
                        <div class="page-content">
                            <div class="discussion-item">
                                <div class="speaker">老师：</div>
                                <div class="content">同学们，今天我们来讨论一下人工智能在教育领域的应用。首先，谁能说说AI在学习中给你们带来了什么帮助？</div>
                            </div>
                            <div class="discussion-item">
                                <div class="speaker">李明：</div>
                                <div class="content">老师，我觉得AI可以帮助我们个性化学习。比如根据我的学习进度和弱项，推荐适合的练习题。我用过一些学习APP，确实很有针对性。</div>
                            </div>
                            <div class="discussion-item">
                                <div class="speaker">小红：</div>
                                <div class="content">我同意李明的观点，而且AI还能24小时回答问题，不像老师需要休息。不过有时候AI的回答不够准确，特别是涉及到复杂概念的时候。</div>
                            </div>
                        </div>
                        <div class="page-footer">
                            <span>第 {{ currentPage }} 页，共 {{ totalPages }} 页</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
}; 