export function startTimer(duration, display) {
  var timer = duration,
    minutes,
    seconds;
  setInterval(function () {
    minutes = parseInt(timer / 60, 10);
    seconds = parseInt(timer % 60, 10);

    if (minutes > 0)
      display.textContent = 'TIME: ' + minutes + 'm ' + seconds + 's';
    else display.textContent = 'TIME: ' + seconds + 's';

    if (--timer < 0) {
      alert('Time is up');
    }
  }, 1000);
}
