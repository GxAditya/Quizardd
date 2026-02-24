"use client";

import { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Loader2, ArrowLeft, ArrowRight, RefreshCw, CheckCircle2, XCircle, Sparkles, Trophy, Zap, MousePointerClick, TrendingUp } from "lucide-react";
import Link from "next/link";
import cn from "classnames";

type Question = {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
};

type QuizData = {
    questions: Question[];
};

const fadeUpVariant: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
};

const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export default function QuizPage() {
    const [subjects, setSubjects] = useState("Information Theory");
    const [questionCount, setQuestionCount] = useState(5);
    const [loading, setLoading] = useState(false);
    const [quizData, setQuizData] = useState<QuizData | null>(null);

    // Game state
    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [hasAnswered, setHasAnswered] = useState(false);
    const [score, setScore] = useState(0);
    const [isFinished, setIsFinished] = useState(false);

    const generateQuiz = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!subjects.trim()) return;
        setLoading(true);
        setQuizData(null);
        setCurrentQuestionIdx(0);
        setScore(0);
        setIsFinished(false);
        setSelectedAnswer(null);
        setHasAnswered(false);

        try {
            const response = await fetch("/api/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ subjects, questionCount }),
            });
            const data = await response.json();
            if (data.questions && data.questions.length > 0) {
                setQuizData(data);
            } else {
                alert("Failed to generate quiz questions. Please try again.");
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred while building your quiz.");
        } finally {
            setLoading(false);
        }
    };

    const handleSelectAnswer = (index: number) => {
        if (hasAnswered || !quizData) return;
        setSelectedAnswer(index);
        setHasAnswered(true);

        if (index === quizData.questions[currentQuestionIdx].correctAnswer) {
            setScore(s => s + 1);
        }
    };

    const nextQuestion = () => {
        if (!quizData) return;
        if (currentQuestionIdx < quizData.questions.length - 1) {
            setCurrentQuestionIdx(idx => idx + 1);
            setSelectedAnswer(null);
            setHasAnswered(false);
        } else {
            setIsFinished(true);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground font-sans flex flex-col selection:bg-primary/30 relative overflow-hidden">

            {/* Animated Background Orbs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.3, 0.15] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-primary/20 blur-[130px]"
                />
                <motion.div
                    animate={{ scale: [1, 1.5, 1], opacity: [0.1, 0.2, 0.1] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-accent/20 blur-[120px]"
                />
            </div>

            {/* Header */}
            <header className="fixed top-0 w-full z-50 px-6 py-4 glass border-b border-border/40 backdrop-blur-xl">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <Link href="/" className="group flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-card border border-border/50 flex items-center justify-center group-hover:border-primary/50 group-hover:shadow-[0_0_15px_rgba(var(--primary),0.2)] transition-all duration-300">
                            <ArrowLeft className="w-5 h-5 text-foreground group-hover:text-primary transition-colors duration-300 group-hover:-translate-x-0.5" />
                        </div>
                        <img src="/Quizardd.png" alt="Quizardd Icon" className="w-7 h-7 object-contain group-hover:scale-110 group-hover:rotate-6 transition-transform drop-shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
                        <span className="font-display font-bold text-xl tracking-tight hidden sm:block">Quizardd</span>
                    </Link>

                    {quizData && !isFinished && (
                        <div className="flex items-center gap-3 sm:gap-6">
                            <div className="flex flex-col items-end">
                                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1">Progress</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-bold text-foreground">{currentQuestionIdx + 1}</span>
                                    <span className="text-xs text-muted-foreground">/ {quizData.questions.length}</span>
                                </div>
                            </div>
                            <div className="h-8 w-px bg-border/50"></div>
                            <div className="hidden sm:flex flex-col items-start">
                                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1">Score</span>
                                <div className="flex items-center gap-1.5 text-primary">
                                    <TrendingUp className="w-4 h-4" />
                                    <span className="text-sm font-bold">{score}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </header>

            <main className="flex-1 flex flex-col items-center justify-center p-6 pt-32 pb-20 relative z-10 w-full max-w-3xl mx-auto">
                {quizData && !isFinished && (
                    <div className="w-full absolute top-24 left-0 px-6 max-w-3xl mx-auto inset-x-0">
                        <div className="h-1.5 w-full bg-border/50 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${((currentQuestionIdx) / quizData.questions.length) * 100}%` }}
                                transition={{ duration: 0.5 }}
                                className="h-full bg-linear-to-r from-primary to-accent rounded-full"
                            />
                        </div>
                    </div>
                )}

                <div className="w-full">
                    <AnimatePresence mode="wait">
                        {/* Setup View */}
                        {!quizData && !loading && (
                            <motion.div
                                key="setup"
                                variants={fadeUpVariant}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="bg-card/60 backdrop-blur-2xl rounded-4xl p-8 md:p-12 shadow-2xl shadow-primary/5 border border-border/50"
                            >
                                <div className="flex items-center gap-4 mb-10">
                                    <div className="w-14 h-14 bg-linear-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                                        <Sparkles className="w-7 h-7 text-primary-foreground" />
                                    </div>
                                    <div>
                                        <h2 className="font-display font-black text-3xl text-foreground">Prepare Session</h2>
                                        <p className="text-muted-foreground text-sm font-medium mt-1">Harness AI to master any domain.</p>
                                    </div>
                                </div>

                                <form onSubmit={generateQuiz} className="space-y-8">
                                    <div className="space-y-3">
                                        <label className="text-sm font-bold text-foreground flex items-center gap-2">
                                            <MousePointerClick className="w-4 h-4 text-primary" />
                                            Target Topic
                                        </label>
                                        <div className="relative group">
                                            <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-md opacity-0 group-focus-within:opacity-100 transition-opacity duration-500"></div>
                                            <input
                                                type="text"
                                                placeholder="e.g. Advanced Data Structures, 19th Century Art..."
                                                required
                                                value={subjects}
                                                onChange={(e) => setSubjects(e.target.value)}
                                                disabled={loading}
                                                className="relative w-full bg-background border border-border focus:border-primary p-5 rounded-2xl outline-none transition-all text-lg font-medium shadow-sm placeholder:text-muted-foreground/50"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-sm font-bold text-foreground flex items-center gap-2">
                                            <Zap className="w-4 h-4 text-accent" />
                                            Intensity (Questions)
                                        </label>
                                        <div className="grid grid-cols-4 gap-4">
                                            {[3, 5, 8, 10].map((num) => (
                                                <button
                                                    key={num}
                                                    type="button"
                                                    onClick={() => setQuestionCount(num)}
                                                    className={cn(
                                                        "py-4 rounded-2xl font-bold transition-all duration-300 border-2 overflow-hidden relative",
                                                        questionCount === num
                                                            ? "bg-primary/10 border-primary text-primary shadow-[0_0_20px_rgba(var(--primary),0.2)]"
                                                            : "bg-background border-border text-muted-foreground hover:border-primary/40 hover:bg-background/80"
                                                    )}
                                                >
                                                    {questionCount === num && (
                                                        <motion.div layoutId="active-pill" className="absolute inset-0 bg-primary/10 -z-10" />
                                                    )}
                                                    {num}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full relative group overflow-hidden bg-foreground text-background p-6 rounded-2xl font-bold text-lg shadow-[0_10px_40px_-10px_var(--color-foreground)] hover:shadow-2xl transition-all duration-300 disabled:opacity-50 mt-4 active:scale-95 flex items-center justify-center gap-3"
                                    >
                                        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
                                        <span className="relative z-10 flex items-center gap-2">
                                            Initialize Protocol <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </span>
                                    </button>
                                </form>
                            </motion.div>
                        )}

                        {/* Loading View */}
                        {loading && (
                            <motion.div
                                key="loading"
                                variants={fadeUpVariant}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="flex flex-col items-center justify-center p-16 text-center space-y-8 bg-card/40 backdrop-blur-xl rounded-4xl border border-border/50 shadow-2xl"
                            >
                                <div className="relative">
                                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
                                    <Loader2 className="w-20 h-20 animate-spin text-primary relative z-10" />
                                    <div className="absolute inset-0 flex items-center justify-center z-20">
                                        <div className="w-3 h-3 bg-accent rounded-full animate-ping"></div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-3xl font-display font-black text-foreground">Synthesizing Core Concepts</h3>
                                    <p className="text-muted-foreground font-medium text-lg">Calibrating AI pathways for optimal learning...</p>
                                </div>
                            </motion.div>
                        )}

                        {/* Question View */}
                        {quizData && !isFinished && (
                            <motion.div
                                key="question"
                                variants={staggerContainer}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="space-y-6 w-full"
                            >
                                <motion.div variants={fadeUpVariant} className="bg-card/80 backdrop-blur-xl rounded-4xl p-8 md:p-12 shadow-2xl shadow-primary/5 border border-border/50">
                                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold leading-tight mb-10 text-foreground">
                                        {quizData.questions[currentQuestionIdx].question}
                                    </h2>

                                    <div className="grid grid-cols-1 gap-4">
                                        {quizData.questions[currentQuestionIdx].options.map((opt, idx) => {
                                            const isCorrect = idx === quizData.questions[currentQuestionIdx].correctAnswer;
                                            const isSelected = selectedAnswer === idx;

                                            let btnClass = "bg-background border-border hover:border-primary/50 hover:bg-primary/5 hover:shadow-lg";
                                            let icon = <div className="w-6 h-6 rounded-full border-2 border-muted-foreground/30 shrink-0" />;

                                            if (hasAnswered) {
                                                if (isCorrect) {
                                                    btnClass = "bg-emerald-50 border-emerald-500 text-emerald-900 shadow-[0_0_30px_rgba(16,185,129,0.2)] z-10";
                                                    icon = <CheckCircle2 className="w-7 h-7 text-emerald-600 shrink-0" />;
                                                } else if (isSelected && !isCorrect) {
                                                    btnClass = "bg-red-50 border-red-500 text-red-900 shadow-[0_0_30px_rgba(239,68,68,0.2)] z-10 scale-[0.98] opacity-90";
                                                    icon = <XCircle className="w-7 h-7 text-red-600 shrink-0" />;
                                                } else {
                                                    btnClass = "opacity-40 bg-background border-border grayscale cursor-default scale-[0.98]";
                                                }
                                            }

                                            return (
                                                <button
                                                    key={idx}
                                                    disabled={hasAnswered}
                                                    onClick={() => handleSelectAnswer(idx)}
                                                    className={cn(
                                                        "w-full text-left p-6 md:p-7 rounded-2xl flex items-center justify-between transition-all duration-300 relative border-2",
                                                        btnClass
                                                    )}
                                                >
                                                    <span className={cn("text-lg font-medium pr-8", hasAnswered && isCorrect && "font-bold text-emerald-800")}>{opt}</span>
                                                    {icon}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </motion.div>

                                {/* Explanation & Next */}
                                <AnimatePresence>
                                    {hasAnswered && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 30, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            transition={{ type: "spring", bounce: 0.4 }}
                                            className="bg-primary/5 backdrop-blur-3xl rounded-4xl p-8 md:p-10 border border-primary/20 shadow-2xl relative overflow-hidden"
                                        >
                                            <div className="absolute top-0 left-0 w-2 h-full bg-linear-to-b from-primary to-accent"></div>
                                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <Sparkles className="w-4 h-4 text-primary" />
                                                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Insight Matrix</span>
                                                    </div>
                                                    <p className="text-xl md:text-2xl font-medium text-foreground leading-relaxed">
                                                        {quizData.questions[currentQuestionIdx].explanation}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={nextQuestion}
                                                    className="shrink-0 bg-foreground text-background px-10 py-5 rounded-2xl font-bold text-lg hover:bg-foreground/90 transition-all active:scale-95 shadow-[0_10px_30px_rgba(0,0,0,0.1)] group flex items-center justify-center gap-2"
                                                >
                                                    {currentQuestionIdx < quizData.questions.length - 1 ? (
                                                        <>Proceed <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
                                                    ) : (
                                                        <>View Results <Trophy className="w-5 h-5 group-hover:scale-110 transition-transform text-yellow-400" /></>
                                                    )}
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        )}

                        {/* Results View */}
                        {isFinished && (
                            <motion.div
                                key="results"
                                variants={fadeUpVariant}
                                initial="hidden"
                                animate="visible"
                                className="bg-card/80 backdrop-blur-2xl rounded-[3rem] p-12 md:p-16 shadow-2xl shadow-primary/10 border border-border/50 text-center space-y-10 relative overflow-hidden"
                            >
                                <div className="absolute top-[-20%] left-[50%] -translate-x-1/2 w-[80%] h-[50%] bg-primary/10 blur-[100px] rounded-full pointer-events-none" />

                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1, rotate: [0, -10, 10, -10, 0] }}
                                    transition={{ type: "spring", bounce: 0.6, duration: 1.5 }}
                                    className="w-28 h-28 bg-linear-to-br from-yellow-400 to-orange-500 rounded-4xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-yellow-500/30 rotate-3"
                                >
                                    <Trophy className="w-14 h-14 text-white drop-shadow-md" />
                                </motion.div>

                                <div className="space-y-3 relative z-10">
                                    <h2 className="text-5xl md:text-6xl font-display font-black tracking-tight text-foreground">Session Complete!</h2>
                                    <p className="text-xl text-muted-foreground font-medium">Knowledge pathways successfully reinforced.</p>
                                </div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="py-10 border-y border-border/50 bg-background/50 rounded-3xl backdrop-blur-sm relative z-10"
                                >
                                    <div className="text-8xl md:text-9xl font-display font-black text-transparent bg-clip-text bg-linear-to-r from-primary to-accent mb-4 tracking-tighter">
                                        {score}<span className="text-4xl md:text-5xl text-muted-foreground/30 mx-2 tracking-normal">/</span>{quizData?.questions.length}
                                    </div>
                                    <div className="text-sm font-bold uppercase tracking-[0.3em] text-foreground/50">Final Score Assessment</div>
                                </motion.div>

                                <motion.button
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.6 }}
                                    onClick={() => { setQuizData(null); setIsFinished(false); }}
                                    className="w-full relative group overflow-hidden bg-primary text-primary-foreground py-6 rounded-2xl font-bold text-xl shadow-[0_15px_40px_-10px_var(--color-primary)] hover:shadow-[0_25px_50px_-10px_var(--color-primary)] transition-all flex items-center justify-center gap-3 active:scale-95 z-10"
                                >
                                    <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
                                    <RefreshCw className="w-6 h-6 group-hover:rotate-180 transition-transform duration-700 relative z-10" />
                                    <span className="relative z-10">Initialize New Session</span>
                                </motion.button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}
