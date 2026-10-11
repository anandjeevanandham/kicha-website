const animalButtons = document.querySelectorAll('.animal-card');
const soundStatus = document.getElementById('soundStatus');
const AudioContextClass = window.AudioContext || window.webkitAudioContext;
let audioContext;

function createNoiseBuffer(duration) {
  const frameCount = Math.floor(audioContext.sampleRate * duration);
  const buffer = audioContext.createBuffer(1, frameCount, audioContext.sampleRate);
  const samples = buffer.getChannelData(0);

  for (let i = 0; i < frameCount; i += 1) {
    samples[i] = Math.random() * 2 - 1;
  }

  return buffer;
}

function playTone({ frequency, endFrequency, type, start, duration, volume, filterType, filterFrequency }) {
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  const filter = audioContext.createBiquadFilter();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, start);
  oscillator.frequency.exponentialRampToValueAtTime(endFrequency, start + duration);
  filter.type = filterType;
  filter.frequency.value = filterFrequency;
  gain.gain.setValueAtTime(0.001, start);
  gain.gain.exponentialRampToValueAtTime(volume, start + 0.025);
  gain.gain.exponentialRampToValueAtTime(0.001, start + duration);

  oscillator.connect(filter);
  filter.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start(start);
  oscillator.stop(start + duration);
}

function playNoise({ start, duration, volume, filterType, filterFrequency }) {
  const source = audioContext.createBufferSource();
  const filter = audioContext.createBiquadFilter();
  const gain = audioContext.createGain();

  source.buffer = createNoiseBuffer(duration);
  filter.type = filterType;
  filter.frequency.value = filterFrequency;
  gain.gain.setValueAtTime(volume, start);
  gain.gain.exponentialRampToValueAtTime(0.001, start + duration);

  source.connect(filter);
  filter.connect(gain);
  gain.connect(audioContext.destination);
  source.start(start);
}

function playLion() {
  const now = audioContext.currentTime;

  playTone({
    frequency: 105,
    endFrequency: 57,
    type: 'sawtooth',
    start: now,
    duration: 0.9,
    volume: 0.28,
    filterType: 'lowpass',
    filterFrequency: 420,
  });
  playNoise({
    start: now,
    duration: 0.8,
    volume: 0.11,
    filterType: 'lowpass',
    filterFrequency: 600,
  });
}

function playDog() {
  const now = audioContext.currentTime;

  [0, 0.24, 0.48].forEach((offset) => {
    playTone({
      frequency: 185,
      endFrequency: 95,
      type: 'sawtooth',
      start: now + offset,
      duration: 0.16,
      volume: 0.24,
      filterType: 'lowpass',
      filterFrequency: 950,
    });
    playNoise({
      start: now + offset,
      duration: 0.12,
      volume: 0.09,
      filterType: 'bandpass',
      filterFrequency: 850,
    });
  });
}

function playCat() {
  const now = audioContext.currentTime;

  playTone({
    frequency: 460,
    endFrequency: 280,
    type: 'sawtooth',
    start: now,
    duration: 0.62,
    volume: 0.16,
    filterType: 'lowpass',
    filterFrequency: 1500,
  });
  playTone({
    frequency: 920,
    endFrequency: 560,
    type: 'triangle',
    start: now,
    duration: 0.62,
    volume: 0.045,
    filterType: 'lowpass',
    filterFrequency: 1800,
  });
}

const animalSounds = {
  lion: { play: playLion, message: 'The lion roars!' },
  dog: { play: playDog, message: 'The dog barks!' },
  cat: { play: playCat, message: 'The cat meows!' },
};

animalButtons.forEach((button) => {
  button.addEventListener('click', async () => {
    const animal = animalSounds[button.dataset.animal];
    if (!animal) return;

    if (!AudioContextClass) {
      soundStatus.textContent = 'Sound is not supported in this browser.';
      return;
    }

    audioContext ??= new AudioContextClass();
    if (audioContext.state === 'suspended') {
      await audioContext.resume();
    }

    animal.play();
    soundStatus.textContent = animal.message;
  });
});
