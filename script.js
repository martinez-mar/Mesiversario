// --- Template Initialization ---
const initTemplate = () => {
  document.title = config.pageTitle;

  if (config.favicon) {
    const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = config.favicon;
    document.getElementsByTagName('head')[0].appendChild(link);
  }

  document.getElementById('loading-hint').textContent = config.loading.clickHint;
  document.getElementById('loading-msg').textContent = config.loading.message;

  // Limpieza inicial anti-duplicados
  document.getElementById('hero-title').innerHTML = "";
  document.getElementById('hero-final-text').textContent = config.hero.finalText;
  document.getElementById('scroll-text').textContent = config.hero.scrollText;
  document.querySelector('.btn-primary span').textContent = config.hero.buttonText;
  document.querySelector('.burning-heart').textContent = config.hero.heartCharacter || '❤️‍🔥';

  const timelineContainer = document.getElementById('timeline-container');
  config.timeline.forEach((event, index) => {
    const eventDiv = document.createElement('div');
    eventDiv.className = 'event';
    eventDiv.onclick = function () { toggleEvent(this); };

    let mediaHtml = '';
    if (event.images && event.images.length > 0) {
      mediaHtml += '<div style="display: flex; justify-content: space-between; gap: 10px; margin: 1rem 0;">';
      event.images.forEach(img => {
        mediaHtml += `<img src="${img}" style="width: ${event.images.length > 1 ? '48%' : '100%'}; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.2);">`;
      });
      mediaHtml += '</div>';
    }

    if (event.videos && event.videos.length > 0) {
      mediaHtml += '<div style="display: flex; justify-content: center; gap: 10px; margin: 1rem 0;">';
      event.videos.forEach(vid => {
        mediaHtml += `<video src="${vid}" style="width: ${event.videos.length > 1 ? '45%' : '90%'}; border-radius: 8px;" autoplay loop muted playsinline></video>`;
      });
      mediaHtml += '</div>';
    }

    eventDiv.innerHTML = `
      <div class="card-glass event-card">
        <div class="event-title">${event.title}</div>
        <div class="event-content">
          ${event.content}
          ${mediaHtml}
          ${event.footer ? `<div style="text-align: center; font-size: 0.9rem; opacity: 0.8; margin-top: 10px;">${event.footer}</div>` : ''}
          ${event.extra || ''}
        </div>
      </div>
    `;
    timelineContainer.appendChild(eventDiv);
  });

  const galleryContainer = document.getElementById('gallery-container');
  document.getElementById('gallery-title').textContent = config.gallery.title;

  config.gallery.images.forEach(imgSrc => {
    const photoCard = document.createElement('div');
    photoCard.className = 'card-glass photo-card';
    photoCard.innerHTML = `
      <div class="placeholder-img">
        <img src="${imgSrc}" alt="Recuerdo" style="width: 100%; height: 100%; object-fit: cover;">
      </div>
    `;
    galleryContainer.appendChild(photoCard);
  });

  document.getElementById('final-message').innerHTML = config.finalMessage.content;

  const bgMusic = document.getElementById('bg-music');
  if (config.music && config.music.path) {
    bgMusic.src = config.music.path;
    bgMusic.volume = config.music.volume || 0.2;
  }
};

// --- Fondo Cósmico Nativo Inicial (Estrellas Pequeñas y Estéticas) ---
const initThreeJS = () => {
  const container = document.getElementById('canvas-container');
  if (!container) {
    setTimeout(initThreeJS, 100);
    return;
  }

  const canvas = document.createElement('canvas');
  container.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  let stars = [];
  const numStars = 180; 
  let targetScrollY = 0;

  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  window.addEventListener('resize', resize);
  resize();

  for (let i = 0; i < numStars; i++) {
    stars.push({
      x: Math.random() * canvas.width - canvas.width / 2,
      y: Math.random() * canvas.height - canvas.height / 2,
      z: Math.random() * canvas.width,
      color: Math.random() > 0.4 ? '#ff7b54' : '#a29bfe'
    });
  }

  window.addEventListener('scroll', () => {
    targetScrollY = window.scrollY;
  });

  const animate = () => {
    ctx.fillStyle = 'rgba(10, 6, 20, 0.18)'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    let speed = 1.2 + (targetScrollY * 0.03);

    stars.forEach(star => {
      star.z -= speed;

      if (star.z <= 0) {
        star.z = canvas.width;
        star.x = Math.random() * canvas.width - cx;
        star.y = Math.random() * canvas.height - cy;
      }

      const px = (star.x / star.z) * cx + cx;
      const py = (star.y / star.z) * cy + cy;
      const size = (1 - star.z / canvas.width) * 1.8; // Estrellas finitas

      if (px >= 0 && px <= canvas.width && py >= 0 && py <= canvas.height) {
        ctx.beginPath();
        ctx.arc(px, py, Math.max(0.1, size), 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.shadowBlur = 5;
        ctx.shadowColor = star.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    });

    requestAnimationFrame(animate);
  };

  animate();
};

// --- GSAP Animations ---
const initAnimations = () => {
  gsap.registerPlugin(ScrollTrigger);

  const heroTl = gsap.timeline();
  heroTl.from('.btn-primary', { scale: 0.8, opacity: 0, duration: 0.8, ease: 'back.out(1.7)', delay: 2 });

  gsap.utils.toArray('.event').forEach((event, i) => {
    gsap.from(event, {
      scrollTrigger: {
        trigger: event,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      },
      x: i % 2 === 0 ? -100 : 100,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    });
  });

  gsap.utils.toArray('.photo-card').forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: 'top 90%'
      },
      y: 100,
      opacity: 0,
      duration: 1,
      delay: (i % 4) * 0.1,
      ease: 'power4.out'
    });
  });
};

// --- UI Logic ---
document.addEventListener('DOMContentLoaded', () => {
  initTemplate();
  initThreeJS();
  initAnimations();

  window.scrollToSection = (id) => {
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
  };

  window.toggleEvent = (element) => {
    document.querySelectorAll('.event').forEach(event => {
      if (event !== element) {
        event.classList.remove('active');
      }
    });
    element.classList.toggle('active');
  };
});

// Typewriter Effect (Corregido)
const typeText = (element, text, speed = 75, callback) => {
  element.innerHTML = ""; 
  element.style.opacity = 1;
  let i = 0;

  const timer = setInterval(() => {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
    } else {
      clearInterval(timer);
      if (callback) callback();
    }
  }, speed);
};

// Date Counter Animation
const animateDateCounter = () => {
  const el = document.getElementById('hero-date-counter');
  const h1 = document.getElementById('hero-title');

  if (!el || !h1) return;
  
  h1.innerHTML = ""; 

  const startDate = new Date().getTime(); 
  const endDate = new Date(2023, 11, 13).getTime(); 

  const formatDate = (date) => {
    const d = String(date.getDate()).padStart(2, '0');
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const y = date.getFullYear();
    return `${d}/${m}/${y}`;
  };

  typeText(h1, config.hero.title, 60, () => {
    el.innerText = formatDate(new Date(startDate));
    gsap.to(el, { opacity: 1, y: 0, duration: 1, ease: 'power2.out' });

    const duration = 2500; 
    let startTime = null;

    const update = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      let progress = Math.min(elapsed / duration, 1);
      
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const currentMap = startDate - (startDate - endDate) * easedProgress;
      const dateObj = new Date(currentMap);

      el.innerText = formatDate(dateObj);

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.innerText = formatDate(new Date(endDate));
        triggerFinalReveal(el);
      }
    };

    setTimeout(() => {
      requestAnimationFrame(update);
    }, 500);
  });
};

// Final Reveal Logic Corregida (Fuerza el centrado de los textos)
const triggerFinalReveal = (dateElement) => {
  gsap.to(dateElement, {
    scale: 8,
    opacity: 0,
    duration: 1.2,
    ease: "power2.in",
    onComplete: () => {
      dateElement.style.display = 'none';
      
      const revealContainer = document.getElementById('final-reveal');
      const finalTitle = document.getElementById('hero-final-text');

      if (revealContainer) {
        revealContainer.style.display = 'flex';
        revealContainer.style.flexDirection = 'column';
        revealContainer.style.alignItems = 'center';
        revealContainer.style.opacity = 0;

        gsap.to(revealContainer, {
          opacity: 1,
          duration: 1.5,
          ease: "power2.out",
          onComplete: () => {
            setupHeartScrollEffect();
          }
        });

        gsap.fromTo(finalTitle,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.2, ease: "power3.out" }
        );
      }
    }
  });
};

const setupHeartScrollEffect = () => {
  const isMobile = window.innerWidth <= 768;

  gsap.to('#intro .heart-wrapper', {
    scrollTrigger: {
      trigger: '#intro',
      start: 'top top',
      end: 'bottom top',
      scrub: 1,
      onEnter: () => {
        const introHeart = document.querySelector('#intro .burning-heart');
        if (introHeart) introHeart.style.animation = 'none';
      },
      onLeaveBack: () => {
        const introHeart = document.querySelector('#intro .burning-heart');
        if (introHeart) introHeart.style.animation = 'burnPulse 1.5s infinite alternate';
      }
    },
    scale: isMobile ? 8 : 15,
    y: isMobile ? 300 : 600,
    opacity: 0,
    ease: "power1.in"
  });

  gsap.to('.scroll-indicator', {
    scrollTrigger: {
      trigger: '#intro',
      start: 'top top',
      end: '10% top',
      scrub: 1
    },
    opacity: 0,
    y: -20
  });
};

if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

// Interaction Logic
window.addEventListener('load', () => {
  const loader = document.getElementById('loader-overlay');
  const loaderBtn = document.querySelector('.loader-btn');
  const bgMusic = document.getElementById('bg-music');
  const musicToggle = document.getElementById('music-toggle');
  let isPlaying = false;

  const startExperience = () => {
    bgMusic.muted = false;
    bgMusic.volume = config.music.volume;
    bgMusic.play().then(() => {
      isPlaying = true;
      if (musicToggle) {
        musicToggle.classList.add('playing');
        musicToggle.querySelector('.music-icon').textContent = '🔊';
      }
    }).catch(err => {
      console.log('Error jugando la música:', err);
    });

    setTimeout(() => {
      loader.style.opacity = '0';
      loader.style.visibility = 'hidden';

      setTimeout(() => {
        ScrollTrigger.refresh();
        animateDateCounter();
      }, 500);
    }, 800);
  };

  if (loaderBtn) {
    loaderBtn.addEventListener('click', startExperience);
    const hint = document.querySelector('.click-hint');
    if (hint) hint.addEventListener('click', startExperience);
  }

  if (musicToggle && bgMusic) {
    musicToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (isPlaying) {
        bgMusic.pause();
        musicToggle.classList.remove('playing');
        musicToggle.querySelector('.music-icon').textContent = '🎵';
        isPlaying = false;
      } else {
        bgMusic.muted = false;
        bgMusic.volume = config.music.volume;
        bgMusic.play().then(() => {
          musicToggle.classList.add('playing');
          musicToggle.querySelector('.music-icon').textContent = '🔊';
          isPlaying = true;
        }).catch(err => {
          console.log('Error de reproducción:', err);
        });
      }
    });
  }
});