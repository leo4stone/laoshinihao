// 导航按钮组件
export const NavigationButton = {
    props: {
        showRange: {
            type: Array,
            default: () => [[0, 0, 0], [999, 999, 999]]
        },
        navMethod: {
            type: String,
            default: 'right'
        },
        buttonStyle: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            currentState: { indexh: 0, indexv: 0, indexf: 0 }
        }
    },
    computed: {
        isVisible() {
            const [minRange, maxRange] = this.showRange;
            const current = this.currentState;
            
            // 检查是否在显示范围内
            const afterMin = this.compareState(current, minRange) >= 0;
            const beforeMax = this.compareState(current, maxRange) <= 0;
            
            return afterMin && beforeMax;
        }
    },
    methods: {
        updateCurrentState() {
            if (typeof window.Reveal !== 'undefined' && window.Reveal.getState) {
                const state = window.Reveal.getState();
                this.currentState = {
                    indexh: state.indexh,
                    indexv: state.indexv,
                    indexf: state.indexf
                };
            }
        },
        
        compareState(state1, state2) {
            // 比较两个状态，返回 -1, 0, 1
            // 处理 undefined 值：undefined 被视为最小值
            const normalizeValue = (val) => val === undefined ? -1 : val;
            
            const h1 = normalizeValue(state1.indexh);
            const h2 = normalizeValue(state2[0]);
            if (h1 !== h2) {
                return h1 - h2;
            }
            
            const v1 = normalizeValue(state1.indexv);
            const v2 = normalizeValue(state2[1]);
            if (v1 !== v2) {
                return v1 - v2;
            }
            
            const f1 = normalizeValue(state1.indexf);
            const f2 = normalizeValue(state2[2]);
            return f1 - f2;
        },
        
        navigate() {
            if (typeof window.Reveal !== 'undefined') {
                switch (this.navMethod) {
                    case 'left':
                        window.Reveal.left();
                        break;
                    case 'right':
                        window.Reveal.right();
                        break;
                    case 'up':
                        window.Reveal.up();
                        break;
                    case 'down':
                        window.Reveal.down();
                        break;
                    case 'prev':
                        window.Reveal.prev();
                        break;
                    case 'next':
                        window.Reveal.next();
                        break;
                    case 'prevFragment':
                        window.Reveal.prevFragment();
                        break;
                    case 'nextFragment':
                        window.Reveal.nextFragment();
                        break;
                    default:
                        console.warn(`Unknown navigation method: ${this.navMethod}`);
                }
            }
        }
    },
    mounted() {
        this.updateCurrentState();
        
        // 监听 Reveal.js 状态变化
        if (typeof window.Reveal !== 'undefined') {
            window.Reveal.on('slidechanged', this.updateCurrentState);
            window.Reveal.on('fragmentshown', this.updateCurrentState);
            window.Reveal.on('fragmenthidden', this.updateCurrentState);
        }
    },
    beforeUnmount() {
        // 清理事件监听
        if (typeof window.Reveal !== 'undefined') {
            window.Reveal.off('slidechanged', this.updateCurrentState);
            window.Reveal.off('fragmentshown', this.updateCurrentState);
            window.Reveal.off('fragmenthidden', this.updateCurrentState);
        }
    },
    template: `
        <button 
            v-if="isVisible"
            class="navigation-button"
            :style="buttonStyle"
            @click="navigate">
            <slot></slot>
        </button>
    `
}; 