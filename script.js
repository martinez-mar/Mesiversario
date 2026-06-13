// --- Template Initialization ---
const initTemplate = () => {
  // 1. Page Title
  document.title = config.pageTitle;

  // 1.b Favicon
  if (config.favicon) {
    const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = config.favicon;
    document.getElementsByTagName('head')[0].appendChild(link);
  }

  // 2. Loading Screen
  document.getElementById('loading-hint').textContent = config.loading.clickHint;
  document.getElementById('loading-msg').textContent = config.loading.message;

  // document.getElementById('hero-title').textContent = config.hero.title;
  document.getElementById('hero-final-text').textContent = config.hero.finalText;
  document.getElementById('scroll-text').textContent = config.hero.scrollText;
  document.querySelector('.btn-primary span').textContent = config.hero.buttonText;
  document.querySelector('.burning-heart').textContent = config.hero.heartCharacter || '❤️';

  // 4. Timeline Generation
  const timelineContainer = document.getElementById('timeline-container');
  config.timeline.forEach((event, index) => {
    const eventDiv = document.createElement('div');
    eventDiv.className = 'event';
    eventDiv.onclick = function () { toggleEvent(this); };

    // Media Logic (Images or Videos)
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

  // 5. Gallery Generation
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

  // 6. Final Message
  document.getElementById('final-message').innerHTML = config.finalMessage.content;

  // 7. Music Source
  const bgMusic = document.getElementById('bg-music');
  if (config.music && config.music.path) {
    bgMusic.src = config.music.path;
    bgMusic.volume = config.music.volume || 0.2;
  }
};

// --- Three.js Background Animation ---
const initThreeJS = () => {
  const container = document.getElementById('canvas-container');
  
  // Seguro de inicialización por si el DOM no está completamente listo en Live Server
  if (!container) {
    console.warn("Esperando a que el contenedor del canvas esté disponible...");
    setTimeout(initThreeJS, 100);
    return;
  }

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 30;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  // Parámetros mejorados para el universo interactivo en 3D
  const parameters = {
    count: 8000,          // Más estrellas para dar profundidad espacial
    size: 0.18,           // Tamaño ideal para simular brillo lejano
    radius: 45,           // Amplitud del espacio tridimensional
    branches: 5,          // Estructura galáctica de 5 brazos espirales
    spin: 1.2,
    randomness: 0.65,
    randomnessPower: 4,
    insideColor: '#ff7b54',  // Centro cálido/galáctico ardiente
    outsideColor: '#231548'  // Bordes profundos cósmicos
  };

  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(parameters.count * 3);
  const colors = new Float32Array(parameters.count * 3);

  const colorInside = new THREE.Color(parameters.insideColor);
  const colorOutside = new THREE.Color(parameters.outsideColor);

  for (let i = 0; i < parameters.count; i++) {
    const i3 = i * 3;
    const radius = Math.random() * parameters.radius;
    const spinAngle = radius * parameters.spin;
    const branchAngle = (i % parameters.branches) / parameters.branches * Math.PI * 2;

    const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius;
    const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius;
    const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius;

    positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
    positions[i3 + 1] = randomY;
    positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

    const mixedColor = colorInside.clone();
    mixedColor.lerp(colorOutside, radius / parameters.radius);

    colors[i3] = mixedColor.r;
    colors[i3 + 1] = mixedColor.g;
    colors[i3 + 2] = mixedColor.b;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: parameters.size,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true
  });

  const points = new THREE.Points(geometry, material);
  scene.add(points);

  // Inclinación tridimensional de la galaxia
  points.rotation.x = 0.6;
  points.rotation.z = 0.15;

  // Seguimiento interactivo del scroll
  let targetScrollY = 0;
  window.addEventListener('scroll', () => {
    targetScrollY = window.scrollY;
  });

  const animate = () => {
    // 1. Rotación cósmica continua sobre su eje
    points.rotation.y += 0.0015;
    
    // 2. Movimiento oscilatorio sutil (gravedad cero)
    const elapsedTime = performance.now() * 0.0006;
    points.position.y = Math.sin(elapsedTime) * 0.4;

    // 3. Efecto túnel y viaje espacial interactivo al hacer scroll
    points.rotation.x = 0.6 + (targetScrollY * 0.0004);
    points.position.z = (targetScrollY * 0.012);

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  };

  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });
};

// --- GSAP Animations ---
const initAnimations = () => {
  gsap.registerPlugin(ScrollTrigger);

  const heroTl = gsap.timeline();
  heroTl.from('.btn-primary', { scale: 0.8, opacity: 0, duration: 0.8, ease: 'back.out(1.7)', delay: 2 });

  // Timeline Events
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

  // Gallery Photos
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
  // Inicializar datos de plantilla primero
  initTemplate();

  // Iniciar universo y animaciones
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

// Typewriter Effect
const typeText = (element, text, speed = 75, callback) => {
  element.textContent = "";
  element.style.opacity = 1;
  let i = 0;

  const timer = setInterval(() => {
    if (i < text.length) {
      element.textContent += text.charAt(i);
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

  const startDateStr = config.hero.startDate;
  const startYear = parseInt(startDateStr.split('-')[0]);
  const startMonth = parseInt(startDateStr.split('-')[1]) - 1;
  const startDay = parseInt(startDateStr.split('-')[2]);

  const startDate = new Date(2023, 0, 1).getTime(); // Empieza el conteo desde el 1 de enero de 2023 para el efecto visual
  const endDate = new Date(startYear, startMonth, startDay).getTime(); // Termina EXACTAMENTE en tu fecha del config.js

  const formatDate = (date) => {
    const d = String(date.getDate()).padStart(2, '0');
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const y = date.getFullYear();
    return `${d}/${m}/${y}`;
  };

  typeText(h1, config.hero.title, 60, () => {
    el.innerText = formatDate(new Date(startDate));
    gsap.to(el, { opacity: 1, y: 0, duration: 1, ease: 'power2.out' });

    const duration = 2000;
    let startTime = null;

    const update = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      let progress = Math.min(elapsed / duration, 1);
      const easedProgress = Math.pow(progress, 3);

      const currentMap = startDate + (endDate - startDate) * easedProgress;
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

// Final Reveal Logic
const triggerFinalReveal = (dateElement) => {
  gsap.to(dateElement, {
    scale: 10,
    opacity: 0,
    duration: 1.5,
    ease: "power2.in",
    onComplete: () => {
      const h1 = document.querySelector('h1');
      const startY = h1.getBoundingClientRect().top;

      dateElement.style.display = 'none';
      const revealContainer = document.getElementById('final-reveal');

      if (revealContainer) {
        revealContainer.style.display = 'flex';
        const endY = h1.getBoundingClientRect().top;
        const deltaY = startY - endY;

        gsap.fromTo(h1,
          { y: deltaY },
          { y: 0, duration: 1.5, ease: "power3.inOut" }
        );

        gsap.to(revealContainer, {
          opacity: 1,
          duration: 1.5,
          delay: 0.3,
          ease: "power2.out",
          onComplete: () => {
            setupHeartScrollEffect();
          }
        });
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

// Forzar el scroll hacia arriba en recarga
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