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

let countdownInterval; // The memory variable for our timer

// 1. Time Buttons Toggle
timeButtons.forEach(button => {
    button.addEventListener('click', function() {
        timeButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
    });
});

// 2. The Timer Engine (This was missing!)
// 2. The Timer Engine
function startTimer(durationInSeconds) {
    let timer = durationInSeconds;
    
    // Clear old timers
    clearInterval(countdownInterval); 

    countdownInterval = setInterval(function () {
        let minutes = parseInt(timer / 60, 10);
        let seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        timerDisplay.innerText = minutes + ":" + seconds;

        // WHEN THE TIMER HITS ZERO...
        if (--timer < 0) {
            clearInterval(countdownInterval); // Stop the clock
            timerDisplay.innerText = "00:00"; // Set text to zero

            // NEW: Wait 1 second (1000ms), then swap the screens back
            setTimeout(function() {
                timerView.classList.add('hidden');
                setupView.classList.remove('hidden');
                heroText.classList.remove('hidden'); // Brings the big text back!
            }, 1000); 
        }
    }, 1000);
}

// 3. Generate Routine (Merged logic)
startButton.addEventListener('click', function() {
    
    // -- GIF AND TIP SWAP --
    const selectedArea = targetAreaSelect.value;
    
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

    // -- TIMER START --
    const activeTimeButton = document.querySelector('.time-btn.active');
    let timeInSeconds = (activeTimeButton.innerText === '5 Min') ? 300 : 120;
    
    timerDisplay.innerText = (activeTimeButton.innerText === '5 Min') ? "05:00" : "02:00";
    
    // Fire up the clock!
    startTimer(timeInSeconds); 

    // -- VIEW SWAP --
    setupView.classList.add('hidden');
    heroText.classList.add('hidden');
    timerView.classList.remove('hidden');
});


// 4. Cancel Routine
cancelButton.addEventListener('click', function() {
    clearInterval(countdownInterval); // Stop the clock
    timerView.classList.add('hidden');
    setupView.classList.remove('hidden');
    heroText.classList.remove('hidden');
});