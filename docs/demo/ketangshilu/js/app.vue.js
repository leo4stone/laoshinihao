// Vue.js 应用配置
import { Wallpaper } from './wallpaper.vue.js';
import { AppIconButton } from './app-icon-button.vue.js';
import { VoiceRecorder } from './voice-recorder.vue.js';
import { SummaryResult } from './summary-result.vue.js';
import { DownloadFolder } from './download-folder.vue.js';
import { PdfViewer } from './pdf-viewer.vue.js';
import { NavigationButton } from './navigation-button.vue.js';
import { GuideArrow } from './guide-arrow.vue.js';

const { createApp } = Vue;

const app = createApp({
    template: `
        <div class="slides">
            <!-- 第一张幻灯片 显示桌面 -->
            <section>
                <wallpaper></wallpaper>
                <a href="#/1"><app-icon-button></app-icon-button></a>
                <guide-arrow 
                    :showstate="[0, 0, 0]"
                    direction="down"
                    :arrow-style="{
                        position: 'absolute',
                        bottom: '180px',
                        right: '140px',
                        width: '100px',
                        height: '100px'
                    }">
                </guide-arrow>
            </section>
            
            <!-- 第二张幻灯片 显示默认界面 -->
            <section>
                <wallpaper></wallpaper>
                <app-icon-button></app-icon-button>
                <voice-recorder></voice-recorder>
                <guide-arrow 
                    :showstate="[1, 0, undefined]"
                    direction="right"
                    :arrow-style="{
                        position: 'absolute',
                        bottom: '200px',
                        right: '420px',
                        width: '100px',
                        height: '100px'
                    }">
                </guide-arrow>
            </section>
            
            <!-- 第三张幻灯片 显示录音过程 -->
            <section>
                <wallpaper></wallpaper>
                <app-icon-button></app-icon-button>
                <voice-recorder :is-recording="true"></voice-recorder>
                <guide-arrow 
                    :showstate="[2, 0, undefined]"
                    direction="right"
                    :arrow-style="{
                        position: 'absolute',
                        bottom: '200px',
                        right: '320px',
                        width: '100px',
                        height: '100px',
                        zIndex: 20
                    }">
                </guide-arrow>
            </section>
            
            <!-- 第四张幻灯片 显示录音内容动画过程 -->
            <section data-autoslide="600">
                <wallpaper></wallpaper>
                <app-icon-button></app-icon-button>
                <voice-recorder :has-messages="true" :enable-fragment="true"></voice-recorder>
            </section>

            <!-- 第五张幻灯片 显示录音内容完整结果 -->
            <section>
                <wallpaper></wallpaper>
                <app-icon-button></app-icon-button>
                <voice-recorder :has-messages="true" :enable-selection="true"></voice-recorder>
                <guide-arrow 
                    :showstate="[4, 0, undefined]"
                    direction="right"
                    :arrow-style="{
                        position: 'absolute',
                        bottom: '680px',
                        right: '380px',
                        width: '100px',
                        height: '100px',
                        zIndex: 20
                    }">
                </guide-arrow>
            </section>

            <!-- 第六张幻灯片 总结结果 -->
            <section>
                <wallpaper></wallpaper>
                <app-icon-button></app-icon-button>
                <voice-recorder :has-messages="true"></voice-recorder>
                <summary-result></summary-result>
                <guide-arrow 
                    :showstate="[5, 0, undefined]"
                    direction="down"
                    :arrow-style="{
                        position: 'absolute',
                        bottom: '800px',
                        right: '120px',
                        width: '100px',
                        height: '100px',
                        zIndex: 20
                    }">
                </guide-arrow>
            </section>

            <!-- 第七张幻灯片 复制内容到黑板 -->
            <section>
                <wallpaper></wallpaper>
                <app-icon-button></app-icon-button>
                <voice-recorder :has-messages="true"></voice-recorder>
                <navigation-button 
                    :show-range="[[6, 0, undefined], [6, 0, 0]]"
                    nav-method="right"
                    :button-style="{
                        position: 'absolute',
                        top: '230px',
                        right: '30px',
                        zIndex: 10,
                        width: '370px',
                        height: '660px'
                    }">
                </navigation-button>
                <summary-result :transparent="true"></summary-result>
                <div class="fragment dialogue-text dialogue-blue">
                    老师，我觉得AI可以帮助我们个性化学习。
                    比如根据我的学习进度和弱项，推荐适合的练习题。我用过一些学习APP，确实很有针对性。
                </div>
                <div class="fragment dialogue-text dialogue-green">
                    我同意李明的观点，而且AI还能24小时回答问题，不像老师需要休息。
                    不过有时候AI的回答不够准确，特别是涉及到复杂概念的时候。
                </div>
                <guide-arrow 
                    :showstate="[6, 0, -1]"
                    direction="down"
                    :arrow-style="{
                        position: 'absolute',
                        bottom: '600px',
                        right: '120px',
                        width: '100px',
                        height: '100px',
                        zIndex: 20
                    }">
                </guide-arrow>
                <guide-arrow 
                    :showstate="[6, 0, 0]"
                    direction="down"
                    :arrow-style="{
                        position: 'absolute',
                        bottom: '400px',
                        right: '120px',
                        width: '100px',
                        height: '100px',
                        zIndex: 20
                    }">
                </guide-arrow>
                <guide-arrow 
                    :showstate="[6, 0, 1]"
                    direction="down"
                    :arrow-style="{
                        position: 'absolute',
                        bottom: '900px',
                        right: '10px',
                        width: '100px',
                        height: '100px',
                        zIndex: 20
                    }">
                </guide-arrow>
            </section>

            <!-- 第八张幻灯片 下载文件夹 -->
            <section>
                <wallpaper></wallpaper>
                <app-icon-button></app-icon-button>
                <voice-recorder :has-messages="true"></voice-recorder>
                <download-folder></download-folder>
                <guide-arrow 
                    :showstate="[7, 0, undefined]"
                    direction="up"
                    :arrow-style="{
                        position: 'absolute',
                        bottom: '500px',
                        right: '1110px',
                        width: '100px',
                        height: '100px',
                        zIndex: 20
                    }">
                </guide-arrow>
            </section>

            <!-- 第九张幻灯片 预览PDF -->
            <section>
                <wallpaper></wallpaper>
                <a href="#"><app-icon-button></app-icon-button></a>
                <voice-recorder :has-messages="true"></voice-recorder>
                <download-folder></download-folder>
                <pdf-viewer></pdf-viewer>
                <guide-arrow 
                    :showstate="[8, 0, undefined]"
                    direction="right"
                    :arrow-style="{
                        position: 'absolute',
                        bottom: '830px',
                        right: '1360px',
                        width: '100px',
                        height: '100px',
                        zIndex: 20
                    }">
                </guide-arrow>
            </section>
        </div>
    `,
    components: {
        Wallpaper,
        AppIconButton,
        VoiceRecorder,
        SummaryResult,
        DownloadFolder,
        PdfViewer,
        NavigationButton,
        GuideArrow
    },
    data() {
        return {
            // 主标题和副标题
            title: '欢迎使用 Reveal.js + Vue.js',
            subtitle: '一个现代化的演示解决方案',
            
            // 计数器
            count: 0,
            
            // 用户输入
            userInput: '',
            
            // 功能列表
            features: [
                {
                    name: 'Reveal.js',
                    description: '强大的HTML演示框架，支持多种切换效果'
                },
                {
                    name: 'Vue.js',
                    description: '渐进式JavaScript框架，提供响应式数据绑定'
                },
                {
                    name: 'Less.js',
                    description: '动态CSS预处理器，让样式更加灵活'
                }
            ],
            
            // 技术栈
            techStack: ['HTML5', 'CSS3', 'JavaScript', 'Vue.js', 'Reveal.js', 'Less.js'],
            
            // autosliding保持列表
            autoslidingKeepList: [
                [3, 0, -1], 
                [3, 0, 0],
                [3, 0, 1],
                [3, 0, 2],
                [3, 0, 3],
                [3, 0, 4],
                [3, 0, 5]
            ],
            
            // 防抖动定时器
            handleAutoSlidingTimer: null
        }
    },
    
    methods: {
        // 计数器增加方法
        increment() {
            this.count++;
            
            // 添加一些动画效果
            const button = event.target;
            button.style.transform = 'scale(1.1)';
            setTimeout(() => {
                button.style.transform = 'scale(1)';
            }, 150);
        },
        
        // 重置计数器
        resetCount() {
            this.count = 0;
        },
        
        // 检查当前状态是否在autosliding保持列表中
        isInAutoslidingKeepList(currentState) {
            // console.log("currentState",currentState);
            return this.autoslidingKeepList.some(keepState => 
                currentState.indexh === keepState[0] && 
                currentState.indexv === keepState[1] && 
                currentState.indexf === keepState[2]
            );
        },
        
        // 处理自动播放逻辑（带防抖动）
        handleAutoSliding() {
            // 清除之前的定时器
            if (this.handleAutoSlidingTimer) {
                clearTimeout(this.handleAutoSlidingTimer);
            }
            
            // 设置1秒防抖动
            this.handleAutoSlidingTimer = setTimeout(() => {
                if (typeof window.Reveal !== 'undefined' && window.Reveal.getState) {
                    const currentState = window.Reveal.getState();
                    
                    // 检查当前播放进度是否位于保持列表中
                    if (this.isInAutoslidingKeepList(currentState)) {
                        // 检查当前是否为自动播放
                        if (!window.Reveal.isAutoSliding()) {
                            // 如果当前不是自动播放，则启用自动播放
                            window.Reveal.toggleAutoSlide();
                        }
                    }
                }
            }, 500);
        }
    },
    
    // 组件挂载后初始化 Reveal.js
    mounted() {
        // 初始化 Reveal.js
        Reveal.initialize({
            hash: true,
            controls: true,
            progress: true,
            center: true,
            transition: 'none', // 切换效果: none/fade/slide/convex/concave/zoom
            margin: 0,
            
            // 设置演示尺寸
            width: 1920,
            height: 1080,
            
            // 插件配置
            plugins: []
        });
        
        // 将 Reveal 暴露到全局，供子组件使用
        window.Reveal = Reveal;
        
        // 监听导航事件
        window.Reveal.on('slidechanged', this.handleAutoSliding);
        window.Reveal.on('fragmentshown', this.handleAutoSliding);
        window.Reveal.on('fragmenthidden', this.handleAutoSliding);
        
        // 添加键盘事件监听
        document.addEventListener('keydown', (e) => {
            // 按 'R' 键重置计数器
            if (e.key === 'r' || e.key === 'R') {
                this.resetCount();
            }
        });
        
        console.log('Vue.js + Reveal.js 应用已初始化');
    }
});

// 挂载 Vue 应用到 #app 元素
app.mount('#app'); 