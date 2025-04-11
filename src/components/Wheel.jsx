import React, { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { db, ref, onValue, set } from '../firebase';
import './Wheel.css';

const Wheel = ({ choices }) => {
  const canvasRef = useRef(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [angle, setAngle] = useState(0);
  const [result, setResult] = useState(null);

  // Listen for spin data from Firebase
  useEffect(() => {
    const spinRef = ref(db, 'currentSpin');
    onValue(spinRef, (snapshot) => {
      const data = snapshot.val();
      if (data && !isSpinning) {
        setAngle(data.angle);
        setResult(data.result);
        if (data.triggerConfetti) {
          confetti();
          new Audio('/fanfare.mp3').play();
        }
      }
    });
  }, []);

  const spinWheel = () => {
    if (isSpinning || choices.length < 2) return;
    setIsSpinning(true);
    const spins = 5 + Math.random() * 5;
    const degrees = spins * 360;
    const duration = 4000;
    const start = performance.now();

    const animate = (time) => {
      const elapsed = time - start;
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const current = angle + degrees * eased;
      setAngle(current);
      if (t < 1) requestAnimationFrame(animate);
      else {
        setIsSpinning(false);
        const finalAngle = (angle + degrees) % 360;
        const index = Math.floor(((360 - finalAngle) % 360) / (360 / choices.length));
        const resultChoice = choices[index];

        // Broadcast the result to Firebase
        set(ref(db, 'currentSpin'), {
          angle: finalAngle,
          result: resultChoice,
          triggerConfetti: true
        });
      }
    };

    requestAnimationFrame(animate);
  };

  // Draw the wheel
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const radius = canvas.width / 2;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (choices.length === 0) return;

    const segmentAngle = (2 * Math.PI) / choices.length;
    choices.forEach((choice, i) => {
      const start = i * segmentAngle;
      const end = start + segmentAngle;
      ctx.beginPath();
      ctx.moveTo(radius, radius);
      ctx.arc(radius, radius, radius, start + angle * Math.PI / 180, end + angle * Math.PI / 180);
      ctx.fillStyle = `hsl(${(i * 360) / choices.length}, 80%, 60%)`;
      ctx.fill();
      ctx.stroke();
      ctx.save();
      ctx.translate(radius, radius);
      ctx.rotate(start + segmentAngle / 2 + angle * Math.PI / 180);
      ctx.fillStyle = 'black';
      ctx.font = '14px sans-serif';
      ctx.fillText(choice, radius / 2, 0);
      ctx.restore();
    });
  }, [angle, choices]);

  return (
    <div className="wheel-container">
      <canvas ref={canvasRef} width={400} height={400} onClick={spinWheel} />
      {result && !isSpinning && <div className="result">🎉 {result} 🎉</div>}
    </div>
  );
};

export default Wheel;