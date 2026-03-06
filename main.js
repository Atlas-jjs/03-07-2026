import gsap from "https://cdn.jsdelivr.net/npm/gsap@3.14.1/index.js";

const SLIDE_WIDTH = 300;
const SLIDE_HEIGHT = 412.5;
const SLIDE_GAP = 100;
const SLIDE_COUNT = 21;
const ARC_DEPTH = 200;
const CENTER_LIFT = 100;
const SCROLL_LERP = 0.05;

const slideSources = Array.from(
  { length: SLIDE_COUNT },
  (_, i) => `res/images/img${i + 1}.png`,
);

const slideTitles = [
  "Happy 21st birthday to the most beautiful girl in my life!",
  "I love the way you make me laugh",
  "You make my world brighter every single day",
  "You are my peace, my judger, my joy, and my favorite person",
  "Your smile is still and will always be my favorite sight in the world.",
  "Thank you for filling my life with so much happiness",
  "Loving you is the easiest thing I have ever done",
  "I am so lucky to have you by my side",
  "Life became sweeter the moment you came into it",
  "Being with you feels like home",
  "You are more amazing than you realize",
  "Your judgerness, kindness and heart inspire me every day",
  "I am proud of the woman you are becoming",
  "My heart will always belong to you",
  "You make my life more meaningful",
  "Thank you for loving me the way you do",
  "I will always cherish every memory we create together",
  "You make ordinary days feel magical",
  "Life became sweeter the moment you came into it",
  "I can’t wait to celebrate many more birthdays with you",
  "Happy 21st birthday, my love! ❤️",
];

const sliderContainer = document.querySelector(".slider");
const titleDisplay = document.getElementById("slide-title");

const trackWidth = SLIDE_COUNT * SLIDE_GAP;
let windowWidth = window.innerWidth;
let windowHeight = window.innerHeight;
let windowCenterX = windowWidth / 2;
let arcBaselineY = windowHeight * 0.4;

slideSources.forEach((arc, index) => {
  const slideEl = document.createElement("div");
  slideEl.classList.add("slide");

  const imgE1 = document.createElement("img");
  imgE1.src = arc;
  slideEl.appendChild(imgE1);

  sliderContainer.appendChild(slideEl);
});

const slideElements = gsap.utils.toArray(".slide");

function computeSlideTransform(slideIndex, scrollOffset) {
  let wrappedOffsetX =
    (((slideIndex * SLIDE_GAP - scrollOffset) % trackWidth) + trackWidth) %
    trackWidth;

  if (wrappedOffsetX > trackWidth / 2) wrappedOffsetX -= trackWidth;

  const slideCenterX = windowCenterX + wrappedOffsetX;
  const normalizedDist = (slideCenterX - windowCenterX) / (windowWidth * 0.5);
  const absDist = Math.min(Math.abs(normalizedDist), 1.3);

  const scaleFactor = Math.max(1 - absDist * 0.8, 0.25);
  const scaledWidth = SLIDE_WIDTH * scaleFactor;
  const scaledHeight = SLIDE_HEIGHT * scaleFactor;

  const clampedDist = Math.min(absDist, 1);
  const arcDropY = (1 - Math.cos(clampedDist * Math.PI)) * 0.5 * ARC_DEPTH;

  const centerLiftY = Math.max(1 - absDist * 2, 0) * CENTER_LIFT;

  return {
    x: slideCenterX - scaledWidth / 2,
    y: arcBaselineY - scaledHeight / 2 + arcDropY - centerLiftY,
    width: scaledWidth,
    height: scaledHeight,
    zIndex: Math.round((1 - absDist) * 100),
    distanceFromCenter: Math.abs(wrappedOffsetX),
  };
}

function layoutSlides(scrollOffset) {
  slideElements.forEach((slideEl, i) => {
    const { x, y, width, height, zIndex } = computeSlideTransform(
      i,
      scrollOffset,
    );
    gsap.set(slideEl, { x, y, width, height, zIndex });
  });
}

layoutSlides(0);

let scrollTarget = 0;
let scrollCurrent = 0;

sliderContainer.addEventListener(
  "wheel",
  (e) => {
    e.preventDefault();
    scrollTarget += e.deltaY * 0.5;
  },
  { passive: false },
);

let touchStartX = 0;

sliderContainer.addEventListener("touchstart", (e) => {
  touchStartX = e.touches[0].clientX;
});

sliderContainer.addEventListener(
  "touchmove",
  (e) => {
    e.preventDefault();
    const touchCurrentX = e.touches[0].clientX;
    scrollTarget += (touchStartX - touchCurrentX) * 1.2;
    touchStartX = touchCurrentX;
  },
  { passive: false },
);

let activeSlideIndex = -1;

function syncActiveTitle(scrollOffset) {
  let closestIndex = 0;
  let closestDist = Infinity;

  slideElements.forEach((_, i) => {
    const { distanceFromCenter } = computeSlideTransform(i, scrollOffset);

    if (distanceFromCenter < closestDist) {
      closestDist = distanceFromCenter;
      closestIndex = i;
    }
  });

  if (closestIndex !== activeSlideIndex) {
    activeSlideIndex = closestIndex;
    titleDisplay.textContent = slideTitles[closestIndex];
  }
}

function animate() {
  scrollCurrent += (scrollTarget - scrollCurrent) * SCROLL_LERP;

  layoutSlides(scrollCurrent);
  syncActiveTitle(scrollCurrent);

  requestAnimationFrame(animate);
}

animate();
