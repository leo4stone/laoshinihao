// 单词卡应用的Vue实例
new Vue({
    el: '#app',
    data: {
        // 当前视图模式 (teacher / student)
        currentView: 'teacher',
        // 单词列表
        words: [],
        // 新单词表单
        newWord: {
            word: '',
            translation: '',
            example: ''
        },
        // 当前编辑的单词索引
        currentEditIndex: -1,
        // 学生模式相关
        currentCardIndex: 0,
        cardFlipped: false,
        // 弹窗控制
        showWordForm: false,
        showAIPrompt: false,
        showImport: false,
        showCopySuccess: false,
        showQRCode: false,
        // AI提示词文本
        aiPromptText: '',
        // 预设单词
        presetWords: '',
        // 导入JSON文本
        importJsonText: '',
        // 复制成功提示
        copySuccess: false,
        // 二维码对象
        qrcode: null,
        // 分享设置
        shareTab: 'qrcode',
        shareUrl: '',
        urlCopied: false,
        qrcodeError: false
    },
    computed: {
        // 当前显示的单词卡
        currentCard: function() {
            return this.words[this.currentCardIndex] || { word: '', translation: '', example: '' };
        }
    },
    methods: {
        // 显示添加单词弹窗
        showAddWordModal: function() {
            this.resetForm();
            this.currentEditIndex = -1;
            this.showWordForm = true;
        },
        
        // 取消单词编辑
        cancelWordEdit: function() {
            this.showWordForm = false;
            this.resetForm();
            this.currentEditIndex = -1;
        },
        
        // 显示二维码弹窗
        showQRCodeModal: function() {
            this.showQRCode = true;
            this.shareTab = 'qrcode';
            this.urlCopied = false;
            this.qrcodeError = false;
            
            // 首先生成分享URL
            this.generateShareUrl();
            
            // 在下一个DOM更新周期生成二维码
            this.$nextTick(() => {
                this.generateQRCode();
            });
        },
        
        // 生成分享URL
        generateShareUrl: function() {
            // 获取当前页面URL（不含参数）
            const url = window.location.href.split('?')[0];
            
            // 将单词列表转换为JSON字符串并进行编码
            const wordsJson = JSON.stringify(this.words);
            const encodedData = encodeURIComponent(wordsJson);
            
            // 创建包含数据的URL
            this.shareUrl = `${url}?data=${encodedData}`;
        },
        
        // 生成分享二维码
        generateQRCode: function() {
            // 清除旧的二维码
            if (this.qrcode) {
                document.getElementById('qrcode').innerHTML = '';
            }
            
            try {
                // 如果URL过长，可能无法生成二维码
                if (this.shareUrl.length > 2000) {
                    console.warn('URL过长，二维码可能无法正确扫描');
                }
                
                // 生成二维码
                this.qrcode = new QRCode(document.getElementById('qrcode'), {
                    text: this.shareUrl,
                    width: 256,
                    height: 256,
                    colorDark: '#000000',
                    colorLight: '#ffffff',
                    correctLevel: QRCode.CorrectLevel.L
                });
                
                this.qrcodeError = false;
            } catch (error) {
                console.error('生成二维码失败', error);
                this.qrcodeError = true;
                this.shareTab = 'url'; // 自动切换到URL分享
            }
        },
        
        // 复制分享URL
        copyShareUrl: function() {
            navigator.clipboard.writeText(this.shareUrl).then(() => {
                this.urlCopied = true;
                setTimeout(() => {
                    this.urlCopied = false;
                }, 3000);
            }).catch(err => {
                console.error('复制URL失败: ', err);
                alert('复制失败，请手动复制');
            });
        },
        
        // 选择并复制URL
        selectAndCopyUrl: function(event) {
            event.target.select();
        },
        
        // 从URL参数中导入单词数据
        importFromUrl: function() {
            const urlParams = new URLSearchParams(window.location.search);
            const data = urlParams.get('data');
            
            if (data) {
                try {
                    // 解码并解析JSON数据
                    const decodedData = decodeURIComponent(data);
                    const importedWords = JSON.parse(decodedData);
                    
                    if (Array.isArray(importedWords) && importedWords.length > 0) {
                        // 如果数据有效，导入单词
                        this.words = importedWords;
                        this.saveToLocalStorage();
                        
                        // 提示导入成功
                        alert(`成功导入${importedWords.length}个单词！`);
                        
                        // 切换到学生模式
                        this.currentView = 'student';
                        
                        // 去掉URL中的参数，防止刷新页面重复导入
                        window.history.replaceState({}, document.title, window.location.pathname);
                    }
                } catch (error) {
                    console.error('从URL导入数据失败', error);
                    alert('导入失败：无效的数据格式');
                }
            }
        },
        
        // 显示AI提示词弹窗
        showAIPromptModal: function() {
            this.generateAIPrompt();
            this.showAIPrompt = true;
            this.copySuccess = false;
            this.presetWords = '';
        },
        
        // 显示导入JSON弹窗
        showImportModal: function() {
            this.showImport = true;
            this.importJsonText = '';
        },
        
        // 生成AI提示词
        generateAIPrompt: function() {
            let prompt = '请生成一组英语单词的JSON数据，包含以下字段：\n\n';
            prompt += '1. word: 英文单词\n';
            prompt += '2. translation: 中文翻译\n';
            prompt += '3. example: 英文例句\n\n';
            
            // 添加预设单词部分
            if (this.presetWords && this.presetWords.trim()) {
                const wordList = this.presetWords.trim().split('\n').filter(word => word.trim()).map(word => word.trim());
                
                prompt += '请为以下预设单词提供翻译和例句：\n';
                prompt += wordList.join('\n') + '\n\n';
                prompt += '要求：\n';
                prompt += '- 只处理上述预设的单词，不要额外生成其他单词\n';
            } else {
                prompt += '要求：\n';
                prompt += '- 生成20个常用英语单词\n';
            }
            
            prompt += '- 每个单词都要有对应的中文翻译和英文例句\n';
            prompt += '- 返回格式必须是标准JSON格式，可以直接被JavaScript解析\n';
            prompt += '- 不要包含任何解释性文字，只返回JSON数据\n\n';
            prompt += '格式示例：\n';
            prompt += '[\n';
            prompt += '  {\n';
            prompt += '    "word": "apple",\n';
            prompt += '    "translation": "苹果",\n';
            prompt += '    "example": "I eat an apple every day."\n';
            prompt += '  },\n';
            prompt += '  {\n';
            prompt += '    "word": "book",\n';
            prompt += '    "translation": "书",\n';
            prompt += '    "example": "She reads a book before sleep."\n';
            prompt += '  }\n';
            prompt += ']\n';
            
            this.aiPromptText = prompt;
        },
        
        // 更新AI提示词
        updateAIPrompt: function() {
            this.generateAIPrompt();
        },
        
        // 复制提示词到剪贴板
        copyPromptText: function() {
            navigator.clipboard.writeText(this.aiPromptText).then(() => {
                this.showAIPrompt = false;
                this.showCopySuccess = true;
            }).catch(err => {
                console.error('复制失败: ', err);
                alert('复制失败，请手动复制');
            });
        },
        
        // 跳转到deepseek
        goToDeepseek: function() {
            window.open('https://chat.deepseek.com/', '_blank');
        },
        
        // 选择并复制文本
        selectAndCopy: function(event) {
            event.target.select();
        },
        
        // 导入单词数据
        importWords: function() {
            if (!this.importJsonText.trim()) {
                alert('请粘贴JSON数据');
                return;
            }
            
            try {
                const importedData = JSON.parse(this.importJsonText);
                
                if (!Array.isArray(importedData)) {
                    throw new Error('导入的数据不是数组格式');
                }
                
                // 验证导入的数据格式
                const validData = importedData.filter(item => {
                    return item && 
                           typeof item === 'object' && 
                           typeof item.word === 'string' && 
                           typeof item.translation === 'string';
                });
                
                if (validData.length === 0) {
                    throw new Error('没有找到有效的单词数据');
                }
                
                // 确认导入
                if (confirm(`确定导入${validData.length}个单词吗？${this.words.length > 0 ? '这将会添加到现有单词列表中。' : ''}`)) {
                    // 添加到当前单词列表
                    this.words = [...this.words, ...validData];
                    this.saveToLocalStorage();
                    alert(`成功导入${validData.length}个单词`);
                    this.showImport = false;
                    this.showCopySuccess = false;
                }
            } catch (error) {
                alert('导入失败：' + error.message);
                console.error('导入失败：', error);
            }
        },

        // 添加新单词
        addWord: function() {
            // 验证表单是否填写完整
            if (!this.newWord.word || !this.newWord.translation) {
                alert('请至少填写单词和翻译');
                return;
            }

            // 如果是编辑模式，则更新单词
            if (this.currentEditIndex >= 0) {
                this.words[this.currentEditIndex] = JSON.parse(JSON.stringify(this.newWord));
                this.currentEditIndex = -1;
            } else {
                // 添加新单词到数组
                this.words.push(JSON.parse(JSON.stringify(this.newWord)));
            }

            // 重置表单
            this.resetForm();
            
            // 保存到本地存储
            this.saveToLocalStorage();
            
            // 关闭弹窗
            this.showWordForm = false;
        },
        
        // 重置表单
        resetForm: function() {
            this.newWord = {
                word: '',
                translation: '',
                example: ''
            };
        },
        
        // 编辑单词
        editWord: function(index) {
            this.currentEditIndex = index;
            this.newWord = JSON.parse(JSON.stringify(this.words[index]));
            this.showWordForm = true;
        },
        
        // 删除单词
        removeWord: function(index) {
            if (confirm('确定要删除这个单词吗？')) {
                this.words.splice(index, 1);
                
                // 如果删除的是当前正在编辑的单词，重置表单
                if (index === this.currentEditIndex) {
                    this.resetForm();
                    this.currentEditIndex = -1;
                    this.showWordForm = false;
                }
                
                // 如果删除的是当前学习的单词卡片，调整索引
                if (this.currentCardIndex >= this.words.length) {
                    this.currentCardIndex = Math.max(0, this.words.length - 1);
                }
                
                // 保存到本地存储
                this.saveToLocalStorage();
            }
        },
        
        // 保存到本地存储
        saveToLocalStorage: function() {
            localStorage.setItem('wordCards', JSON.stringify(this.words));
        },
        
        // 从本地存储加载
        loadFromLocalStorage: function() {
            const savedWords = localStorage.getItem('wordCards');
            if (savedWords) {
                try {
                    this.words = JSON.parse(savedWords);
                } catch (e) {
                    console.error('从本地存储加载数据失败', e);
                }
            }
        },
        
        // 朗读单词或句子
        speakWord: function(text, event) {
            // 阻止事件冒泡，防止触发卡片翻转
            if (event) {
                event.stopPropagation();
            }
            
            // 检查浏览器是否支持语音合成
            if ('speechSynthesis' in window) {
                // 取消之前正在进行的朗读
                window.speechSynthesis.cancel();
                
                // 创建一个语音合成实例
                const utterance = new SpeechSynthesisUtterance(text);
                
                // 设置语音属性
                utterance.lang = 'en-US'; // 设置为英语
                utterance.rate = 0.9; // 语速稍慢
                utterance.pitch = 1; // 正常音调
                
                // 开始朗读
                window.speechSynthesis.speak(utterance);
            } else {
                console.warn('当前浏览器不支持语音合成API');
            }
        },
        
        // 翻转卡片
        flipCard: function(event) {
            // 如果事件来自卡片导航区域的点击或朗读按钮的点击，不进行翻转
            if (event && (
                event.target.closest('.card-navigation') || 
                event.target.closest('.study-options') ||
                event.target.closest('.sound-icon') ||
                (event.target.classList && (
                    event.target.classList.contains('card-word') ||
                    event.target.classList.contains('card-example')
                ))
            )) {
                return;
            }
            this.cardFlipped = !this.cardFlipped;
        },
        
        // 下一张卡片
        nextCard: function(event) {
            // 阻止事件冒泡，防止触发卡片翻转
            if (event) {
                event.stopPropagation();
            }
            
            if (this.currentCardIndex < this.words.length - 1) {
                this.currentCardIndex++;
                this.cardFlipped = false;
            }
        },
        
        // 上一张卡片
        prevCard: function(event) {
            // 阻止事件冒泡，防止触发卡片翻转
            if (event) {
                event.stopPropagation();
            }
            
            if (this.currentCardIndex > 0) {
                this.currentCardIndex--;
                this.cardFlipped = false;
            }
        },
        
        // 随机排序卡片
        shuffleCards: function(event) {
            // 阻止事件冒泡，防止触发卡片翻转
            if (event) {
                event.stopPropagation();
            }
            
            // 使用Fisher-Yates洗牌算法
            for (let i = this.words.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [this.words[i], this.words[j]] = [this.words[j], this.words[i]];
            }
            this.currentCardIndex = 0;
            this.cardFlipped = false;
            this.saveToLocalStorage();
        },
        
        // 导出单词
        exportWords: function() {
            if (this.words.length === 0) {
                alert('没有单词可导出');
                return;
            }
            
            // 创建下载链接
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.words, null, 2));
            const downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute("href", dataStr);
            downloadAnchorNode.setAttribute("download", "单词卡片_" + new Date().toISOString().slice(0,10) + ".json");
            document.body.appendChild(downloadAnchorNode);
            downloadAnchorNode.click();
            downloadAnchorNode.remove();
        }
    },
    // 生命周期钩子：在创建后从本地存储加载数据
    created: function() {
        // 先从本地存储加载数据
        this.loadFromLocalStorage();
        
        // 检查URL参数，如果有数据则导入
        this.importFromUrl();
    }
}); 