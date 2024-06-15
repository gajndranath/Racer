// Define cursor and cursorScale variables
let cursor = document.querySelector('.cursor');
let cursorScale = document.querySelectorAll('.cursor-scale'); 
let mouseX = 0;
let mouseY = 0;

// Update cursor position continuously
gsap.to({}, 0.016, {
  repeat: -1,
  onRepeat: function () {
    gsap.set(cursor, {
      css: {
        left: mouseX,
        top: mouseY,
      }
    });
  }
});


// Update mouseX and mouseY on mousemove event
window.addEventListener('mousemove', (e)=> {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

// Cursor scaling functionality
cursorScale.forEach(link => {
  link.addEventListener('mousemove', ()=> {
    cursor.classList.add('grow'); 
    if (link.classList.contains('small')){
      cursor.classList.remove('grow');
      cursor.classList.add('grow-small');
    }
  });
  
  link.addEventListener('mouseleave', ()=> {
    cursor.classList.remove('grow');
    cursor.classList.remove('grow-small');
  });
});


$(document).ready(function() {
  var header = $(".main-header");
  var aboutSection = $(".about");
  var aboutSectionOffset = aboutSection.offset().top;
  var headerHeight = header.outerHeight();
  var scrollPosition = $(window).scrollTop();
  var isScrolling = false;

  $(window).scroll(function() {
      if (!isScrolling) {
          isScrolling = true;
          scrollPosition = $(this).scrollTop();
          if (scrollPosition > aboutSectionOffset) {
              // Using GSAP for smooth transition
              gsap.to(header, {duration: 0.3, top: 0, ease: "power2.inOut", onComplete: function() {
                  isScrolling = false;
              }});
              header.addClass("sticky");
              $(".inner-header").addClass("sticky");
          } else {
              // Using GSAP for smooth transition
              gsap.to(header, {duration: 0.3, top: -headerHeight, ease: "power2.inOut", onComplete: function() {
                  isScrolling = false;
              }});
              header.removeClass("sticky");
              $(".inner-header").removeClass("sticky");
          }
      }
  });
});







// Scroll direction detection and control the marquee animation based on it
let currentScroll = 0;
let isScrollingDown = true;

let tween = gsap.to(".marquee__part", {xPercent: -100, repeat: -1, duration: 80, ease: "linear"}).totalProgress(0.5);

gsap.set(".marquee__inner", {xPercent: -50});

window.addEventListener("scroll", function(){
  
  if ( window.pageYOffset > currentScroll ) {
    isScrollingDown = true;
  } else {
    isScrollingDown = false;
  }
   
  gsap.to(tween, {
    timeScale: isScrollingDown ? 1 : -1
  });
  
  currentScroll = window.pageYOffset
});


// Debounce function to limit the frequency of scroll event handler execution
function debounce(func, delay) {
  let timeout;
  return function() {
    const context = this;
    const args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(context, args);
    }, delay);
  };
}

gsap.registerPlugin(ScrollTrigger);

const videoSection = document.querySelector(".video-section");
const rotatingImages = document.querySelectorAll(".rotating-image");

// Animation for scaling the video section
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: videoSection,
    start: "top 15%",
    endTrigger: ".video-section",
    end: "bottom 100%",
    scrub: true,
  }
});

tl.to(videoSection, { scale: 0.5, duration: 1 }); // Adjust duration for slower animation



// GSAP animation for rotating the image
gsap.registerPlugin(ScrollTrigger);

const rotationTimeline = gsap.timeline({
  repeat: -1, // Infinite rotation
  defaults: { 
    ease: "none"
  }
});

rotationTimeline.to(".rotating-image", { rotation: "+=360"}); // 360 degrees in 200 seconds for slower rotation

ScrollTrigger.create({
  animation: rotationTimeline,
  trigger: ".container",
  start: "top top",
  end: "bottom bottom",
  scrub: true // Smoothing effect
});

window.addEventListener("DOMContentLoaded", () => {
  const rotatingImages = document.querySelectorAll(".rotating-image");

  window.addEventListener("scroll", function() {
    rotatingImages.forEach((image, index) => {
      const rotationSpeed = (window.pageYOffset * (index + 1)) / 20; // Adjust the divisor to control the rotation speed for each image

      image.style.transform = `rotate(${rotationSpeed}deg)`;
    });
  });
});

// Disable cursor when hovering over carousel-wrapper
const carouselWrapperr = document.querySelector('.carousel-wrapper');

// Adjust the duration and steps for a smoother transition
const transitionDuration = 500; // in milliseconds
const steps = 50; // number of steps in the transition

carouselWrapperr.addEventListener('mouseenter', function () {
  const interval = transitionDuration / steps;
  let opacity = 1;

  // Gradually decrease opacity of the default cursor
  const decreaseOpacity = setInterval(() => {
    cursor.style.opacity = opacity;
    cardCursor.style.opacity = 1 - opacity;
    opacity -= 1 / steps;
    if (opacity <= 0) {
      clearInterval(decreaseOpacity);
    }
  }, interval);
});

carouselWrapperr.addEventListener('mouseleave', function () {
  const interval = transitionDuration / steps;
  let opacity = 0;

  // Gradually increase opacity of the default cursor
  const increaseOpacity = setInterval(() => {
    cursor.style.opacity = opacity;
    cardCursor.style.opacity = 1 - opacity;
    opacity += 1 / steps;
    if (opacity >= 1) {
      clearInterval(increaseOpacity);
    }
  }, interval);
});

// Check for mouse position during scrolling and switch cursors accordingly
let isMouseOverCarousel = false;

document.addEventListener('scroll', function () {
  // Check if mouse is over the carousel-wrapper
  if (!isMouseOverCarousel && cursor.style.opacity === '0') {
    cursor.style.opacity = '1';
    cardCursor.style.opacity = '0';
  }
});

carouselWrapperr.addEventListener('mouseenter', function () {
  isMouseOverCarousel = true;
});

carouselWrapperr.addEventListener('mouseleave', function () {
  isMouseOverCarousel = false;
});




// Initialize Swiper
const carouselWrapper = document.querySelector('.carousel-wrapper');
const carouselItems = document.querySelectorAll('.carousel-item');
const totalItems = carouselItems.length;
const slideWidth = carouselItems[0].offsetWidth + 20; // Width of one carousel item plus gap
const itemsPerPage = 4; // Number of cards per page view
const itemsPerSlide = 2; // Number of cards to slide at a time
let currentIndex = 0;
let autoSlideTimeout;
let slideInterval;
let startX = 0;
let isDragging = false;
let startPosition = 0;

// Set initial position of carousel items
gsap.set(carouselItems, { x: -slideWidth * currentIndex });

// Intersection Observer to detect when carousel is in view
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            autoSlide();
        } else {
            clearTimeout(autoSlideTimeout);
        }
    });
});

observer.observe(carouselWrapper);

// Auto slide after 2 seconds, stop after 5 seconds and then slide again
function autoSlide() {
    clearTimeout(autoSlideTimeout);
    autoSlideTimeout = setTimeout(() => {
        nextSlide();
        autoSlide();
    }, 4000);
}

// Function to move to the next slide
function nextSlide() {
    currentIndex = (currentIndex + itemsPerSlide) % totalItems;
    gsap.to(carouselItems, { x: -slideWidth * currentIndex, duration: 0.5, ease: 'power2.inOut' });
}

// Event listeners for mouse click and slide
carouselWrapper.addEventListener('mousedown', function(event) {
    isDragging = true;
    startX = event.clientX;
    startPosition = currentIndex * slideWidth;
    clearInterval(slideInterval);
    event.preventDefault(); // Prevent default text selection behavior
});

carouselWrapper.addEventListener('mousemove', function(event) {
    if (isDragging) {
        const xDiff = event.clientX - startX;
        currentIndex = Math.round((startPosition - xDiff) / slideWidth);
        gsap.to(carouselItems, { x: -slideWidth * currentIndex, duration: 0.5, ease: 'power2.inOut' });
    }
});

document.addEventListener('mouseup', function() {
    isDragging = false;
    autoSlide();
});

// Event listeners for keyboard navigation
document.addEventListener('keydown', function(event) {
    if (!isDragging) {
        if (event.key === 'ArrowLeft') {
            currentIndex = (currentIndex - itemsPerSlide + totalItems) % totalItems;
            gsap.to(carouselItems, { x: -slideWidth * currentIndex, duration: 0.5, ease: 'power2.inOut' });
        } else if (event.key === 'ArrowRight') {
            currentIndex = (currentIndex + itemsPerSlide) % totalItems;
            gsap.to(carouselItems, { x: -slideWidth * currentIndex, duration: 0.5, ease: 'power2.inOut' });
        }
    }
});

// Custom cursor
const cardCursor = document.querySelector('.card-cursor');

carouselWrapper.addEventListener('mousemove', function (event) {
  const x = event.clientX;
  const wrapperRect = carouselWrapper.getBoundingClientRect();
  const offsetX = x - wrapperRect.left;

  if (offsetX < wrapperRect.width / 2) {
    cardCursor.classList.remove('right');
    cardCursor.classList.add('left');
  } else {
    cardCursor.classList.remove('left');
    cardCursor.classList.add('right');
  }

  cardCursor.style.top = `${event.clientY}px`;
  cardCursor.style.left = `${event.clientX}px`;
});

carouselWrapper.addEventListener('mouseleave', function () {
  cardCursor.style.display = 'none';
});

carouselWrapper.addEventListener('mouseenter', function () {
  cardCursor.style.display = 'block';
});


// Initialize Intersection Observer for the carousel section
const carouselObserver = new IntersectionObserver(carouselCallback, { threshold: 0.5 });

// Observe the carousel section
const carouselSection = document.querySelector('.carousel-wrapper');
carouselObserver.observe(carouselSection);

// Function to handle carousel section intersection changes
function carouselCallback(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Start carousel animation
            startCarouselAnimation();
        } else {
            // Stop carousel animation
            stopCarouselAnimation();
        }
    });
}

// Function to start carousel animation
function startCarouselAnimation() {
    // Start your carousel animation here
    // For example, start rotating the images or initializing the slider
    carouselRotationTimeline.play();
    autoSlide();
}

// Function to stop carousel animation
function stopCarouselAnimation() {
    // Stop your carousel animation here
    // For example, pause the rotation or stop auto-sliding
    carouselRotationTimeline.pause();
    clearInterval(autoSlideTimeout);
}

// Initialize Intersection Observer for the video section
const videoObserver = new IntersectionObserver(videoCallback, { threshold: 0.5 });

// Observe the video section
const videoSectionElem = document.querySelector('.video-section');
videoObserver.observe(videoSectionElem);

// Function to handle video section intersection changes
function videoCallback(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Start video playback
            startVideo();
        } else {
            // Pause video playback
            pauseVideo();
        }
    });
}

// Function to start video playback
function startVideo() {
    const videoElem = document.querySelector('.video-demo');
    videoElem.play();
}

// Function to pause video playback
function pauseVideo() {
    const videoElem = document.querySelector('.video-demo');
    videoElem.pause();
}

// Initialize Intersection Observer for the slider section
const sliderObserver = new IntersectionObserver(sliderCallback, { threshold: 0.5 });

// Observe the slider section
const sliderSection = document.querySelector('.slider-section');
sliderObserver.observe(sliderSection);

// Function to handle slider section intersection changes
function sliderCallback(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Start slider animation
            startSliderAnimation();
        } else {
            // Stop slider animation
            stopSliderAnimation();
        }
    });
}

// Function to start slider animation
function startSliderAnimation() {
    // Start your slider animation here
    // For example, start transitioning slides or auto-sliding
    // Add your slider animation logic here
}

// Function to stop slider animation
function stopSliderAnimation() {
    // Stop your slider animation here
    // For example, pause the slider or clear auto-sliding timer
    // Add your slider stop logic here
}
