// 引导箭头组件
export const GuideArrow = {
    props: {
        showstate: {
            type: Array,
            default: () => null
        },
        arrowStyle: {
            type: Object,
            default: () => ({})
        },
        direction: {
            type: String,
            default: 'right'
        }
    },
    data() {
        return {
            currentState: { indexh: 0, indexv: 0, indexf: 0 }
        }
    },
    computed: {
        isVisible() {
            const targetStates = this.showstate;
            const current = this.currentState;
            console.log("current/targetStates",current,targetStates);
            
            // 如果没有传入 showstate 或者为 null，则一直显示
            if (!targetStates || targetStates === null) {
                return true;
            }
            
            // 检查 showstate 的格式
            if (targetStates.length === 0) return false;
            
            // 如果第一个元素是数组，说明是多状态格式 [[1,1,1],[1,1,2]]
            if (Array.isArray(targetStates[0])) {
                // 检查是否匹配任何一个目标状态
                return targetStates.some(targetState => this.matchState(current, targetState));
            } else {
                // 单状态格式 [1,2,3]
                return this.matchState(current, targetStates);
            }
        },
        rotateAngle() {
            const directions = {
                'left': 130,
                'up': -110,
                'right': -20,
                'down': 70
            };
            return directions[this.direction] || directions['right'];
        },
        computedStyle() {
            return {
                ...this.arrowStyle
            };
        },
        imageStyle() {
            return {
                transform: `rotate(${this.rotateAngle}deg) !important`
            };
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
                // console.log(this.currentState);
            }
        },
        
        matchState(current, target) {
            // 直接精确匹配每个维度
            return current.indexh === target[0] && 
                   current.indexv === target[1] && 
                   current.indexf === target[2];
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
        <div 
            v-if="isVisible"
            class="guide-arrow"
            data-id="guide-arrow"
            :style="computedStyle">
            <img src="images/guide_arrow.svg" alt="引导箭头" class="arrow-image" :style="imageStyle" data-auto-animate-restart>
        </div>
    `
}; 