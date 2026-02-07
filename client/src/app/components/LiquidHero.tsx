import { useRef, useState, useEffect, Suspense, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { ArrowDown } from "lucide-react";
import { motion, type Variants } from "framer-motion"; 
import { useLanguage } from "../context/LanguageContext";
import { translations } from "../../data/translations";

// 1. SACAMOS LA CONFIGURACIÓN AFUERA
// Esto evita que el shader se compile de nuevo en cada render.
const shaderConfig = {
  uniforms: {
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0, 0) },
    uTexture: { value: null },
    uHover: { value: 0 },
    uOpacity: { value: 0 },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform vec2 uMouse;
    uniform float uHover;
    uniform float uOpacity;
    uniform sampler2D uTexture;
    varying vec2 vUv;

    void main() {
      vec2 uv = vUv;
      
      // 1. Efecto Reactivo (Sigue al mouse)
      float distMouse = distance(uv, uMouse);
      float waveMouse = sin(distMouse * 10.0 - uTime * 1.5);
      float strengthMouse = smoothstep(0.4, 0.0, distMouse) * uHover * 0.04;

      // 2. Efecto Idle (Fijo en la derecha cuando no hay hover)
      vec2 focusPoint = vec2(0.5, 0.5); 
      float distIdle = distance(uv, focusPoint);
      float waveIdle = sin(distIdle * 8.0 - uTime * 1.0);
      float strengthIdle = smoothstep(0.6, 0.0, distIdle) * (1.0 - uHover) * 0.012;

      uv += (waveMouse * strengthMouse) + (waveIdle * strengthIdle);

      vec4 textureColor = texture2D(uTexture, uv);
      gl_FragColor = vec4(textureColor.rgb, textureColor.a * uOpacity);
    }
  `
};

function Scene({ imagePath }: { imagePath: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useTexture(imagePath);
  const { viewport } = useThree();
  
  // Usamos un ref para el valor de hover para evitar re-renders de React
  const hoverValue = useRef(0);

  // 2. MEMORIZAMOS EL MATERIAL
  // Esto asegura que el objeto del material sea siempre el mismo.
  const material = useMemo(() => {
    const mat = new THREE.ShaderMaterial(shaderConfig);
    mat.uniforms.uTexture.value = texture;
    mat.transparent = true;
    return mat;
  }, [texture]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const mat = meshRef.current.material as THREE.ShaderMaterial;

    mat.uniforms.uTime.value = state.clock.getElapsedTime();

    // Lógica de detección de posición
    const isMouseOnRight = state.mouse.x > 0.5;
    
    // Lerp suave para el hover sin disparar un useState
    hoverValue.current = THREE.MathUtils.lerp(hoverValue.current, isMouseOnRight ? 1 : 0, 0.05);
    mat.uniforms.uHover.value = hoverValue.current;

    mat.uniforms.uMouse.value.lerp(
      new THREE.Vector2((state.mouse.x + 1) / 2, (state.mouse.y + 1) / 2),
      0.1
    );
    
    mat.uniforms.uOpacity.value = THREE.MathUtils.lerp(
      mat.uniforms.uOpacity.value,
      1,
      0.02
    );
  });

  const img = texture.image as HTMLImageElement;
  const ratio = img.width / img.height;
  let width = viewport.width;
  let height = viewport.width / ratio;
  
  if (height < viewport.height) {
    height = viewport.height;
    width = viewport.height * ratio;
  }

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[width, height]} />
      {/* 3. PASAMOS EL MATERIAL MEMORIZADO */}
      <primitive object={material} attach="material" />
    </mesh>
  );
}

export function LiquidHero() {
  // ... (el resto del componente LiquidHero se queda igual que lo tenías)
  const { lang } = useLanguage();
  const t = translations[lang as keyof typeof translations].hero;
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const imagePath = isMobile ? "/hero-mobile.png" : "/hero-portrait.png";

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.8,
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 30, opacity: 0, filter: "blur(10px)" },
    visible: {
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: { duration: 1, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <section id="home" className="relative min-h-screen w-full overflow-hidden bg-background">
      <div className="absolute inset-0 z-0">
        <Suspense fallback={<div className="w-full h-full bg-background animate-pulse" />}>
          <Canvas camera={{ position: [0, 0, 1] }} dpr={[1, 2]}>
            <Scene imagePath={imagePath} />
          </Canvas>
        </Suspense>
      </div>

      <div className="absolute inset-0 bg-black/30 z-10 pointer-events-none" />
      <div className="absolute inset-0 bg-primary/4 z-10 pointer-events-none" />

      <div className="absolute bottom-0 left-0 right-0 h-50 bg-linear-to-t from-background via-background/80 to-transparent z-10 pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-32 bg-linear-to-b from-background/60 to-transparent z-10 pointer-events-none" />

      <div className="relative z-20 container mx-auto px-6 md:px-24 h-screen flex flex-col justify-center pointer-events-none">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl text-center md:text-left pointer-events-auto"
        >
          <motion.h1 
            variants={itemVariants}
            className="text-5xl md:text-8xl mb-8 font-bold text-white tracking-tighter drop-shadow-2xl"
          >
            {t.titlePart1} {t.titlePart2} <br className="hidden md:block" /><span className="text-primary">& </span>{t.titlePart3}
          </motion.h1>
          
          <motion.p 
            variants={itemVariants}
            className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl leading-relaxed drop-shadow-md"
          >
            {t.subtitle}
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-5 justify-center md:justify-start">
            <button 
              onClick={() => scrollToSection("projects")}
              className="px-10 py-4 bg-primary text-primary-foreground rounded-full hover:scale-105 transition-all font-bold shadow-[0_0_20px_rgba(34,197,94,0.4)]"
            >
              {t.btnProjects}
            </button>
            <button 
              onClick={() => scrollToSection("contact")}
              className="px-10 py-4 border-2 border-primary/40 text-white rounded-full hover:bg-primary/10 transition-all font-semibold backdrop-blur-md"
            >
              {t.btnContact}
            </button>
          </motion.div>
        </motion.div>
      </div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        onClick={() => scrollToSection("about")}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce z-30 cursor-pointer p-2 pointer-events-auto"
      >
        <ArrowDown size={32} className="text-white/60 hover:text-white transition-colors" />
      </motion.button>
    </section>
  );
}