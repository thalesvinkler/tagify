const flagColors = {
  Brasil: ["#1b9c3c", "#f4d000", "#1f3b88"],
  Argentina: ["#6ab7ff", "#ffffff", "#f4c430"],
  Chile: ["#2b4ea2", "#ffffff", "#d92b2b"],
  "Estados Unidos": ["#1e3a8a", "#ffffff", "#dc2626"],
  Portugal: ["#0f7a3b", "#d61f2a", "#f5f5f5"],
};

const state = {
  name: "Seu nome aqui",
  country: "Brasil",
  blood: "O+",
  accent: "#e63946",
};

const drawRoundedRect = (ctx, x, y, width, height, radius) => {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
};

const drawLabel = (ctx, canvas) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawRoundedRect(ctx, 20, 50, 880, 180, 36);
  ctx.fillStyle = "#0f172a";
  ctx.fill();

  drawRoundedRect(ctx, 30, 60, 230, 160, 32);
  const [main, secondary, detail] = flagColors[state.country] || flagColors.Brasil;
  ctx.fillStyle = main;
  ctx.fill();

  ctx.fillStyle = secondary;
  ctx.beginPath();
  ctx.moveTo(60, 140);
  ctx.lineTo(145, 85);
  ctx.lineTo(220, 140);
  ctx.lineTo(145, 195);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = detail;
  ctx.beginPath();
  ctx.arc(145, 140, 28, 0, Math.PI * 2);
  ctx.fill();

  ctx.font = "700 44px Inter, sans-serif";
  ctx.fillStyle = "#f8fafc";
  ctx.textAlign = "left";
  ctx.fillText(state.name.toUpperCase(), 280, 140);

  ctx.font = "600 26px Inter, sans-serif";
  ctx.fillStyle = "#e2e8f0";
  ctx.fillText(state.country.toUpperCase(), 280, 175);

  drawRoundedRect(ctx, 720, 70, 160, 140, 28);
  ctx.fillStyle = state.accent;
  ctx.fill();

  ctx.fillStyle = "#ffffff";
  ctx.font = "800 44px Inter, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(state.blood, 800, 135);

  ctx.beginPath();
  ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
  ctx.moveTo(715, 165);
  ctx.bezierCurveTo(700, 130, 725, 105, 740, 95);
  ctx.bezierCurveTo(755, 105, 780, 130, 765, 165);
  ctx.closePath();
  ctx.fill();
};

window.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("label-form");
  const nameInput = document.getElementById("athlete-name");
  const countrySelect = document.getElementById("country");
  const bloodSelect = document.getElementById("blood");
  const accentInput = document.getElementById("accent");
  const downloadButton = document.getElementById("download");
  const canvas = document.getElementById("label");
  const previewError = document.getElementById("preview-error");

  if (!form || !nameInput || !countrySelect || !bloodSelect || !accentInput || !downloadButton || !canvas) {
    if (previewError) {
      previewError.hidden = false;
    }
    return;
  }

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    if (previewError) {
      previewError.hidden = false;
    }
    return;
  }

  const updateState = () => {
    state.name = nameInput.value.trim() || "Seu nome aqui";
    state.country = countrySelect.value;
    state.blood = bloodSelect.value;
    state.accent = accentInput.value;
    drawLabel(ctx, canvas);
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    updateState();
  });

  [nameInput, countrySelect, bloodSelect, accentInput].forEach((field) => {
    field.addEventListener("input", updateState);
  });

  const downloadImage = () => {
    const link = document.createElement("a");
    link.download = `tagify-${state.name.replace(/\s+/g, "-").toLowerCase()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  downloadButton.addEventListener("click", downloadImage);

  updateState();
});
