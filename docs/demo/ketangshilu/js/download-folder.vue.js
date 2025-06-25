// 下载文件夹窗口组件
export const DownloadFolder = {
    data() {
        return {}
    },
    methods: {
        closeWindow() {
            console.log('关闭下载文件夹窗口');
        }
    },
    template: `
        <div class="download-folder">
            <div class="folder-window">
                <div class="window-header">
                    <div class="window-controls">
                        <a href="#/6"><button class="control-btn close" @click="closeWindow"></button></a>
                        <a ><button class="control-btn minimize"></button></a>
                        <a ><button class="control-btn maximize"></button></a>
                    </div>
                    <h3 class="window-title">下载</h3>
                </div>
                <div class="window-toolbar">
                    <div class="nav-buttons">
                        <button class="nav-btn">←</button>
                        <button class="nav-btn">→</button>
                        <button class="nav-btn">↑</button>
                    </div>
                    <div class="address-bar">
                        <span class="address-text">📁 下载</span>
                    </div>
                </div>
                <div class="window-content">
                    <div class="file-list">
                        <a href="#/8"><div class="file-item">
                            <div class="file-icon">📄</div>
                            <div class="file-info">
                                <div class="file-name">课堂实录 01.pdf</div>
                                <div class="file-details">
                                    <span class="file-size">2.3 MB</span>
                                    <span class="file-date">2025/1/17 14:32</span>
                                </div>
                            </div>
                        </div></a>
                    </div>
                </div>
            </div>
        </div>
    `
}; 