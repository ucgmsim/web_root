import { useEffect, useRef } from "react";
import * as THREE from "three";
import heroMeta from "../data/hero_meta.json";
import { HERO_BG } from "../theme";

const PLANE_HEIGHT = 10;
const INTRO_SECONDS = 2.6;

function loadTexture(loader, url, srgb) {
  return new Promise((resolve, reject) => {
    loader.load(
      url,
      (texture) => {
        if (srgb) texture.colorSpace = THREE.SRGBColorSpace;
        resolve(texture);
      },
      undefined,
      reject,
    );
  });
}

function easeOutCubic(t) {
  return 1 - (1 - t) ** 3;
}

/**
 * Three.js scene: NZ terrain displaced by elevation and coloured by NSHM 2022 hazard, with a slow sway
 */
export default function HeroScene({ onReady }) {
  const containerRef = useRef(null);
  const onReadyRef = useRef(onReady);

  useEffect(() => {
    onReadyRef.current = onReady;
  }, [onReady]);

  useEffect(() => {
    const container = containerRef.current;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.display = "block";
    renderer.domElement.setAttribute("aria-hidden", "true");
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(HERO_BG, 22, 40);
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
    camera.up.set(0, 0, 1);

    scene.add(new THREE.AmbientLight(0xffffff, 0.55));
    const sun = new THREE.DirectionalLight(0xfff1e0, 2.2);
    sun.position.set(-6, 8, 7);
    scene.add(sun);

    // Faint survey grid under the islands
    const grid = new THREE.GridHelper(48, 96, 0x334155, 0x1e293b);
    grid.rotation.x = Math.PI / 2;
    grid.position.z = -0.06;
    grid.material.transparent = true;
    grid.material.opacity = 0.4;
    scene.add(grid);

    const group = new THREE.Group();
    scene.add(group);

    const width = PLANE_HEIGHT * heroMeta.aspect;
    const disposables = [grid.geometry, grid.material];
    let disposed = false;
    let ready = false;
    let inView = true;
    let startTime = 0;
    let lastTime = 0;
    const pointer = { x: 0, y: 0 };

    const resize = () => {
      const { clientWidth, clientHeight } = container;
      if (!clientWidth || !clientHeight) return;
      renderer.setSize(clientWidth, clientHeight, false);
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
    };
    resize();

    const render = (time) => {
      if (!startTime) startTime = time;
      const t = (time - startTime) / 1000;
      // Frame-rate independent damping; clamp the step after a pause
      const delta = lastTime ? Math.min((time - lastTime) / 1000, 0.1) : 0;
      lastTime = time;
      const intro = easeOutCubic(Math.min(t / INTRO_SECONDS, 1));
      // Fit distance grows on narrow containers so the full length of NZ stays in view
      const fit = Math.max(1, 0.95 / camera.aspect);
      const distance = (19.5 - intro * 3.5) * fit;

      group.rotation.z = Math.sin(t * 0.12) * 0.09 - 0.04;
      const targetX = pointer.x * 1.1 + 0.3;
      const targetZ = distance * 0.72 + pointer.y * 0.6;
      camera.position.x = THREE.MathUtils.damp(camera.position.x, targetX, 3, delta);
      camera.position.y = -distance * 0.78;
      camera.position.z = THREE.MathUtils.damp(camera.position.z, targetZ, 3, delta);
      camera.lookAt(0.2, 0.6, 0);
      renderer.render(scene, camera);
    };

    // Only animate while the hero is on screen and the tab is visible
    const updateLoop = () => {
      const active = ready && inView && !document.hidden && !disposed;
      if (!active) lastTime = 0;
      renderer.setAnimationLoop(active ? render : null);
    };

    const loader = new THREE.TextureLoader();
    Promise.all([
      loadTexture(loader, "/hero/nz_color.webp", true),
      loadTexture(loader, "/hero/nz_height.png", false),
      loadTexture(loader, "/hero/nz_normal.webp", false),
      loadTexture(loader, "/hero/nz_glow.webp", true),
    ])
      .then(([colour, height, normal, glow]) => {
        disposables.push(colour, height, normal, glow);
        if (disposed) return;
        colour.anisotropy = renderer.capabilities.getMaxAnisotropy();

        const landGeometry = new THREE.PlaneGeometry(width, PLANE_HEIGHT, 320, 440);
        const landMaterial = new THREE.MeshStandardMaterial({
          map: colour,
          emissive: 0xffffff,
          emissiveMap: colour,
          emissiveIntensity: 0.42,
          displacementMap: height,
          displacementScale: 0.42,
          normalMap: normal,
          normalScale: new THREE.Vector2(0.8, 0.8),
          roughness: 0.92,
          metalness: 0,
          alphaTest: 0.5,
        });
        group.add(new THREE.Mesh(landGeometry, landMaterial));

        const pad = 1 + 2 * heroMeta.glowPadding;
        const glowGeometry = new THREE.PlaneGeometry(width * pad, PLANE_HEIGHT * pad);
        const glowMaterial = new THREE.MeshBasicMaterial({
          map: glow,
          transparent: true,
          opacity: 0.7,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        });
        const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
        glowMesh.position.z = -0.03;
        group.add(glowMesh);
        disposables.push(landGeometry, landMaterial, glowGeometry, glowMaterial);

        camera.position.set(0.3, -19.5 * 0.78, 19.5 * 0.72);
        ready = true;
        updateLoop();
        requestAnimationFrame(() => onReadyRef.current?.());
      })
      .catch(() => {
        // Poster stays visible if textures fail to load
      });

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    const visibility = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      updateLoop();
    });
    visibility.observe(container);
    document.addEventListener("visibilitychange", updateLoop);

    const onPointerMove = (event) => {
      const rect = container.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      pointer.y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    return () => {
      disposed = true;
      renderer.setAnimationLoop(null);
      resizeObserver.disconnect();
      visibility.disconnect();
      document.removeEventListener("visibilitychange", updateLoop);
      window.removeEventListener("pointermove", onPointerMove);
      disposables.forEach((item) => item.dispose());
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={containerRef} style={{ position: "absolute", inset: 0 }} />;
}
