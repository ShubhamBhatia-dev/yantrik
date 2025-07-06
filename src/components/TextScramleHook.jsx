import { useEffect, useRef } from 'react';

export const useTextScramble = (el, phrases, interval = 5000) => {
  const chars = "!<>-_\\/[]{}—=+*^?#_____hgyflddlkmn gdrtujk,j ht  thb h___";
  const frame = useRef(0);
  const queue = useRef([]);
  const counter = useRef(0);

  const randomChar = () => chars[Math.floor(Math.random() * chars.length)];

  const update = () => {
    let output = "";
    let complete = 0;
    queue.current.forEach((q, i) => {
      let { from, to, start, end, char } = q;
      if (frame.current >= end) {
        complete++;
        output += to;
      } else if (frame.current >= start) {
        if (!char || Math.random() < 0.28) {
          char = randomChar();
          queue.current[i].char = char;
        }
        output += `<span class="dud">${char}</span>`;
      } else {
        output += from;
      }
    });
    el.current.innerHTML = output;
    if (complete === queue.current.length) {
      setTimeout(next, interval);
    } else {
      requestAnimationFrame(update);
      frame.current++;
    }
  };

  const setText = (newText) => {
    const oldText = el.current.innerText;
    const length = Math.max(oldText.length, newText.length);
    queue.current = [];
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || "";
      const to = newText[i] || "";
      const start = Math.floor(Math.random() * 60);
      const end = start + Math.floor(Math.random() * 60);
      queue.current.push({ from, to, start, end });
    }
    frame.current = 0;
    update();
  };

  const next = () => {
    setText(phrases[counter.current]);
    counter.current = (counter.current + 1) % phrases.length;
  };

  useEffect(() => {
    next();
  }, []);
};
