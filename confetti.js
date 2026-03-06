document.addEventListener("DOMContentLoaded", showConfetti);

document.getElementById("header").addEventListener("mouseover", showConfetti);
document.getElementById("header").addEventListener("click", showConfetti);

function showConfetti() {
  confetti({
    particleCount: 100,
    spread: 200,
  });
}
