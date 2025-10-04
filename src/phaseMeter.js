const phaseMeter = document.querySelector(".phase-meter");
const fullNotesIndicator = document.querySelector(".full-notes-indicator");
const quarterNotesIndicator = document.querySelector(".quarter-notes-indicator");

let phaseMeterActive = false;
let animationFrame;
let startTime;

function updatePhaseMeter() {
  if (!phaseMeterActive) return;

  const currentTime = Date.now();
  const elapsed = currentTime - startTime;

  const fullNoteProgress = (elapsed % 1875) / 1875;
  const quarterNoteProgress = (elapsed % 468.75) / 468.75;

  if (fullNotesIndicator) {
    fullNotesIndicator.style.left = `${fullNoteProgress * 100}%`;
  }

  if (quarterNotesIndicator) {
    quarterNotesIndicator.style.left = `${quarterNoteProgress * 100}%`;
  }

  animationFrame = requestAnimationFrame(updatePhaseMeter);
}

function startPhaseMeter() {
  if (phaseMeterActive) return;

  phaseMeterActive = true;
  startTime = Date.now();
  updatePhaseMeter();
}

function stopPhaseMeter() {
  phaseMeterActive = false;
  if (animationFrame) {
    cancelAnimationFrame(animationFrame);
  }
  if (phaseMeter) {
    phaseMeter.style.display = "none";
  }
}

export { startPhaseMeter, stopPhaseMeter };
