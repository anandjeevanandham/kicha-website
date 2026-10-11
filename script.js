const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');
const colorButtons = document.querySelectorAll('.color-swatch');
const sizeRange = document.getElementById('brushSize');
const sizeValue = document.getElementById('sizeValue');
const clearBtn = document.getElementById('clearCanvas');

let isDrawing = false;
let currentColor = '#ff7aa2';
let currentSize = Number(sizeRange.value);
let lastX = 0;
let lastY = 0;

function setupCanvas() {
  const ratio = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * ratio;
  canvas.height = rect.height * ratio;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, rect.width, rect.height);
  ctx.lineWidth = currentSize;
  ctx.strokeStyle = currentColor;
}

function getPosition(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
}

function startDrawing(event) {
  isDrawing = true;
  const position = getPosition(event);
  lastX = position.x;
  lastY = position.y;
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
}

function draw(event) {
  if (!isDrawing) return;

  const position = getPosition(event);
  ctx.strokeStyle = currentColor;
  ctx.lineWidth = currentSize;
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(position.x, position.y);
  ctx.stroke();

  lastX = position.x;
  lastY = position.y;
}

function stopDrawing() {
  isDrawing = false;
}

colorButtons.forEach((button) => {
  button.addEventListener('click', () => {
    currentColor = button.dataset.color;
    colorButtons.forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
  });
});

sizeRange.addEventListener('input', (event) => {
  currentSize = Number(event.target.value);
  sizeValue.textContent = `${currentSize}px`;
});

clearBtn.addEventListener('click', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
});

canvas.addEventListener('pointerdown', startDrawing);
canvas.addEventListener('pointermove', draw);
canvas.addEventListener('pointerup', stopDrawing);
canvas.addEventListener('pointerleave', stopDrawing);
canvas.addEventListener('pointercancel', stopDrawing);

window.addEventListener('resize', setupCanvas);

setupCanvas();
sizeValue.textContent = `${currentSize}px`;
