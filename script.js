
/* =========================================
   ADLI PROFILE — INTERACTIONS
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.getElementById("sidebar");
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = [...document.querySelectorAll(".nav-link")];
  const sections = [...document.querySelectorAll("main section[id]")];
  const progressBar = document.getElementById("scrollProgress");
  const backToTop = document.getElementById("backToTop");
  const year = document.getElementById("year");

  // Footer year
  if (year) {
    year.textContent = new Date().getFullYear();
  }

  // Mobile navigation
  function closeMenu() {
    sidebar.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Buka navigasi");
  }

  menuToggle.addEventListener("click", () => {
    const isOpen = sidebar.classList.toggle("open");

    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Tutup navigasi" : "Buka navigasi"
    );
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      closeMenu();
    });
  });

  // Close navigation when clicking outside
  document.addEventListener("click", (event) => {
    const isMobile = window.matchMedia("(max-width: 760px)").matches;

    if (
      isMobile &&
      sidebar.classList.contains("open") &&
      !sidebar.contains(event.target) &&
      !menuToggle.contains(event.target)
    ) {
      closeMenu();
    }
  });

  // Close navigation with Escape
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  // Active navigation based on visible section
  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const currentId = entry.target.id;

          navLinks.forEach((link) => {
            const isActive =
              link.getAttribute("href") === `#${currentId}`;

            link.classList.toggle("active", isActive);

            if (isActive) {
              link.setAttribute("aria-current", "location");
            } else {
              link.removeAttribute("aria-current");
            }
          });
        });
      },
      {
        rootMargin: "-25% 0px -60% 0px",
        threshold: 0
      }
    );

    sections.forEach((section) => {
      sectionObserver.observe(section);
    });
  }

  // Reveal content when it enters the viewport
  const revealElements = document.querySelectorAll(
    ".panel, .interest-card, .education-card, .dream-banner, .quote-panel"
  );

  if (
    "IntersectionObserver" in window &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    revealElements.forEach((element) => {
      element.classList.add("reveal");
    });

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -30px 0px"
      }
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });
  }

  // Scroll progress and back-to-top button
  let ticking = false;

  function updateScrollUI() {
    const scrollableHeight =
      document.documentElement.scrollHeight - window.innerHeight;

    const progress =
      scrollableHeight > 0
        ? (window.scrollY / scrollableHeight) * 100
        : 0;

    progressBar.style.width = `${progress}%`;

    backToTop.classList.toggle("visible", window.scrollY > 450);

    ticking = false;
  }

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollUI);
        ticking = true;
      }
    },
    { passive: true }
  );

  backToTop.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches
        ? "auto"
        : "smooth"
    });
  });

  // Keep mobile menu closed when returning to desktop
  window.addEventListener("resize", () => {
    if (window.innerWidth > 760) {
      closeMenu();
    }
  });

  // Sharingan portrait: fallback foto + putar ulang animasi
  const portrait = document.getElementById("heroPortrait");

  if (portrait) {
    const photo = portrait.querySelector(".portrait-photo img");

    function markNoPhoto() {
      portrait.classList.add("no-photo");
    }

    if (photo) {
      photo.addEventListener("error", markNoPhoto);

      // Kalau gambar sudah gagal dimuat sebelum script berjalan
      if (photo.complete && photo.naturalWidth === 0) {
        markNoPhoto();
      }
    }

    function replayEyeOpening() {
      portrait.classList.remove("is-opening");
      void portrait.offsetWidth; // paksa reflow agar animasi mulai ulang
      portrait.classList.add("is-opening");
    }

    portrait.addEventListener("click", replayEyeOpening);

    portrait.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        replayEyeOpening();
      }
    });
  }

  updateScrollUI();
});
// =========================================
// LOGIKA INTERAKSI & GAME 3D THREE.JS
// =========================================

document.addEventListener("DOMContentLoaded", () => {
  // 1. Tahun Otomatis Footer
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // 2. Navigation & Mobile Menu Toggle
  const menuToggle = document.getElementById("menuToggle");
  const navigation = document.getElementById("navigation");

  if (menuToggle && navigation) {
    menuToggle.addEventListener("click", () => {
      navigation.classList.toggle("open");
    });
  }

  // 3. Scroll Progress & Back To Top Button
  const progressBar = document.getElementById("scrollProgress");
  const backToTop = document.getElementById("backToTop");

  window.addEventListener("scroll", () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (window.scrollY / totalHeight) * 100;
    if (progressBar) progressBar.style.width = `${progress}%`;

    if (backToTop) {
      if (window.scrollY > 400) {
        backToTop.classList.add("visible");
      } else {
        backToTop.classList.remove("visible");
      }
    }
  });

  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // 4. Sharingan Eye Click Replay Animation
  const portrait = document.getElementById("heroPortrait");
  if (portrait) {
    portrait.addEventListener("click", () => {
      portrait.classList.remove("is-opening");
      void portrait.offsetWidth; // Force Reflow
      portrait.classList.add("is-opening");
    });
  }

  // =========================================
  // 5. THREE.JS 3D FPS GAME LOGIC
  // =========================================
  const gameContainer = document.getElementById("game-container");

  if (gameContainer && typeof THREE !== "undefined") {
    let scene, camera, renderer;
    let targets = [];
    let score = 0;
    let isGameOver = false;
    let isPointerLocked = false;

    const scoreEl = document.getElementById("score");
    const finalScoreEl = document.getElementById("final-score");
    const gameOverScreen = document.getElementById("game-over-screen");
    const restartBtn = document.getElementById("restart-btn");
    const instructions = document.getElementById("instructions");

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(0, 0);

    let lastSpawnTime = 0;
    let spawnInterval = 1500;

    function initFPSGame() {
      // Scene
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0x08090d);
      scene.fog = new THREE.FogExp2(0x08090d, 0.018);

      // Camera
      camera = new THREE.PerspectiveCamera(
        75,
        gameContainer.clientWidth / gameContainer.clientHeight,
        0.1,
        1000
      );
      camera.position.set(0, 1.6, 0);

      // Renderer
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(gameContainer.clientWidth, gameContainer.clientHeight);
      renderer.shadowMap.enabled = true;
      gameContainer.appendChild(renderer.domElement);

      // Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xed263f, 0.9);
      directionalLight.position.set(10, 20, 10);
      directionalLight.castShadow = true;
      scene.add(directionalLight);

      // Arena & Model Senjata
      createEnvironment();
      createGun();

      // Listeners
      window.addEventListener("resize", onWindowResize);
      gameContainer.addEventListener("click", onClickToShoot);
      if (restartBtn) restartBtn.addEventListener("click", resetGame);

      setupPointerLock();
      animate(0);
    }

    function createEnvironment() {
      const floorGeo = new THREE.PlaneGeometry(100, 100);
      const floorMat = new THREE.MeshStandardMaterial({ color: 0x101117, roughness: 0.8 });
      const floor = new THREE.Mesh(floorGeo, floorMat);
      floor.rotation.x = -Math.PI / 2;
      floor.receiveShadow = true;
      scene.add(floor);

      const gridHelper = new THREE.GridHelper(100, 40, 0xed263f, 0x222233);
      gridHelper.position.y = 0.01;
      scene.add(gridHelper);
    }

    let gunMesh;
    function createGun() {
      const gunGeo = new THREE.BoxGeometry(0.12, 0.12, 0.45);
      const gunMat = new THREE.MeshStandardMaterial({ color: 0x1f1f2e, metalness: 0.8 });
      gunMesh = new THREE.Mesh(gunGeo, gunMat);
      gunMesh.position.set(0.2, -0.15, -0.4);
      camera.add(gunMesh);
      scene.add(camera);
    }

    function spawnTarget() {
      const size = 1.2;
      const targetGeo = new THREE.BoxGeometry(size, size, size);
      const targetMat = new THREE.MeshStandardMaterial({
        color: 0xed263f,
        emissive: 0x5a000e,
        roughness: 0.3
      });
      const target = new THREE.Mesh(targetGeo, targetMat);

      const randomX = (Math.random() - 0.5) * 18;
      target.position.set(randomX, size / 2, -35);
      target.castShadow = true;

      scene.add(target);
      targets.push(target);
    }

    function setupPointerLock() {
      gameContainer.addEventListener("click", () => {
        if (!isPointerLocked && !isGameOver) {
          gameContainer.requestPointerLock();
        }
      });

      document.addEventListener("pointerlockchange", () => {
        isPointerLocked = document.pointerLockElement === gameContainer;
        if (instructions) {
          instructions.style.display = isPointerLocked ? "none" : "block";
        }
      });

      document.addEventListener("mousemove", (e) => {
        if (!isPointerLocked || isGameOver) return;

        const euler = new THREE.Euler(0, 0, 0, "YXZ");
        euler.setFromQuaternion(camera.quaternion);

        euler.y -= e.movementX * 0.002;
        euler.x -= e.movementY * 0.002;
        euler.x = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, euler.x));

        camera.quaternion.setFromEuler(euler);
      });
    }

    function onClickToShoot() {
      if (!isPointerLocked || isGameOver) return;

      if (gunMesh) {
        gunMesh.position.z = -0.32;
        setTimeout(() => { gunMesh.position.z = -0.4; }, 50);
      }

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(targets);

      if (intersects.length > 0) {
        const hitTarget = intersects[0].object;
        scene.remove(hitTarget);
        targets = targets.filter((t) => t !== hitTarget);

        score += 1;
        if (scoreEl) scoreEl.textContent = score;
      }
    }

    function animate(currentTime) {
      requestAnimationFrame(animate);

      if (!isGameOver) {
        if (currentTime - lastSpawnTime > spawnInterval) {
          spawnTarget();
          lastSpawnTime = currentTime;
          spawnInterval = Math.max(400, 1500 - score * 35);
        }

        const speed = 0.09 + score * 0.003;

        for (let i = targets.length - 1; i >= 0; i--) {
          const target = targets[i];
          target.position.z += speed;
          target.rotation.x += 0.01;
          target.rotation.y += 0.01;

          if (target.position.z >= -1) {
            triggerGameOver();
            break;
          }
        }
      }

      renderer.render(scene, camera);
    }

    function triggerGameOver() {
      isGameOver = true;
      document.exitPointerLock();
      if (finalScoreEl) finalScoreEl.textContent = score;
      if (gameOverScreen) gameOverScreen.classList.remove("hidden");
    }

    function resetGame() {
      targets.forEach((t) => scene.remove(t));
      targets = [];

      score = 0;
      if (scoreEl) scoreEl.textContent = score;
      spawnInterval = 1500;
      isGameOver = false;

      camera.position.set(0, 1.6, 0);
      camera.quaternion.set(0, 0, 0, 1);

      if (gameOverScreen) gameOverScreen.classList.add("hidden");
      gameContainer.requestPointerLock();
    }

    function onWindowResize() {
      camera.aspect = gameContainer.clientWidth / gameContainer.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(gameContainer.clientWidth, gameContainer.clientHeight);
    }

    // Jalankan Game
    initFPSGame();
  }
});
/* =========================================
   LOGIKA MODAL LIGHTBOX FOTO MOBILE LEGENDS
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {
  const mlImageModal = document.getElementById("mlImageModal");
  const openMlModalBtn = document.getElementById("openMlModalBtn");
  const closeMlModalBtn = document.getElementById("closeMlModalBtn");
  const mlModalOverlay = document.getElementById("mlModalOverlay");
  const mlArtTrigger = document.getElementById("mlArtTrigger");

  function openMlModal() {
    if (mlImageModal) mlImageModal.classList.add("is-active");
  }

  function closeMlModal() {
    if (mlImageModal) mlImageModal.classList.remove("is-active");
  }

  if (openMlModalBtn) openMlModalBtn.addEventListener("click", openMlModal);
  if (mlArtTrigger) mlArtTrigger.addEventListener("click", openMlModal);
  if (closeMlModalBtn) closeMlModalBtn.addEventListener("click", closeMlModal);
  if (mlModalOverlay) mlModalOverlay.addEventListener("click", closeMlModal);
});