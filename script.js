// ====== 1. شاشة الترحيب والكبسولة التحفيزية ======
window.addEventListener('load', () => {
    // إخفاء شاشة الترحيب
    setTimeout(() => {
        const splash = document.getElementById('splash-screen');
        if (splash) splash.classList.add('hidden');
    }, 2500); 

    // تغيير الكبسولة التحفيزية عشوائياً
    const quotes = [
        '"عافر، التعب بيروح والنتيجة بتفضل" ✨',
        '"المهندس الشاطر بيحل المشاكل مش بس بيكتب كود" 💻',
        '"الـ GPA مهم، بس مهاراتك وشغلك العملي أهم" 🎯',
        '"نومة كويسة قبل الامتحان أحسن من تطبيق على الفاضي" 😴',
        '"اللي بيذاكر بذكاء بيسبق اللي بيذاكر بمجهود بس" ⏳',
        '"كل مادة بتخلصها هي خطوة أقرب لحلمك" 🎓'
    ];
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    const quoteEl = document.getElementById('daily-quote');
    if(quoteEl) quoteEl.innerText = randomQuote;
});

// ====== 2. التنقل بين الأقسام (Tabs) ======
const navItems = document.querySelectorAll('.nav-item');
const tabContents = document.querySelectorAll('.tab-content');

navItems.forEach(item => {
    item.addEventListener('click', () => {
        navItems.forEach(nav => nav.classList.remove('active'));
        tabContents.forEach(tab => tab.classList.remove('active-tab'));
        
        item.classList.add('active');
        const targetId = item.getAttribute('data-target');
        document.getElementById(targetId).classList.add('active-tab');
    });
});

// ====== 3. جلب العناصر الأساسية للحاسبة ======
const subjectsContainer = document.getElementById('subjects-container');
const addSubjectBtn = document.getElementById('add-subject-btn');
const calculateBtn = document.getElementById('calculate-btn');
const finalGpaElement = document.getElementById('final-gpa');
const motivationMsg = document.getElementById('motivation-msg');
const shareBtn = document.getElementById('share-btn');
const oldGpaInput = document.getElementById('old-gpa');
const oldHoursInput = document.getElementById('old-hours');
const percentageArea = document.getElementById('percentage-area');
const finalPercentageEl = document.getElementById('final-percentage');
const warningArea = document.getElementById('academic-warning');

// ====== 4. دالة إضافة مادة جديدة ======
function addSubjectRow(name = '', hours = '3', grade = '4.0') {
    const row = document.createElement('div');
    row.className = 'subject-row';

    row.innerHTML = `
        <input type="text" placeholder="اسم المادة" class="subject-name" value="${name}">
        <select class="subject-hours">
            <option value="1" ${hours == '1' ? 'selected' : ''}>1 ساعة</option>
            <option value="2" ${hours == '2' ? 'selected' : ''}>2 ساعة</option>
            <option value="3" ${hours == '3' ? 'selected' : ''}>3 ساعات</option>
            <option value="4" ${hours == '4' ? 'selected' : ''}>4 ساعات</option>
            <option value="5" ${hours == '5' ? 'selected' : ''}>5 ساعات</option>
        </select>
        <select class="subject-grade">
            <option value="4.0" ${grade == '4.0' ? 'selected' : ''}>A (امتياز 4.0)</option>
            <option value="3.0" ${grade == '3.0' ? 'selected' : ''}>B (جيد جداً 3.0)</option>
            <option value="2.0" ${grade == '2.0' ? 'selected' : ''}>C (جيد 2.0)</option>
            <option value="1.0" ${grade == '1.0' ? 'selected' : ''}>D (مقبول 1.0)</option>
            <option value="0.0" ${grade == '0.0' ? 'selected' : ''}>F (راسب 0.0)</option>
        </select>
        <button class="delete-btn">❌</button>
    `;

    row.querySelector('.delete-btn').addEventListener('click', function() {
        row.remove();
        saveData();
    });

    row.querySelectorAll('input, select').forEach(el => {
        el.addEventListener('change', saveData);
        el.addEventListener('keyup', saveData);
    });

    subjectsContainer.appendChild(row);
}

// ====== 5. دالة حساب الـ GPA وتحديث شريط التخرج ======
function calculateGPA() {
    const rows = document.querySelectorAll('#subjects-container .subject-row'); 
    let currentPoints = 0;
    let currentHours = 0;

    rows.forEach(row => {
        const hours = parseFloat(row.querySelector('.subject-hours').value);
        const grade = parseFloat(row.querySelector('.subject-grade').value);
        currentPoints += (hours * grade);
        currentHours += hours;
    });

    const oldGpa = parseFloat(oldGpaInput.value) || 0;
    const oldHours = parseFloat(oldHoursInput.value) || 0;
    const oldPoints = oldGpa * oldHours;

    const totalHours = currentHours + oldHours;
    const totalPoints = currentPoints + oldPoints;

    // تحديث شريط التخرج (بافتراض إن إجمالي ساعات التخرج 132 ساعة - وتقدر تعدلها)
    const graduationHours = 132; 
    let progressPercent = ((totalHours / graduationHours) * 100).toFixed(1);
    if(progressPercent > 100) progressPercent = 100;
    
    document.getElementById('progress-bar').style.width = `${progressPercent}%`;
    document.getElementById('progress-text').innerText = `${progressPercent}%`;

    if (totalHours === 0) {
        finalGpaElement.innerText = "0.00";
        motivationMsg.innerText = "ضيف موادك عشان نحسبلك التقدير يا بطل!";
        if(shareBtn) shareBtn.style.display = 'none';
        if(percentageArea) percentageArea.style.display = 'none';
        if(warningArea) warningArea.style.display = 'none';
        return;
    }

    const finalGpa = (totalPoints / totalHours).toFixed(2);
    finalGpaElement.innerText = finalGpa;

    // النسبة المئوية
    if (percentageArea) {
        percentageArea.style.display = 'block';
        let percentage = ((parseFloat(finalGpa) + 1) * 20).toFixed(1);
        if (percentage > 100) percentage = 100;
        finalPercentageEl.innerText = percentage;
    }

    // الإنذار الأكاديمي
    if (warningArea) {
        if (finalGpa > 0 && finalGpa < 2.0) warningArea.style.display = 'block';
        else warningArea.style.display = 'none';
    }

    shareBtn.style.display = 'block';

    if (finalGpa >= 3.5) {
        motivationMsg.innerText = "عاش يا وحش! دحيح الدفعة 👑🔥";
        motivationMsg.style.color = "var(--neon-green)";
        if (typeof confetti !== 'undefined') confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
    } else if (finalGpa >= 2.5) {
        motivationMsg.innerText = "أداؤك حلو جداً.. دوس كمان 🚀";
        motivationMsg.style.color = "var(--neon-blue)";
    } else if (finalGpa >= 2.0) {
        motivationMsg.innerText = "في السليم، بس أنت تقدر تعمل أحسن 😉";
        motivationMsg.style.color = "#f39c12"; 
    } else {
        motivationMsg.innerText = "محتاج تشد حيلك.. لسه فيها أمل 💪";
        motivationMsg.style.color = "#ff4757"; 
    }

    shareBtn.onclick = () => {
        const shareText = `حسبت الـ GPA بتاعي على (دليلك) وطلع ${finalGpa} وخلصت ${progressPercent}% من رحلتي! 🎓🔥\nاحسب نتيجتك من هنا:\n[هنضيف اللينك بعدين]`;
        if (navigator.share) navigator.share({ title: 'نتيجتي', text: shareText });
        else window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`);
    };
}

// حفظ واسترجاع البيانات
function saveData() {
    const rows = document.querySelectorAll('#subjects-container .subject-row');
    const subjectsData = [];
    rows.forEach(row => {
        subjectsData.push({
            name: row.querySelector('.subject-name').value,
            hours: row.querySelector('.subject-hours').value,
            grade: row.querySelector('.subject-grade').value
        });
    });
    localStorage.setItem('daleelok_data', JSON.stringify({ subjects: subjectsData, oldGpa: oldGpaInput.value, oldHours: oldHoursInput.value }));
    calculateGPA(); // تحديث فوري لشريط التخرج لما الداتا تتغير
}

function loadData() {
    const savedData = localStorage.getItem('daleelok_data');
    if (savedData) {
        const data = JSON.parse(savedData);
        if (data.oldGpa) oldGpaInput.value = data.oldGpa;
        if (data.oldHours) oldHoursInput.value = data.oldHours;
        if (data.subjects && data.subjects.length > 0) {
            data.subjects.forEach(subject => addSubjectRow(subject.name, subject.hours, subject.grade));
            calculateGPA();
            return;
        }
    }
    for(let i=0; i<4; i++) addSubjectRow();
}

if (oldGpaInput) oldGpaInput.addEventListener('input', saveData);
if (oldHoursInput) oldHoursInput.addEventListener('input', saveData);
if (addSubjectBtn) addSubjectBtn.addEventListener('click', () => { addSubjectRow(); saveData(); });
if (calculateBtn) calculateBtn.addEventListener('click', calculateGPA);

// ====== 6. حاسبة الهدف ======
// (تم إبقاؤها كما هي - شغالة بامتياز من الخطوة السابقة)
const calcTargetBtn = document.getElementById('calculate-target-btn');
if (calcTargetBtn) {
    calcTargetBtn.addEventListener('click', () => {
        const currentGpa = parseFloat(document.getElementById('target-current-gpa').value) || 0;
        const currentHours = parseFloat(document.getElementById('target-current-hours').value) || 0;
        const nextHours = parseFloat(document.getElementById('target-next-hours').value) || 0;
        const dreamGpa = parseFloat(document.getElementById('target-dream-gpa').value) || 0;

        if (!currentHours || !nextHours || !dreamGpa) return alert("اكتب كل الأرقام صح يا بطل!");

        const requiredTermGpa = (((dreamGpa * (currentHours + nextHours)) - (currentGpa * currentHours)) / nextHours).toFixed(2);
        
        document.getElementById('target-result-area').style.display = 'block';
        const targetEl = document.getElementById('required-term-gpa');
        const msgEl = document.getElementById('target-msg');

        if (requiredTermGpa > 4.0) { targetEl.innerText = requiredTermGpa; targetEl.style.color = "#ff4757"; msgEl.innerText = "صعبة رياضياً في ترم واحد 💔"; }
        else if (requiredTermGpa <= 0) { targetEl.innerText = "ناجح"; targetEl.style.color = "var(--neon-blue)"; msgEl.innerText = "أنت معدي الهدف أصلاً! 😂"; }
        else { targetEl.innerText = requiredTermGpa; targetEl.style.color = "var(--neon-green)"; msgEl.innerText = "شد حيلك وتقدر توصلها 💪"; }
    });
}

// ====== 7. طوق النجاة (الفاينال) 🛟 ======
const calcRescueBtn = document.getElementById('calculate-rescue-btn');
if (calcRescueBtn) {
    calcRescueBtn.addEventListener('click', () => {
        const totalCourse = parseFloat(document.getElementById('total-course-mark').value) || 0;
        const midterm = parseFloat(document.getElementById('midterm-mark').value) || 0;
        const passing = parseFloat(document.getElementById('passing-mark').value) || 0;

        if (!totalCourse || !passing) return alert("اكتب درجة المادة ودرجة النجاح!");

        const required = passing - midterm;
        const rescueResultArea = document.getElementById('rescue-result-area');
        const requiredMarkEl = document.getElementById('required-final-mark');
        const msgEl = document.getElementById('rescue-msg');
        
        rescueResultArea.style.display = 'block';

        if (required <= 0) {
            requiredMarkEl.innerText = "0";
            requiredMarkEl.style.color = "var(--neon-green)";
            msgEl.innerText = "ألف مبروك! أنت ناجح من أعمال السنة أصلاً 🥳 ادخل الفاينال براحتك.";
        } else if (required > (totalCourse - midterm)) {
            requiredMarkEl.innerText = "مستحيل";
            requiredMarkEl.style.color = "#ff4757";
            msgEl.innerText = "للأسف درجتك في أعمال السنة قليلة جداً.. حاول تعوض في باقي المواد 💔";
        } else {
            requiredMarkEl.innerText = required;
            requiredMarkEl.style.color = "#ff9f43";
            msgEl.innerText = `مطلوب منك تجيب ${required} في الفاينال عشان تنجح وتعدي.. هانت! 🛟`;
        }
    });
}

// ====== 8. مؤقت المذاكرة (Pomodoro) ⏳ ======
let timerInterval;
let timeLeft = 25 * 60; // 25 دقيقة
let isRunning = false;

const minEl = document.getElementById('minutes');
const secEl = document.getElementById('seconds');
const startBtn = document.getElementById('start-timer-btn');
const resetBtn = document.getElementById('reset-timer-btn');

function updateTimerDisplay() {
    const m = Math.floor(timeLeft / 60);
    const s = timeLeft % 60;
    minEl.innerText = m < 10 ? '0' + m : m;
    secEl.innerText = s < 10 ? '0' + s : s;
}

if (startBtn) {
    startBtn.addEventListener('click', () => {
        if (!isRunning) {
            // تشغيل
            isRunning = true;
            startBtn.innerHTML = 'إيقاف مؤقت ⏸️';
            startBtn.style.background = '#f39c12';
            
            timerInterval = setInterval(() => {
                if (timeLeft > 0) {
                    timeLeft--;
                    updateTimerDisplay();
                } else {
                    clearInterval(timerInterval);
                    isRunning = false;
                    alert('عاش! خلصت 25 دقيقة تركيز.. قوم خد 5 دقايق راحة وارجع تاني ☕');
                    timeLeft = 25 * 60;
                    updateTimerDisplay();
                    startBtn.innerHTML = 'ابدأ المذاكرة ▶️';
                    startBtn.style.background = 'var(--success-color)';
                }
            }, 1000);
        } else {
            // إيقاف
            clearInterval(timerInterval);
            isRunning = false;
            startBtn.innerHTML = 'كمل مذاكرة ▶️';
            startBtn.style.background = 'var(--neon-blue)';
        }
    });
}

if (resetBtn) {
    resetBtn.addEventListener('click', () => {
        clearInterval(timerInterval);
        isRunning = false;
        timeLeft = 25 * 60;
        updateTimerDisplay();
        startBtn.innerHTML = 'ابدأ المذاكرة ▶️';
        startBtn.style.background = 'var(--success-color)';
    });
}

// ====== 9. الإعدادات ومسح البيانات ======
const clearDataBtn = document.getElementById('clear-data-btn');
if (clearDataBtn) {
    clearDataBtn.addEventListener('click', () => {
        if (confirm('متأكد إنك عايز تمسح كل الداتا بتاعتك من الموقع؟')) {
            localStorage.removeItem('daleelok_data');
            location.reload();
        }
    });
}

// تشغيل أول ما تفتح
loadData();