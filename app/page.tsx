"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Target, Zap, ChevronRight, Atom, Palette, Book, Dna, GraduationCap } from "lucide-react";
import { useState, useEffect } from "react";

// --- Feature 1: Custom Subjects ---
const FeatureOne = () => {
  const subjects = [
    { title: "Quantum Physics", icon: <Atom className="w-5 h-5 text-primary" /> },
    { title: "Art History", icon: <Palette className="w-5 h-5 text-primary" /> },
    { title: "World War II", icon: <Book className="w-5 h-5 text-primary" /> },
    { title: "Neuroscience", icon: <Dna className="w-5 h-5 text-primary" /> },
  ];

  return (
    <div className="relative h-full p-8 rounded-lg bg-card border border-border overflow-hidden group hover:border-primary/40 transition-all duration-500 shadow-sm hover:shadow-2xl hover:shadow-primary/5">
      <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row h-full gap-8">
        <div className="flex-1">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
            <GraduationCap className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-3xl font-bold mb-3 tracking-tight">Custom Subjects</h3>
          <p className="text-muted-foreground text-base leading-relaxed max-w-sm">
            From Quantum Physics to Art History. Generate highly-tailored quizzes on absolutely any topic imaginable in seconds.
          </p>
        </div>

        <div className="flex-1 flex items-center justify-center bg-background/50 rounded-md p-6 border border-border/50 relative overflow-hidden min-h-[300px]">

          {/* Orbit Rings */}
          <div className="absolute w-[260px] h-[260px] rounded-full border border-primary/20 border-dashed animate-[spin_40s_linear_infinite]" />
          <div className="absolute w-[160px] h-[160px] rounded-full border border-primary/30 animate-[spin_30s_linear_infinite_reverse]" />

          {/* Central Quizardd Component */}
          <div className="relative z-20 w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center p-3 shadow-[0_0_40px_rgba(var(--primary),0.3)] backdrop-blur-md border border-primary/30">
            <img src="/Quizardd.png" alt="Quizardd Logo" className="w-full h-full object-contain drop-shadow-xl" />
          </div>

          {/* Revolving Solar System */}
          <motion.div
            className="absolute flex items-center justify-center w-[260px] h-[260px] z-30"
            animate={{ rotate: 360 }}
            transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
          >
            {subjects.map((sub, i) => {
              const angle = (i * 360) / subjects.length;
              const radius = 130; // Half of 260px

              return (
                <div
                  key={sub.title}
                  className="absolute"
                  style={{ transform: `rotate(${angle}deg) translateY(-${radius}px)` }}
                >
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
                  >
                    <div style={{ transform: `rotate(-${angle}deg)` }}>
                      <div className="flex items-center gap-2 bg-card p-2 pr-3 rounded-full border border-border shadow-md shadow-primary/5 hover:scale-105 transition-transform cursor-pointer">
                        <div className="bg-primary/10 p-1.5 rounded-full">
                          {sub.icon}
                        </div>
                        <span className="text-xs font-bold text-foreground whitespace-nowrap">{sub.title}</span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </motion.div>

        </div>
      </div>
    </div>
  );
};

// --- Feature 2: Instant Feedback ---
const FeatureTwo = () => {
  // states: 0 - idle, 1 - wrong selected, 2 - corrected & explanation
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((s) => (s + 1) % 4); // 0, 1, 2, 3(delay)
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  const s = Math.min(step, 2);

  return (
    <div className="relative h-full p-8 rounded-lg bg-card border border-border overflow-hidden group hover:border-primary/40 transition-all duration-500 shadow-sm hover:shadow-2xl hover:shadow-primary/5 flex flex-col">
      <div className="absolute inset-0 bg-linear-to-tr from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      <div className="relative z-10 mb-8">
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
          <Zap className="w-6 h-6 text-primary" />
        </div>
        <h3 className="text-3xl font-bold mb-3 tracking-tight">Instant Feedback</h3>
        <p className="text-muted-foreground text-base leading-relaxed">Mistakes detected. Immediate correction.</p>
      </div>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center">
        <div className="w-full max-w-[260px] bg-background/80 backdrop-blur-md border border-border/60 rounded-lg p-5 shadow-2xl">
          <div className="text-sm font-bold mb-4 font-mono">Derivative of e^x?</div>

          <div className="space-y-2.5">
            {/* Option 1 */}
            <motion.div
              animate={
                s === 1 ? { x: [-3, 3, -3, 3, 0], borderColor: "var(--color-destructive)" } :
                  s === 2 ? { borderColor: "var(--color-border)", opacity: 0.5 } :
                    { borderColor: "var(--color-border)" }
              }
              transition={{ duration: 0.4 }}
              className="border rounded-md p-3 flex items-center gap-3 text-sm font-medium transition-colors"
            >
              <div className={`w-4 h-4 rounded-full border transition-colors ${s === 1 ? 'border-destructive bg-destructive/20' : 'border-muted-foreground'}`} />
              x * e^x
            </motion.div>

            {/* Option 2 */}
            <motion.div
              animate={
                s === 2 ? { backgroundColor: "var(--color-primary)", color: "var(--color-primary-foreground)", borderColor: "var(--color-primary)" } :
                  { backgroundColor: "transparent", color: "var(--color-foreground)", borderColor: "var(--color-border)" }
              }
              className="border rounded-md p-3 flex items-center gap-3 text-sm font-medium transition-colors"
            >
              <div className={`w-4 h-4 rounded-full border transition-colors ${s === 2 ? 'border-primary-foreground bg-primary-foreground' : 'border-muted-foreground'}`} />
              e^x
            </motion.div>

            {/* Option 3 */}
            <div className="border border-border rounded-md p-3 flex items-center gap-3 text-sm font-medium opacity-50">
              <div className="w-4 h-4 rounded-full border border-muted-foreground" />
              ln(x)
            </div>
          </div>

          {/* Explanation */}
          <AnimatePresence>
            {s === 2 && (
              <motion.div
                initial={{ height: 0, opacity: 0, y: 15 }}
                animate={{ height: "auto", opacity: 1, y: 0 }}
                exit={{ height: 0, opacity: 0, y: -10 }}
                transition={{ duration: 0.4, type: "spring", stiffness: 200, damping: 20 }}
                className="overflow-hidden mt-4"
              >
                <div className="bg-primary/10 p-4 rounded-md text-xs leading-relaxed border border-primary/20 text-primary">
                  <span className="font-black flex items-center gap-1 mb-1.5 uppercase tracking-wider text-[10px]">
                    <Zap className="w-3 h-3" /> Explanation
                  </span>
                  The derivative function of e^x is its own function base, e^x.
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

// --- Feature 3: Goal Oriented ---
const CounterText = ({ values, duration }: { values: number[], duration: number }) => {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIdx(i => (i + 1) % values.length);
    }, (duration * 1000) / values.length);
    return () => clearInterval(timer);
  }, [values.length, duration]);

  return (
    <div className="text-4xl font-black tracking-tighter text-foreground h-10 overflow-hidden">
      <AnimatePresence mode="popLayout">
        <motion.div
          key={values[idx]}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          {values[idx]}%
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

const FeatureThree = () => {
  return (
    <div className="relative h-full p-8 rounded-lg bg-card border border-border overflow-hidden group hover:border-primary/40 transition-all duration-500 shadow-sm hover:shadow-2xl hover:shadow-primary/5 flex flex-col">
      <div className="absolute inset-0 bg-linear-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row h-full gap-8">
        <div className="flex-1 order-2 md:order-1 flex flex-col gap-8 justify-center items-center bg-background/50 rounded-md p-6 border border-border/50">

          {/* Graph */}
          <div className="relative h-32 w-full max-w-[240px] border-b-2 border-l-2 border-border flex items-end ml-4 mt-8">
            <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 240 128">
              <motion.path
                d="M 0,115 Q 60,102 96,77 T 180,51 T 240,25"
                fill="none"
                strokeWidth="2"
                stroke="var(--color-primary)"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, repeat: Infinity, repeatType: "loop", ease: "linear", repeatDelay: 1 }}
              />
              {/* Glowing effect on path */}
              <motion.path
                d="M 0,115 Q 60,102 96,77 T 180,51 T 240,25"
                fill="none"
                strokeWidth="6"
                stroke="var(--color-primary)"
                strokeLinecap="round"
                className="opacity-20 blur-sm"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, repeat: Infinity, repeatType: "loop", ease: "linear", repeatDelay: 1 }}
              />
              {/* Quizardd logo tracking the graph synchronously */}
              <image href="/Quizardd.png" x="-16" y="-16" width="32" height="32" style={{ filter: "drop-shadow(0px 4px 8px rgba(var(--primary), 0.5))" }}>
                <animateMotion
                  dur="3s"
                  repeatCount="indefinite"
                  path="M 0,115 Q 60,102 96,77 T 180,51 T 240,25"
                  calcMode="linear"
                  keyPoints="0;1;1"
                  keyTimes="0;0.666;1"
                />
              </image>
            </svg>
          </div>

          <div className="flex items-center justify-between w-full max-w-[240px]">
            {/* Score Counter */}
            <div>
              <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-1">Knowledge Growth</div>
              <CounterText values={[72, 81, 89]} duration={4.5} />
            </div>

            {/* Goal Progress */}
            <div className="relative w-16 h-16 flex items-center justify-center">
              <motion.svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 40 40">
                <circle cx="20" cy="20" r="18" fill="none" className="stroke-muted" strokeWidth="4" />
                <motion.circle
                  cx="20" cy="20" r="18" fill="none"
                  className="stroke-primary"
                  strokeWidth="4"
                  strokeDasharray="113"
                  initial={{ strokeDashoffset: 113 }}
                  animate={{ strokeDashoffset: [113 * 0.25, 0, 113 * 0.25] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                  strokeLinecap="round"
                />
              </motion.svg>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <Target className="w-6 h-6 text-foreground" />
              </motion.div>
            </div>
          </div>

          {/* Mini Analytics Polish */}
          <div className="flex gap-2.5 items-end h-12 w-full max-w-[240px]">
            {[0.3, 0.5, 0.4, 0.7, 0.6, 0.9, 0.8, 1].map((h, i) => (
              <motion.div
                key={i}
                className="flex-1 bg-primary/30 rounded-t-sm"
                initial={{ height: "10%" }}
                animate={{ height: ["10%", `${h * 100}%`, `${h * 100}%`, "10%"] }}
                transition={{
                  duration: 2.5,
                  delay: i * 0.1,
                  repeat: Infinity,
                  repeatDelay: 1.5,
                  times: [0, 0.2, 0.8, 1],
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        </div>

        <div className="flex-1 order-1 md:order-2">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
            <Target className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-3xl font-bold mb-3 tracking-tight">Goal Oriented</h3>
          <p className="text-muted-foreground text-base leading-relaxed max-w-sm">
            Tangible improvement. Seamlessly track your scores and watch your foundational knowledge grow.
          </p>
        </div>
      </div>
    </div>
  )
}


export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/30 relative overflow-hidden">

      {/* Editorial Background Noise & Meshes */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[150px] rounded-full mix-blend-screen animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] bg-accent/20 blur-[150px] rounded-full mix-blend-screen animate-pulse" style={{ animationDuration: '10s' }} />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
      </div>

      {/* Modern Brutalist Nav */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-50 px-8 py-4 flex justify-between items-center bg-background/70 backdrop-blur-xl border border-border/40 rounded-2xl shadow-2xl">
        <Link href="/" className="font-black text-2xl tracking-tighter text-foreground uppercase flex items-center gap-2 group">
          <img src="/Quizardd.png" alt="Quizardd Icon" className="w-6 h-6 object-contain group-hover:scale-110 group-hover:rotate-6 transition-transform drop-shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
          Quizardd
        </Link>
        <Link href="/quiz">
          <button className="px-6 py-3 bg-primary text-primary-foreground font-bold uppercase tracking-widest text-xs rounded-lg hover:scale-105 transition-all shadow-[0_0_20px_rgba(var(--primary),0.3)] hover:shadow-[0_0_30px_rgba(var(--primary),0.5)] border border-primary/50 group">
            Get Started
          </button>
        </Link>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center pt-48 pb-20 px-6 z-10 w-full max-w-[1400px] mx-auto">
        <div className="w-full mb-28 flex flex-col items-center text-center gap-6 pb-16">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter uppercase flex flex-col md:flex-row items-center gap-4 md:gap-8"
          >
            <span>Learn</span>
            <span className="text-primary italic font-serif opacity-90 drop-shadow-[0_0_30px_rgba(var(--primary),0.4)]">Evolve</span>
            <span>Master</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="max-w-2xl text-lg md:text-xl font-medium text-muted-foreground mt-4 leading-relaxed"
          >
            Generate personalized quizzes in seconds to master any subject. Our AI-powered engine creates tailored assessments that help you learn faster and retain more.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-10"
          >
            <Link href="/quiz">
              <button className="group relative overflow-hidden px-10 py-5 bg-foreground text-background border border-border/50 font-bold uppercase tracking-[0.15em] text-sm md:text-base rounded-lg hover:scale-105 transition-all duration-500 shadow-[0_10px_40px_-10px_rgba(var(--foreground),0.3)] hover:shadow-[0_20px_50px_-10px_rgba(var(--primary),0.4)] flex items-center justify-center gap-4">
                <span className="relative z-10 font-black tracking-[0.2em] group-hover:text-primary-foreground transition-colors duration-500">
                  ENTER QUIZARDD
                </span>
                <ChevronRight className="w-5 h-5 relative z-10 group-hover:text-primary-foreground group-hover:translate-x-2 transition-all duration-500" />
                <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[0.16,1,0.3,1] z-0" />
              </button>
            </Link>
          </motion.div>
        </div>

        {/* Bento Grid layout defined by the prompt */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[400px]"
        >
          {/* Custom Subjects: spans 2 cols automatically fitting */}
          <div className="md:col-span-2">
            <FeatureOne />
          </div>

          {/* Instant Feedback: Spans 1 col, could be taller if row-span was 2, but we use auto-rows-[400px] to make them uniform blocks */}
          <div className="md:col-span-1 md:row-span-2">
            <FeatureTwo />
          </div>

          {/* Goal Oriented: spans 2 cols */}
          <div className="md:col-span-2">
            <FeatureThree />
          </div>
        </motion.div>
      </main>

    </div>
  );
}
