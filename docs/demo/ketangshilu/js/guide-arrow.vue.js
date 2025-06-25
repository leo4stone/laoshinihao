// 引导箭头组件
export const GuideArrow = {
    props: {
        showstate: {
            type: Array,
            default: () => [0, undefined, undefined]
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
            const targetState = this.showstate;
            const current = this.currentState;
            console.log("current/targetState",current,targetState);
            // 检查是否匹配目标状态

            return this.matchState(current, targetState);
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
                ...this.arrowStyle,
                transform: `rotate(${this.rotateAngle}deg)`
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
            :style="computedStyle">
            <img src="images/guide_arrow.svg" alt="引导箭头" class="arrow-image">
        </div>
    `
}; 