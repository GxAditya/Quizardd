"use client";

import { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Loader2, ArrowLeft, ArrowRight, RefreshCw, CheckCircle2, XCircle, Trophy, Zap, MousePointerClick, TrendingUp } from "lucide-react";
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

            {/* Simple Back Button */}
            <div className="fixed top-8 left-8 z-50">
                <Link href="/" className="group flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-background/50 backdrop-blur-md border border-border/50 flex items-center justify-center hover:border-primary/50 hover:bg-background transition-all duration-300 shadow-lg">
                        <ArrowLeft className="w-5 h-5 text-foreground group-hover:text-primary transition-colors duration-300 group-hover:-translate-x-0.5" />
                    </div>
                </Link>
            </div>


            <main className="flex-1 flex flex-col items-center justify-center p-6 pt-20 pb-10 relative z-10 w-full max-w-2xl mx-auto">
                {quizData && !isFinished && (
                    <div className="w-full absolute top-12 left-0 px-6 max-w-2xl mx-auto inset-x-0">
                        <div className="flex justify-between items-center mb-2 px-1">
                            <span className="text-[10px] uppercase font-black text-muted-foreground tracking-[0.2em]">Question {currentQuestionIdx + 1}/{quizData.questions.length}</span>
                            <span className="text-[10px] uppercase font-black text-primary tracking-[0.2em]">Score: {score}</span>
                        </div>
                        <div className="h-1 w-full bg-border/30 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${((currentQuestionIdx + 1) / quizData.questions.length) * 100}%` }}
                                transition={{ duration: 0.5 }}
                                className="h-full bg-primary rounded-full"
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
                                className="bg-card/60 backdrop-blur-2xl rounded-xl p-8 md:p-12 shadow-2xl shadow-primary/5 border border-border/50"
                            >
                                <div>
                                    <h2 className="font-display font-black text-3xl text-foreground uppercase tracking-tight">Create Your Quiz</h2>
                                    <p className="text-muted-foreground text-sm font-medium mt-1">Select a topic and customize your learning session.</p>
                                </div>

                                <form onSubmit={generateQuiz} className="space-y-8 mt-8">
                                    <div className="space-y-3">
                                        <label className="text-sm font-bold text-foreground flex items-center gap-2">
                                            <MousePointerClick className="w-4 h-4 text-primary" />
                                            Target Topic
                                        </label>
                                        <div className="relative group">
                                            <div className="absolute inset-0 bg-primary/20 rounded-lg blur-md opacity-0 group-focus-within:opacity-100 transition-opacity duration-500"></div>
                                            <input
                                                type="text"
                                                placeholder="e.g. Advanced Data Structures, 19th Century Art..."
                                                required
                                                value={subjects}
                                                onChange={(e) => setSubjects(e.target.value)}
                                                disabled={loading}
                                                className="relative w-full bg-background border border-border focus:border-primary p-5 rounded-lg outline-none transition-all text-lg font-medium shadow-sm placeholder:text-muted-foreground/50"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-sm font-bold text-foreground flex items-center gap-2">
                                            <Zap className="w-4 h-4 text-accent" />
                                            Number of Questions
                                        </label>
                                        <div className="grid grid-cols-4 gap-4">
                                            {[3, 5, 8, 10].map((num) => (
                                                <button
                                                    key={num}
                                                    type="button"
                                                    onClick={() => setQuestionCount(num)}
                                                    className={cn(
                                                        "py-4 rounded-lg font-bold transition-all duration-300 border-2 overflow-hidden relative",
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
                                        className="w-full relative group overflow-hidden bg-foreground text-background p-6 rounded-lg font-bold text-lg transition-all duration-300 disabled:opacity-50 mt-4 active:scale-95 flex items-center justify-center gap-3"
                                    >
                                        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
                                        <span className="relative z-10 flex items-center gap-2">
                                            Start Quiz <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
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
                                className="flex flex-col items-center justify-center p-16 text-center space-y-8 bg-card/40 backdrop-blur-xl rounded-xl border border-border/50 shadow-2xl"
                            >
                                <div className="relative">
                                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
                                    <Loader2 className="w-20 h-20 animate-spin text-primary relative z-10" />
                                    <div className="absolute inset-0 flex items-center justify-center z-20">
                                        <div className="w-3 h-3 bg-accent rounded-full animate-ping"></div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-3xl font-display font-black text-foreground uppercase tracking-tight">Generating Questions</h3>
                                    <p className="text-muted-foreground font-medium text-lg">Our AI is creating a customized quiz based on your topic...</p>
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
                                <motion.div variants={fadeUpVariant} className="bg-card/80 backdrop-blur-xl rounded-xl p-6 md:p-8 shadow-2xl border border-border/50">
                                    <h2 className="text-xl md:text-2xl font-display font-black leading-tight mb-6 text-foreground">
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
                                                    btnClass = "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-500 text-emerald-900 dark:text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.2)] z-10";
                                                    icon = <CheckCircle2 className="w-7 h-7 text-emerald-600 dark:text-emerald-400 shrink-0" />;
                                                } else if (isSelected && !isCorrect) {
                                                    btnClass = "bg-red-50 dark:bg-red-500/10 border-red-500 text-red-900 dark:text-red-400 shadow-[0_0_30px_rgba(239,68,68,0.2)] z-10 scale-[0.98] opacity-90";
                                                    icon = <XCircle className="w-7 h-7 text-red-600 dark:text-red-400 shrink-0" />;
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
                                                        "w-full text-left p-4 md:p-5 rounded-lg flex items-center justify-between transition-all duration-300 relative border-2",
                                                        btnClass
                                                    )}
                                                >
                                                    <span className={cn("text-base font-medium pr-6", hasAnswered && isCorrect && "font-bold")}>{opt}</span>
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
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="bg-primary/5 backdrop-blur-3xl rounded-xl p-6 border border-primary/20 shadow-xl relative overflow-hidden"
                                        >
                                            <div className="flex flex-col gap-4">
                                                <div>
                                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-2 block">Explanation</span>
                                                    <p className="text-base md:text-lg font-medium text-foreground/90 leading-snug">
                                                        {quizData.questions[currentQuestionIdx].explanation}
                                                    </p>
                                                </div>
                                                <div className="flex justify-end">
                                                    <button
                                                        onClick={nextQuestion}
                                                        className="bg-foreground text-background px-6 py-3 rounded-lg font-bold text-sm hover:scale-105 transition-all shadow-lg group flex items-center gap-2"
                                                    >
                                                        {currentQuestionIdx < quizData.questions.length - 1 ? (
                                                            <>Next <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
                                                        ) : (
                                                            <>Finish <Trophy className="w-4 h-4 text-yellow-500" /></>
                                                        )}
                                                    </button>
                                                </div>
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
                                className="bg-card/80 backdrop-blur-2xl rounded-2xl p-8 md:p-12 shadow-2xl border border-border/50 text-center relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent pointer-events-none" />

                                <div className="relative z-10 space-y-8">
                                    <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-2xl mb-4">
                                        <Trophy className="w-10 h-10 text-primary" />
                                    </div>

                                    <div className="space-y-2">
                                        <h2 className="text-4xl font-display font-black tracking-tight text-foreground uppercase">Quiz Complete</h2>
                                        <p className="text-muted-foreground font-medium">Here's how you performed today:</p>
                                    </div>

                                    <div className="flex items-center justify-center gap-8 py-8">
                                        <div className="text-center">
                                            <div className="text-6xl font-display font-black text-primary tracking-tighter">{score}</div>
                                            <div className="text-[10px] items-center justify-center font-black uppercase tracking-[0.2em] text-muted-foreground mt-1">Score</div>
                                        </div>
                                        <div className="h-12 w-px bg-border/50" />
                                        <div className="text-center">
                                            <div className="text-6xl font-display font-black text-foreground/40 tracking-tighter">{quizData?.questions.length}</div>
                                            <div className="text-[10px] items-center justify-center font-black uppercase tracking-[0.2em] text-muted-foreground mt-1">Total</div>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-background/50 rounded-xl border border-border/50 text-sm font-medium">
                                        {score === quizData?.questions.length ? "Perfect score! You've mastered this topic." :
                                            score > (quizData?.questions.length ?? 0) / 2 ? "Great job! Keep practicing to reach perfection." :
                                                "Don't give up! Every mistake is a learning opportunity."}
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => { setQuizData(null); setIsFinished(false); }}
                                        className="w-full bg-foreground text-background py-5 rounded-xl font-black uppercase tracking-[0.2em] text-sm shadow-xl hover:shadow-primary/20 transition-all flex items-center justify-center gap-3"
                                    >
                                        <RefreshCw className="w-4 h-4" />
                                        Start New Quiz
                                    </motion.button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}

