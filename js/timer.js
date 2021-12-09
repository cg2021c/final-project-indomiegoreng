const timer = document.getElementById('timer');

var min = 0;
var sec = 0;

function startTimer() {
  timerCycle();
}

setInterval(() => {
  sec = parseInt(sec);
  min = parseInt(min);

  sec = sec + 1;

  if (sec == 60) {
    min = min + 1;
    sec = 0;
  }
  if (min == 60) {
    hr = hr + 1;
    min = 0;
    sec = 0;
  }

  if (sec < 10 || sec == 0) {
    sec = sec;
  }

  if (min < 10 || min == 0) {
    min = min;
  }

  if (min > 0) {
    timer.innerHTML = 'TIME: ' + min + 'm ' + sec + 's';
  } else {
    timer.innerHTML = 'TIME: ' + sec + 's';
  }
}, 1000);
