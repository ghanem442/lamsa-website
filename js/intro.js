// =====================================
// LAMSA Cinematic 3D Intro - PREMIUM
// =====================================

// Check if intro was already shown
if (sessionStorage.getItem('introShown')) {
  document.getElementById('cinematic-intro').remove();
  document.body.classList.remove('intro-active');
  document.querySelector('main').style.opacity = '1';
} else {
  // Show progress and start
  setTimeout(() => {
    updateProgress(0);
    setTimeout(() => initCinematicIntro(), 500);
  }, 200);
}

function updateProgress(percent) {
  const fill = document.getElementById('intro-progress-fill');
  const text = document.getElementById('intro-progress-text');
  
  if (fill) {
    fill.style.width = percent + '%';
  }
  
  if (text) {
    if (percent < 30) {
      text.textContent = 'تحميل التجربة...';
    } else if (percent < 70) {
      text.textContent = 'إعداد المشهد...';
    } else if (percent < 100) {
      text.textContent = 'تقريباً جاهز...';
    } else {
      gsap.to('#intro-progress', { opacity: 0, duration: 0.5 });
    }
  }
}

function initCinematicIntro() {
  const canvas = document.getElementById('intro-canvas');
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ 
    canvas: canvas, 
    alpha: true, 
    antialias: true 
  });

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  camera.position.set(0, 0, 9);

  updateProgress(20);

  // Premium Lighting Setup
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambientLight);

  const keyLight = new THREE.SpotLight(0xF5E6BE, 2);
  keyLight.position.set(6, 6, 6);
  keyLight.angle = 0.4;
  keyLight.penumbra = 1;
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.width = 2048;
  keyLight.shadow.mapSize.height = 2048;
  scene.add(keyLight);

  const fillLight = new THREE.SpotLight(0xD4AF37, 1.2);
  fillLight.position.set(-6, 4, -4);
  fillLight.angle = 0.4;
  fillLight.penumbra = 1;
  scene.add(fillLight);

  const rimLight = new THREE.PointLight(0xFFFFFF, 0.8);
  rimLight.position.set(0, 6, -4);
  scene.add(rimLight);

  const accentLight = new THREE.PointLight(0x7E1D26, 0.6);
  accentLight.position.set(0, -2, 4);
  scene.add(accentLight);

  updateProgress(40);

  // Perfume Bottle Group
  const bottleGroup = new THREE.Group();
  scene.add(bottleGroup);

  // Bottle Body (Ultra Premium Glass)
  const bottleGeometry = new THREE.CylinderGeometry(0.6, 0.7, 2.5, 64);
  const bottleMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0,
    roughness: 0.05,
    transmission: 0.98,
    thickness: 0.5,
    envMapIntensity: 1.5,
    clearcoat: 1,
    clearcoatRoughness: 0,
    ior: 1.5,
    transparent: true,
    opacity: 0.95,
    side: THREE.DoubleSide
  });
  const bottle = new THREE.Mesh(bottleGeometry, bottleMaterial);
  bottle.castShadow = true;
  bottle.receiveShadow = true;
  bottleGroup.add(bottle);

  // Perfume Liquid Inside (Burgundy)
  const liquidGeometry = new THREE.CylinderGeometry(0.55, 0.65, 1.8, 64);
  const liquidMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x7E1D26,
    metalness: 0.1,
    roughness: 0.1,
    transmission: 0.6,
    thickness: 0.8,
    transparent: true,
    opacity: 0.95,
    emissive: 0x3B070B,
    emissiveIntensity: 0.2
  });
  const liquid = new THREE.Mesh(liquidGeometry, liquidMaterial);
  liquid.position.y = -0.3;
  bottleGroup.add(liquid);

  updateProgress(60);

  // Luxurious Gold Band
  const collarGeometry = new THREE.CylinderGeometry(0.63, 0.63, 0.18, 64);
  const goldMaterial = new THREE.MeshStandardMaterial({
    color: 0xD4AF37,
    metalness: 0.95,
    roughness: 0.15,
    emissive: 0xAA820A,
    emissiveIntensity: 0.2
  });
  const collar = new THREE.Mesh(collarGeometry, goldMaterial);
  collar.position.y = 1.3;
  collar.castShadow = true;
  bottleGroup.add(collar);

  // Elegant Bottle Cap
  const capGroup = new THREE.Group();
  capGroup.position.y = 1.8;
  bottleGroup.add(capGroup);

  const capBodyGeometry = new THREE.CylinderGeometry(0.5, 0.6, 0.8, 64);
  const capMaterial = new THREE.MeshStandardMaterial({
    color: 0x2A0609,
    metalness: 0.85,
    roughness: 0.2,
    emissive: 0x1a0404,
    emissiveIntensity: 0.1
  });
  const capBody = new THREE.Mesh(capBodyGeometry, capMaterial);
  capBody.castShadow = true;
  capGroup.add(capBody);

  const capTopGeometry = new THREE.CylinderGeometry(0.35, 0.5, 0.35, 64);
  const capTopMaterial = new THREE.MeshStandardMaterial({
    color: 0xD4AF37,
    metalness: 0.98,
    roughness: 0.1,
    emissive: 0xAA820A,
    emissiveIntensity: 0.25
  });
  const capTop = new THREE.Mesh(capTopGeometry, capTopMaterial);
  capTop.position.y = 0.55;
  capTop.castShadow = true;
  capGroup.add(capTop);

  // Premium Brand Label "لمسة"
  const labelGeometry = new THREE.PlaneGeometry(1.3, 0.5);
  const labelCanvas = document.createElement('canvas');
  labelCanvas.width = 1024;
  labelCanvas.height = 512;
  const ctx = labelCanvas.getContext('2d');
  
  // Gradient background
  const gradient = ctx.createLinearGradient(0, 0, 1024, 0);
  gradient.addColorStop(0, 'rgba(212, 175, 55, 0)');
  gradient.addColorStop(0.5, 'rgba(212, 175, 55, 0.15)');
  gradient.addColorStop(1, 'rgba(212, 175, 55, 0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1024, 512);
  
  // Gold text with shadow
  ctx.shadowColor = 'rgba(212, 175, 55, 0.5)';
  ctx.shadowBlur = 20;
  ctx.fillStyle = '#D4AF37';
  ctx.font = 'bold 180px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('لمسة', 512, 256);
  
  // Subtitle
  ctx.shadowBlur = 10;
  ctx.fillStyle = '#F5E6BE';
  ctx.font = '60px Arial, sans-serif';
  ctx.fillText('LAMSA', 512, 380);
  
  const labelTexture = new THREE.CanvasTexture(labelCanvas);
  const labelMaterial = new THREE.MeshBasicMaterial({
    map: labelTexture,
    transparent: true,
    opacity: 0.9
  });
  const label = new THREE.Mesh(labelGeometry, labelMaterial);
  label.position.set(0, 0, 0.72);
  bottleGroup.add(label);

  // Decorative Rings
  const ring1Geometry = new THREE.TorusGeometry(0.66, 0.025, 32, 100);
  const ring1 = new THREE.Mesh(ring1Geometry, goldMaterial);
  ring1.position.y = 0.8;
  ring1.rotation.x = Math.PI / 2;
  ring1.castShadow = true;
  bottleGroup.add(ring1);

  const ring2Geometry = new THREE.TorusGeometry(0.64, 0.015, 32, 100);
  const ring2 = new THREE.Mesh(ring2Geometry, goldMaterial);
  ring2.position.y = 0.6;
  ring2.rotation.x = Math.PI / 2;
  bottleGroup.add(ring2);

  bottleGroup.scale.set(0, 0, 0);

  updateProgress(80);

  // Premium Perfume Mist Particles
  const particleCount = window.innerWidth < 768 ? 250 : 500;
  const mistParticles = new THREE.BufferGeometry();
  const mistPositions = new Float32Array(particleCount * 3);
  const mistSizes = new Float32Array(particleCount);
  const mistVelocities = [];

  for (let i = 0; i < particleCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.random() * 0.25;
    
    mistPositions[i * 3] = Math.cos(angle) * radius;
    mistPositions[i * 3 + 1] = 1.5;
    mistPositions[i * 3 + 2] = Math.sin(angle) * radius;

    mistSizes[i] = Math.random() * 0.1 + 0.05;

    mistVelocities.push({
      x: (Math.random() - 0.5) * 0.015,
      y: Math.random() * 0.025 + 0.015,
      z: (Math.random() - 0.5) * 0.015
    });
  }

  mistParticles.setAttribute('position', new THREE.BufferAttribute(mistPositions, 3));
  mistParticles.setAttribute('size', new THREE.BufferAttribute(mistSizes, 1));

  // Create particle texture
  const particleTexture = createParticleTexture();

  const mistMaterial = new THREE.PointsMaterial({
    size: 0.12,
    map: particleTexture,
    color: 0xF5E6BE,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true
  });

  const mist = new THREE.Points(mistParticles, mistMaterial);
  mist.scale.set(0, 0, 0);
  scene.add(mist);

  updateProgress(100);

  // Background Ambient Particles
  createBackgroundParticles();

  // Fade in canvas
  setTimeout(() => {
    canvas.classList.add('active');
  }, 500);

  // Animation Loop - Butter Smooth
  let mistActive = false;
  let time = 0;
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    time += delta;

    // Ultra smooth bottle float
    if (bottleGroup.scale.x > 0) {
      bottleGroup.position.y = Math.sin(time * 0.8) * 0.04;
      bottleGroup.rotation.y += delta * 0.05;
    }

    // Smooth mist particles
    if (mistActive && mist.scale.x > 0) {
      const positions = mistParticles.attributes.position.array;
      
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] += mistVelocities[i].x;
        positions[i * 3 + 1] += mistVelocities[i].y;
        positions[i * 3 + 2] += mistVelocities[i].z;

        // Elegant swirl
        positions[i * 3] += Math.sin(time * 0.5 + i * 0.1) * 0.0008;
        positions[i * 3 + 2] += Math.cos(time * 0.5 + i * 0.1) * 0.0008;

        // Reset if too high
        if (positions[i * 3 + 1] > 4.5) {
          const angle = Math.random() * Math.PI * 2;
          const radius = Math.random() * 0.25;
          positions[i * 3] = Math.cos(angle) * radius;
          positions[i * 3 + 1] = 1.5;
          positions[i * 3 + 2] = Math.sin(angle) * radius;
        }
      }
      
      mistParticles.attributes.position.needsUpdate = true;
    }

    // Subtle light movement
    keyLight.position.x = Math.sin(time * 0.3) * 2 + 6;
    keyLight.position.z = Math.cos(time * 0.3) * 2 + 6;

    renderer.render(scene, camera);
  }

  animate();

  // GSAP Timeline - Premium Smooth Animations
  const timeline = gsap.timeline({
    defaults: {
      ease: 'power2.inOut'
    },
    onComplete: () => {
      setTimeout(() => {
        finishIntro();
      }, 2000);
    }
  });

  // SCENE 1: Logo - Elegant entrance (0s - 3s)
  timeline
    .to('#intro-logo', {
      opacity: 1,
      scale: 1,
      duration: 1.2,
      ease: 'power3.out',
      delay: 1
    })
    .to('#intro-logo', {
      opacity: 1,
      duration: 1
    })
    .to('#intro-logo', {
      opacity: 0,
      scale: 0.98,
      duration: 0.8,
      ease: 'power2.in'
    });

  // SCENE 2: Bottle appears smoothly (3s - 6s)
  timeline
    .to(bottleGroup.scale, {
      x: 1,
      y: 1,
      z: 1,
      duration: 1.5,
      ease: 'back.out(1.2)'
    }, 3.5)
    .to(camera.position, {
      z: 7,
      duration: 2.5,
      ease: 'power1.inOut'
    }, 4);

  // SCENE 3: Cap opens elegantly & mist appears (6s - 9s)
  timeline
    .to(capGroup.position, {
      y: 2.8,
      duration: 1.5,
      ease: 'power2.out',
      onStart: () => {
        gsap.to(capGroup.rotation, {
          y: Math.PI * 0.4,
          z: 0.1,
          duration: 1.5,
          ease: 'power2.out'
        });
      }
    }, 6.5)
    .to(mist.scale, {
      x: 1,
      y: 1,
      z: 1,
      duration: 2,
      ease: 'power2.out',
      onStart: () => {
        mistActive = true;
      }
    }, 7)
    .to(mistMaterial, {
      opacity: 0.85,
      duration: 2,
      ease: 'power2.out'
    }, 7);

  // SCENE 4: Elegant camera orbit (9s - 11.5s)
  timeline
    .to(camera.position, {
      x: 2.5,
      y: 1.2,
      z: 7,
      duration: 2.5,
      ease: 'sine.inOut',
      onUpdate: () => {
        camera.lookAt(bottleGroup.position);
      }
    }, 9);

  // Handle window resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

function createParticleTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, 'rgba(245, 230, 190, 1)');
  gradient.addColorStop(0.3, 'rgba(212, 175, 55, 0.8)');
  gradient.addColorStop(0.6, 'rgba(212, 175, 55, 0.3)');
  gradient.addColorStop(1, 'rgba(212, 175, 55, 0)');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);
  
  return new THREE.CanvasTexture(canvas);
}

function createBackgroundParticles() {
  const container = document.getElementById('intro-particles');
  const particleCount = window.innerWidth < 768 ? 50 : 100;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'intro-particle';
    
    const startX = Math.random() * window.innerWidth;
    const startY = Math.random() * window.innerHeight;
    const duration = Math.random() * 5 + 4;
    const delay = Math.random() * 3;
    
    particle.style.left = startX + 'px';
    particle.style.top = startY + 'px';
    
    gsap.to(particle, {
      y: (Math.random() - 0.5) * window.innerHeight,
      x: (Math.random() - 0.5) * 100,
      opacity: [0, 0.7, 0],
      scale: [0.5, 1, 0.5],
      duration: duration,
      delay: delay,
      repeat: -1,
      ease: 'sine.inOut'
    });
    
    container.appendChild(particle);
  }
}

function finishIntro() {
  const introEl = document.getElementById('cinematic-intro');
  
  gsap.to(introEl, {
    opacity: 0,
    scale: 1.05,
    duration: 1.5,
    ease: 'power2.inOut',
    onComplete: () => {
      introEl.remove();
      document.body.classList.remove('intro-active');
      
      // Fade in main content
      gsap.to('main', { 
        opacity: 1, 
        duration: 1.2,
        ease: 'power2.out' 
      });
      
      // Mark intro as shown
      sessionStorage.setItem('introShown', 'true');
      
      // Redirect to main page
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 300);
    }
  });
}
