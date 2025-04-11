import confetti from 'canvas-confetti';

// Optional: preload image
let imageUrl = '/assets/star.png';
let image = new Image();
image.src = imageUrl;

export function launchConfetti(mode = 'default') {
  switch (mode) {
    case 'emoji':
      confetti({
        particleCount: 80,
        spread: 100,
        origin: { y: 0.6 },
        shapes: ['text'],
        scalar: 1.2,
        ticks: 300,
        gravity: 0.8,
        drift: 0.5,
        // this will display 🎉 instead of the usual burst
        // can replace with emojis like '🔥', '🤯', etc.
        emoji: '🎉',
      });
      break;

    case 'image':
      confetti({
        particleCount: 60,
        spread: 100,
        origin: { y: 0.6 },
        shapes: ['image'],
        image: image,
        scalar: 0.6
      });
      break;

    default:
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        disableForReducedMotion: true,
        useWorker: true
      });
  }
}
