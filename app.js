const heroText = document.getElementById('hero-text');
const startButton = document.getElementById('start-btn');
const cancelButton = document.getElementById('cancel-btn');
const setupView = document.getElementById('setup-view');
const timerView = document.getElementById('timer-view');
const timerDisplay = document.getElementById('timer-display');

const timeButtons = document.querySelectorAll('.time-btn'); 
const targetAreaSelect = document.getElementById('target-area'); 
const routineVisual = document.getElementById('routine-visual'); 
const proTipText = document.getElementById('pro-tip-text');

const chimeSound = document.getElementById('chime');
const themeToggle = document.getElementById('theme-toggle');
const lifetimeStatsDisplay = document.getElementById('lifetime-stats');

const statsBtn = document.getElementById('stats-btn');
const closeStatsBtn = document.getElementById('close-stats-btn');
const statsView = document.getElementById('stats-view');
const ctx = document.getElementById('statsChart').getContext('2d');
let chartInstance;

let countdownInterval; 

window.addEventListener('DOMContentLoaded', () => {
    const savedArea = localStorage.getItem('flexDesk_targetArea');
    const savedTime = localStorage.getItem('flexDesk_time');
    const lifetimeMinutes = localStorage.getItem('flexDesk_lifetimeMinutes') || 0;

    if (savedArea) {
        targetAreaSelect.value = savedArea;
    }

    if (savedTime) {
        timeButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.innerText === savedTime) {
                btn.classList.add('active');
            }
        });
    }
    
    updateLifetimeDisplay(lifetimeMinutes);
});

function updateLifetimeDisplay(minutes) {
    if (lifetimeStatsDisplay) {
        lifetimeStatsDisplay.innerText = `Lifetime Stretch Time: ${minutes} Minutes`;
    }
}

themeToggle.addEventListener('click', function() {
    document.body.classList.toggle('dark-theme');
    
    // Swap both the icon and the text label dynamically for the frosted pill button
    if (document.body.classList.contains('dark-theme')) {
        themeToggle.innerHTML = '<span class="icon">☀️</span><span class="btn-text">Light Mode</span>';
    } else {
        themeToggle.innerHTML = '<span class="icon">🌙</span><span class="btn-text">Dark Mode</span>';
    }
    
    // If the chart is visible during a theme swap, instantly update the colors
    if (!statsView.classList.contains('hidden')) {
        renderChart();
    }
});

timeButtons.forEach(button => {
    button.addEventListener('click', function() {
        timeButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
    });
});

function startTimer(durationInSeconds) {
    let timer = durationInSeconds;
    clearInterval(countdownInterval); 

    countdownInterval = setInterval(function () {
        let minutes = parseInt(timer / 60, 10);
        let seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        timerDisplay.innerText = minutes + ":" + seconds;

        if (--timer < 0) {
            clearInterval(countdownInterval); 
            timerDisplay.innerText = "00:00"; 
            chimeSound.play();

            // Update Lifetime Minutes
            let addedMinutes = (document.querySelector('.time-btn.active').innerText === '5 Min') ? 5 : 2;
            let currentLifetime = parseInt(localStorage.getItem('flexDesk_lifetimeMinutes') || 0, 10);
            currentLifetime += addedMinutes;
            localStorage.setItem('flexDesk_lifetimeMinutes', currentLifetime);
            updateLifetimeDisplay(currentLifetime);

            // Update Weekly Array for Chart.js
            let todayIndex = new Date().getDay(); 
            let weeklyStats = JSON.parse(localStorage.getItem('flexDesk_weeklyStats')) || [0, 0, 0, 0, 0, 0, 0];
            weeklyStats[todayIndex] += addedMinutes;
            localStorage.setItem('flexDesk_weeklyStats', JSON.stringify(weeklyStats));

            setTimeout(function() {
                timerView.classList.add('hidden');
                setupView.classList.remove('hidden');
                heroText.classList.remove('hidden'); 
            }, 1000); 
        }
    }, 1000);
}

startButton.addEventListener('click', function() {
    const selectedArea = targetAreaSelect.value;
    const activeTimeButton = document.querySelector('.time-btn.active');
    
    // Save to local storage
    localStorage.setItem('flexDesk_targetArea', selectedArea);
    localStorage.setItem('flexDesk_time', activeTimeButton.innerText);
    
    if (selectedArea === 'eyes') {
        routineVisual.src = './images/eyes-stretch.gif';
        proTipText.innerText = "The 20-20-20 Rule: Every 20 minutes, look at an object 20 feet away for 20 seconds to reduce eye strain and reset focus.";
    } 
    else if (selectedArea === 'neck') {
        routineVisual.src = './images/neck-stretch.gif';
        proTipText.innerText = "Throughout the day, perform gentle, complete shoulder rolls to release built-up tension.";
    } 
    else if (selectedArea === 'wrists') {
        routineVisual.src = './images/wrists-stretch.gif';
        proTipText.innerText = "Try spreading your fingers wide like a star, then tightly clench and release your fists.";
    } 
    else if (selectedArea === 'back') {
        routineVisual.src = './images/back-stretch.gif';
        proTipText.innerText = "Incorporate a seated spinal twist into your routine to help release deep back pain.";
    }

    let timeInSeconds = (activeTimeButton.innerText === '5 Min') ? 300 : 120;
    timerDisplay.innerText = (activeTimeButton.innerText === '5 Min') ? "05:00" : "02:00";
    
    chimeSound.play();
    startTimer(timeInSeconds); 

    setupView.classList.add('hidden');
    heroText.classList.add('hidden');
    timerView.classList.remove('hidden');
});

cancelButton.addEventListener('click', function() {
    clearInterval(countdownInterval); 
    timerView.classList.add('hidden');
    setupView.classList.remove('hidden');
    heroText.classList.remove('hidden');
});

// --- DASHBOARD RENDERING LOGIC ---
function renderChart() {
    let weeklyStats = JSON.parse(localStorage.getItem('flexDesk_weeklyStats')) || [0, 0, 0, 0, 0, 0, 0];
    
    if (chartInstance) {
        chartInstance.destroy();
    }

    const isDark = document.body.classList.contains('dark-theme');
    const textColor = isDark ? '#E0E0E0' : '#112D4E';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.2)' : '#E5E7EB';

    chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            datasets: [{
                label: 'Minutes Stretched',
                data: weeklyStats,
                backgroundColor: '#4372A5',
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { 
                    beginAtZero: true,
                    grid: { color: gridColor }, 
                    ticks: { color: textColor, stepSize: 5 }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: textColor }
                }
            },
            plugins: {
                legend: { display: false }
            }
        }
    });
}

statsBtn.addEventListener('click', () => {
    setupView.classList.add('hidden');
    timerView.classList.add('hidden');
    heroText.classList.add('hidden');
    statsView.classList.remove('hidden');
    renderChart();
});

closeStatsBtn.addEventListener('click', () => {
    statsView.classList.add('hidden');
    setupView.classList.remove('hidden');
    heroText.classList.remove('hidden');
});