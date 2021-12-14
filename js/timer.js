import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase';

export function startTimer(boat, duration, display) {
  let minutes,
    seconds,
    timer = duration;
  const scoreCollectionRef = collection(db, 'score');

  const countdown = setInterval(async function () {
    minutes = parseInt(timer / 60, 10);
    seconds = parseInt(timer % 60, 10);

    if (minutes > 0)
      display.textContent = 'TIME: ' + minutes + 'm ' + seconds + 's';
    else display.textContent = 'TIME: ' + seconds + 's';

    if (--timer < 0) {
      await addDoc(scoreCollectionRef, {
        name: sessionStorage.getItem('current-user'),
        score: boat.score,
      });
      alert(`Score: ${boat.score}`);
      clearInterval(countdown);
    }
  }, 1000);
}
