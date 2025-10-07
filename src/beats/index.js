const registeredBeats = [];
let beatsLoaded = false;

const loadBeatsPromise = Promise.all([
  // import("./abdfjuyctw.js"),
  // import("./auytdrf.js"),
  // import("./beat.js"),
  import("./beat1.js"),
  //
  //
]).then(() => {
  beatsLoaded = true;
});

export function registerBeat(beatObject) {
  registeredBeats.push(beatObject);
  console.log("registered:", beatObject);
}

export async function getAvailableBeats() {
  if (!beatsLoaded) {
    await loadBeatsPromise;
  }
  return registeredBeats;
}

export async function loadBeat(index = 0) {
  if (!beatsLoaded) {
    await loadBeatsPromise;
  }
  return registeredBeats[index];
}
