
/**
 * Mystic Sound Utilities
 * Uses Web Audio API to generate soft, minimalist chimes
 */

let audioContext: AudioContext | null = null;

const getAudioContext = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
};

const playChime = (frequencies: number[], duration: number = 1.5, type: OscillatorType = 'sine') => {
  const ctx = getAudioContext();
  if (ctx.state === 'suspended') ctx.resume();

  const now = ctx.currentTime;
  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(0, now);
  masterGain.gain.linearRampToValueAtTime(0.1, now + 0.1);
  masterGain.gain.exponentialRampToValueAtTime(0.001, now + duration);
  masterGain.connect(ctx.destination);

  frequencies.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    
    // Slight stagger for a more organic feel
    const startTime = now + (i * 0.05);
    
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(0.05, startTime + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
    
    osc.connect(gain);
    gain.connect(masterGain);
    
    osc.start(startTime);
    osc.stop(startTime + duration);
  });
};

export const playStartSessionSound = () => {
  // Ascending soft harmony (C5, E5, G5)
  playChime([523.25, 659.25, 783.99], 2.0);
};

export const playEndSessionSound = () => {
  // Descending soft harmony (G5, E5, C5)
  playChime([783.99, 659.25, 523.25], 1.5);
};
