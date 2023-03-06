import { writable } from "svelte/store";
const points = writable(0);

class Timer {
  startTime: number;
  endTime: number;
  

  constructor() {
    this.startTime = performance.now();
    this.endTime = performance.now();
    
  }

  start() {
    this.startTime = performance.now();
  }

  end() {
    this.endTime = performance.now();
    var timeDiff = this.endTime - this.startTime; //in ms
    // strip the ms
    timeDiff /= 1000;

    // get seconds
    var seconds = timeDiff;
    return seconds;
  }
}

function timeToPoints(time: number) {
  return Math.max(Math.round(-45*time + 1000),0);
}

export { Timer, points, timeToPoints };
