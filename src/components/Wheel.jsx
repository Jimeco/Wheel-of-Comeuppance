import React, { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import './Wheel.css';

const Wheel = ({ choices }) => {
  const canvasRef = useRef(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [angle, setAngle] = useState(0);
  const [result, setResult] = useState(null);

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
        setResult(choices[index]);
        confetti();
        new Audio('/fanfare.mp3').play();
      }
    };

    requestAnimationFrame(animate);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const radius = canvas.width / 2;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

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