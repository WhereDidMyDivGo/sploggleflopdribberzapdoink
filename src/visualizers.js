export function drawWaveform(canvas, analyser, color = "#00ff88", name = "") {
  const ctx = canvas.getContext("2d");
  const w = canvas.width;
  const h = canvas.height;

  function draw() {
    requestAnimationFrame(draw);
    const data = analyser.getValue();

    ctx.fillStyle = "#001122";
    ctx.fillRect(0, 0, w, h);

    const isDrums = name === "Drums";
    const isAcid = name === "Acid";
    const amplification = isDrums ? 3.0 : 1.0;
    const lineWidth = isDrums ? 4 : 2;

    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = color;
    ctx.beginPath();

    const step = w / data.length;
    for (let i = 0; i < data.length; i++) {
      const x = i * step;

      let amplifiedData = data[i] * amplification;
      amplifiedData = Math.max(-1, Math.min(1, amplifiedData));

      const y = (1 - (amplifiedData + 1) / 2) * h;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();

    if (isAcid) {
      ctx.shadowColor = color;
      ctx.shadowBlur = 8;
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    ctx.strokeStyle = "#004422";
    ctx.lineWidth = 1;
    for (let i = 0; i < 4; i++) {
      const y = (i / 4) * h;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
  }
  draw();
}

export function drawFrequencyBars(canvas, analyser, color = "#ff4444", name = "") {
  const ctx = canvas.getContext("2d");
  const w = canvas.width;
  const h = canvas.height;

  let lastDrawTime = 0;
  const frameInterval = 1000 / 25;

  function draw(currentTime) {
    requestAnimationFrame(draw);

    if (currentTime - lastDrawTime < frameInterval) {
      return;
    }
    lastDrawTime = currentTime;

    const data = analyser.getValue();

    ctx.fillStyle = "#001122";
    ctx.fillRect(0, 0, w, h);

    const barWidth = w / data.length;

    for (let i = 0; i < data.length; i++) {
      let normalizedValue = (data[i] + 100) / 100;
      normalizedValue = Math.max(0, Math.min(1, normalizedValue));

      const barHeight = normalizedValue * h;
      const x = i * barWidth;
      const y = h - barHeight;

      if (isFinite(barHeight) && barHeight > 0) {
        const alpha = Math.floor(normalizedValue * 255)
          .toString(16)
          .padStart(2, "0");
        ctx.fillStyle = color + alpha;
        ctx.fillRect(x, Math.max(0, y), barWidth - 1, Math.max(1, barHeight));
      }
    }

    if (Math.floor(currentTime / 1000) % 2 === 0) {
      ctx.fillStyle = "#004422";
      ctx.font = "10px monospace";
      ctx.fillText("60Hz", 10, h - 5);
      ctx.fillText("1kHz", w / 2 - 15, h - 5);
      ctx.fillText("8kHz", w - 35, h - 5);
    }
  }
  draw(0);
}

export function drawSpectrogram(canvas, analyser, color = "#ffaa00", name = "") {
  const ctx = canvas.getContext("2d");
  const w = canvas.width;
  const h = canvas.height;

  if (!canvas.spectrogramData) {
    canvas.spectrogramData = [];
  }

  let lastDrawTime = 0;
  const frameInterval = 1000 / 20;

  function draw(currentTime) {
    requestAnimationFrame(draw);

    if (currentTime - lastDrawTime < frameInterval) {
      return;
    }
    lastDrawTime = currentTime;

    const data = analyser.getValue();

    canvas.spectrogramData.push([...data]);
    if (canvas.spectrogramData.length > w / 2) {
      canvas.spectrogramData.shift();
    }

    ctx.fillStyle = "#001122";
    ctx.fillRect(0, 0, w, h);

    const step = 2;
    for (let x = 0; x < canvas.spectrogramData.length; x += step) {
      const column = canvas.spectrogramData[x];
      const reducedHeight = Math.min(32, column.length);

      for (let y = 0; y < reducedHeight; y += step) {
        let intensity = (column[y] + 100) / 100;
        intensity = Math.max(0, Math.min(1, intensity));

        if (intensity > 0.1 && isFinite(intensity)) {
          const hue = (y / reducedHeight) * 60;
          const lightness = Math.max(20, Math.min(70, intensity * 70));

          ctx.fillStyle = `hsl(${hue}, 90%, ${lightness}%)`;

          const pixelY = h - (y / reducedHeight) * h;
          const pixelHeight = Math.max(step, (h / reducedHeight) * step);

          ctx.fillRect(x * step, Math.max(0, pixelY), step, pixelHeight);
        }
      }
    }

    if (Math.floor(currentTime / 2000) % 2 === 0) {
      ctx.fillStyle = "#666";
      ctx.font = "9px monospace";
      ctx.fillText("High", 5, 15);
      ctx.fillText("Mid", 5, h / 2);
      ctx.fillText("Low", 5, h - 5);
    }
  }
  draw(0);
}

export function drawHorizontalSpectrum(canvas, analyser, color = "#4444ff", name = "") {
  const ctx = canvas.getContext("2d");
  const w = canvas.width;
  const h = canvas.height;

  function draw() {
    requestAnimationFrame(draw);
    const data = analyser.getValue();

    ctx.fillStyle = "#001122";
    ctx.fillRect(0, 0, w, h);

    // 20Hz-500Hz range
    // ~44kHz = first 10% FFT data
    const bassRange = Math.floor(data.length * 0.1);
    const numBars = Math.min(64, bassRange);
    const barWidth = w / numBars;

    for (let i = 0; i < numBars; i++) {
      const dataIndex = i;

      let normalizedValue = (data[dataIndex] + 80) / 80;
      normalizedValue = Math.max(0, Math.min(1, normalizedValue));

      normalizedValue = Math.pow(normalizedValue, 0.7);

      const barHeight = normalizedValue * h * 0.9;
      const x = i * barWidth;
      const y = h - barHeight;

      if (isFinite(barHeight) && barHeight > 0.5) {
        const alpha = Math.max(0.3, normalizedValue);
        const alphaHex = Math.floor(alpha * 255)
          .toString(16)
          .padStart(2, "0");

        ctx.fillStyle = color + alphaHex;
        ctx.fillRect(x, y, barWidth - 1, barHeight);

        if (normalizedValue > 0.7) {
          ctx.fillStyle = color + "FF";
          ctx.fillRect(x, y, barWidth - 1, Math.min(3, barHeight));
        }
      }
    }

    ctx.fillStyle = "#888";
    ctx.font = "10px monospace";
    ctx.fillText("20Hz", 10, h - 5);
    ctx.fillText("200Hz", w / 4 - 15, h - 5);
    ctx.fillText("2kHz", w / 2 - 10, h - 5);
    ctx.fillText("20kHz", w - 35, h - 5);
  }
  draw();
}

export function drawMultiScope(canvas, analyser, color = "#00ff88", name = "") {
  drawWaveform(canvas, analyser, color, name);
}

export function drawScope(canvas, analyser) {
  drawWaveform(canvas, analyser, "#00ff88", "Master");
}

export function setupVisualizers(analyzers) {
  const visualizers = [
    { id: "scope-master", analyser: analyzers.master, color: "#00ff88", name: "Master", type: "waveform" },
    { id: "scope-kick", analyser: analyzers.kick, color: "#ff4444", name: "Kick", type: "spectrum" },
    { id: "scope-bass", analyser: analyzers.bass, color: "#4444ff", name: "Bass", type: "spectrum" },
    { id: "scope-acid", analyser: analyzers.acid, color: "#ff44ff", name: "Acid", type: "waveform" },
    { id: "scope-drums", analyser: analyzers.drums, color: "#ffaa00", name: "Drums", type: "waveform" },
  ];

  visualizers.forEach((viz) => {
    const canvas = document.getElementById(viz.id);
    if (canvas) {
      switch (viz.type) {
        case "bars":
          drawFrequencyBars(canvas, viz.analyser, viz.color, viz.name);
          break;
        case "spectrum":
          drawHorizontalSpectrum(canvas, viz.analyser, viz.color, viz.name);
          break;
        case "spectrogram":
          drawSpectrogram(canvas, viz.analyser, viz.color, viz.name);
          break;
        case "waveform":
        default:
          drawWaveform(canvas, viz.analyser, viz.color, viz.name);
          break;
      }
    }
  });

  const legacyCanvas = document.getElementById("scope");
  if (legacyCanvas) {
    drawScope(legacyCanvas, analyzers.master);
    console.log("Legacy scope visualization started");
  }
}
