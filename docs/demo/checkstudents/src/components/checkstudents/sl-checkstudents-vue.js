export default {
    name: 'CheckStudents',
    data() {
        return {
            // 班级信息
            classInfo: {
                className: '计算机科学与技术2023级1班',
                teacher: '张老师',
                courseTime: '2024年1月15日 9:00~12:00'
            },
            
            // 点名状态
            isCheckingStarted: false,
            isSubmitted: false,
            
            // 学生列表（模拟数据，按座位矩阵排列）
            students: [
                // 第一排
                { id: 1, name: '张三', avatar: '👨‍🎓', isPresent: false, row: 0, col: 0 },
                { id: 2, name: '李四', avatar: '👩‍🎓', isPresent: false, row: 0, col: 1 },
                { id: 3, name: '王五', avatar: '👨‍🎓', isPresent: false, row: 0, col: 2 },
                { id: 4, name: '赵六', avatar: '👩‍🎓', isPresent: false, row: 0, col: 3 },
                { id: 5, name: '孙七', avatar: '👨‍🎓', isPresent: false, row: 0, col: 4 },
                
                // 第二排
                { id: 6, name: '周八', avatar: '👩‍🎓', isPresent: false, row: 1, col: 0 },
                { id: 7, name: '吴九', avatar: '👨‍🎓', isPresent: false, row: 1, col: 1 },
                { id: 8, name: '郑十', avatar: '👩‍🎓', isPresent: false, row: 1, col: 2 },
                { id: 9, name: '王大', avatar: '👨‍🎓', isPresent: false, row: 1, col: 3 },
                { id: 10, name: '李小', avatar: '👩‍🎓', isPresent: false, row: 1, col: 4 },
                
                // 第三排
                { id: 11, name: '陈明', avatar: '👨‍🎓', isPresent: false, row: 2, col: 0 },
                { id: 12, name: '刘红', avatar: '👩‍🎓', isPresent: false, row: 2, col: 1 },
                { id: 13, name: '杨光', avatar: '👨‍🎓', isPresent: false, row: 2, col: 2 },
                { id: 14, name: '黄海', avatar: '👩‍🎓', isPresent: false, row: 2, col: 3 },
                { id: 15, name: '林风', avatar: '👨‍🎓', isPresent: false, row: 2, col: 4 }
            ]
        };
    },
    
    computed: {
        // 按行列组织学生数据
        studentMatrix() {
            const matrix = [];
            const maxRow = Math.max(...this.students.map(s => s.row));
            const maxCol = Math.max(...this.students.map(s => s.col));
            
            for (let row = 0; row <= maxRow; row++) {
                matrix[row] = [];
                for (let col = 0; col <= maxCol; col++) {
                    const student = this.students.find(s => s.row === row && s.col === col);
                    matrix[row][col] = student || null;
                }
            }
            return matrix;
        },
        
        // 出勤统计
        attendanceStats() {
            const total = this.students.length;
            const present = this.students.filter(s => s.isPresent).length;
            const absent = total - present;
            
            return {
                total,
                present,
                absent,
                presentRate: total > 0 ? Math.round((present / total) * 100) : 0
            };
        }
    },
    
    methods: {
        // 开始点名
        startChecking() {
            this.isCheckingStarted = true;
        },
        
        // 切换学生出勤状态
        toggleStudentPresence(student) {
            if (!this.isCheckingStarted || this.isSubmitted) return;
            student.isPresent = !student.isPresent;
        },
        
        // 全部设为出勤
        setAllPresent() {
            if (!this.isCheckingStarted || this.isSubmitted) return;
            this.students.forEach(student => {
                student.isPresent = true;
            });
        },
        
        // 全部设为缺勤
        setAllAbsent() {
            if (!this.isCheckingStarted || this.isSubmitted) return;
            this.students.forEach(student => {
                student.isPresent = false;
            });
        },
        
        // 提交出勤结果
        submitAttendance() {
            if (!this.isCheckingStarted) return;
            this.isSubmitted = true;
            alert('出勤结果已提交！');
        },
        
        // 修改出勤结果
        modifyAttendance() {
            this.isSubmitted = false;
        }
    },
    
    template: `
        <div class="sl-checkstudents">
            <!-- 顶部班级信息 -->
            <div class="sl-checkstudents-header">
                <div class="sl-checkstudents-class-info">
                    <h1 class="sl-checkstudents-class-title">{{ classInfo.className }}</h1>
                    <div class="sl-checkstudents-info-row">
                        <span class="sl-checkstudents-teacher">授课老师：{{ classInfo.teacher }}</span>
                        <span class="sl-checkstudents-time">上课时间：{{ classInfo.courseTime }}</span>
                    </div>
                </div>
            </div>
            
            <!-- 学生列表区域 -->
            <div class="sl-checkstudents-content">
                <div class="sl-checkstudents-student-grid">
                    <div 
                        v-for="(row, rowIndex) in studentMatrix" 
                        :key="rowIndex" 
                        class="sl-checkstudents-student-row"
                    >
                        <div 
                            v-for="(student, colIndex) in row" 
                            :key="colIndex" 
                            class="sl-checkstudents-student-cell"
                        >
                            <div 
                                v-if="student"
                                :class="[
                                    'sl-checkstudents-student-card',
                                    student.isPresent ? 'present' : 'absent',
                                    isCheckingStarted && !isSubmitted ? 'clickable' : ''
                                ]"
                                @click="toggleStudentPresence(student)"
                            >
                                <div class="sl-checkstudents-student-avatar">{{ student.avatar }}</div>
                                <div class="sl-checkstudents-student-name">{{ student.name }}</div>
                                <div class="sl-checkstudents-student-status">
                                    {{ student.isPresent ? '出勤' : '缺勤' }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- 管理按钮区域 -->
                <div class="sl-checkstudents-controls">
                    <!-- 开始点名按钮 -->
                    <button 
                        v-if="!isCheckingStarted"
                        class="sl-checkstudents-start-btn"
                        @click="startChecking"
                    >
                        开始点名
                    </button>
                    
                    <!-- 点名过程中的控制按钮 -->
                    <div v-if="isCheckingStarted && !isSubmitted" class="sl-checkstudents-action-buttons">
                        <button class="sl-checkstudents-batch-btn" @click="setAllPresent">全部设为出勤</button>
                        <button class="sl-checkstudents-batch-btn" @click="setAllAbsent">全部设为缺勤</button>
                        <button class="sl-checkstudents-submit-btn" @click="submitAttendance">提交出勤结果</button>
                    </div>
                    
                    <!-- 提交后的修改按钮 -->
                    <button 
                        v-if="isSubmitted"
                        class="sl-checkstudents-modify-btn"
                        @click="modifyAttendance"
                    >
                        修改出勤结果
                    </button>
                </div>
            </div>
            
            <!-- 底部出勤统计 -->
            <div class="sl-checkstudents-footer">
                <div class="sl-checkstudents-stats">
                    <div class="sl-checkstudents-stats-title">出勤统计</div>
                    <div class="sl-checkstudents-stats-row">
                        <span class="sl-checkstudents-stat-item">
                            总人数：<strong>{{ attendanceStats.total }}</strong>
                        </span>
                        <span class="sl-checkstudents-stat-item present">
                            出勤：<strong>{{ attendanceStats.present }}</strong>
                        </span>
                        <span class="sl-checkstudents-stat-item absent">
                            缺勤：<strong>{{ attendanceStats.absent }}</strong>
                        </span>
                        <span class="sl-checkstudents-stat-item rate">
                            出勤率：<strong>{{ attendanceStats.presentRate }}%</strong>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    `
}; 