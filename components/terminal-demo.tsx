"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ToolCall {
  tool: string;
  args: string;
  result: string;
  ms: string;
}

interface Sequence {
  prompt: string;
  calls: ToolCall[];
}

const sequences: Sequence[] = [
  {
    prompt: "read the contents of src/index.ts",
    calls: [
      {
        tool: "filesystem.read",
        args: '{ path: "src/index.ts" }',
        result: "2.1 KB returned",
        ms: "3ms",
      },
    ],
  },
  {
    prompt: "run the tests and commit if everything passes",
    calls: [
      {
        tool: "shell.exec",
        args: '{ command: "npm test" }',
        result: "142 tests passed",
        ms: "4.2s",
      },
      {
        tool: "git.commit",
        args: '{ message: "test: all 142 passing" }',
        result: "committed to main",
        ms: "91ms",
      },
    ],
  },
  {
    prompt: "what changed since the last commit?",
    calls: [
      {
        tool: "git.diff",
        args: "{ staged: false }",
        result: "3 files · +127 −43 lines",
        ms: "18ms",
      },
    ],
  },
  {
    prompt: "fetch the latest release from the GitHub API",
    calls: [
      {
        tool: "web.fetch",
        args: '{ url: "https://api.github.com/repos/..." }',
        result: "HTTP 200 · 4.3 KB JSON",
        ms: "312ms",
      },
    ],
  },
  {
    prompt: "find slow queries in the production database",
    calls: [
      {
        tool: "db.query",
        args: '{ query: "SELECT * FROM pg_stat_activity..." }',
        result: "12 rows returned",
        ms: "47ms",
      },
    ],
  },
];

export function TerminalDemo() {
  const [mounted, setMounted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [visibleCalls, setVisibleCalls] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const seq = sequences[currentStep];
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    // Stagger tool call reveals
    seq.calls.forEach((_, idx) => {
      const t = setTimeout(
        () => setVisibleCalls(idx + 1),
        900 + idx * 800,
      );
      timeouts.push(t);
    });

    // Advance to next step
    const total = 900 + seq.calls.length * 800 + 2400;
    const advance = setTimeout(() => {
      setVisibleCalls(0);
      setCurrentStep((s) => (s + 1) % sequences.length);
    }, total);
    timeouts.push(advance);

    return () => timeouts.forEach(clearTimeout);
  }, [currentStep, mounted]);

  const seq = sequences[currentStep];

  return (
    <div className="overflow-hidden rounded-xl border border-[#1a1a1a] bg-[#060606]">
      {/* Window chrome */}
      <div className="flex items-center gap-2 border-b border-[#1a1a1a] px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-[#1e1e1e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#1e1e1e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#1e1e1e]" />
        <span className="ml-3 font-mono text-[10px] text-[#2a2a2a]">
          claude_code — conductor mcp
        </span>
        <span className="ml-auto flex h-1.5 w-1.5 rounded-full bg-[#2a2a2a]">
          <span className="h-1.5 w-1.5 animate-ping rounded-full bg-[#3a3a3a]" />
        </span>
      </div>

      {/* Terminal body */}
      <div className="min-h-[220px] p-5 font-mono text-sm">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
          >
            {/* Prompt */}
            <div className="flex items-start gap-2">
              <span className="select-none text-[#2a2a2a]">$</span>
              <span className="text-[#777]">{seq.prompt}</span>
            </div>

            {/* Tool calls */}
            <div className="mt-3 space-y-2.5 pl-4">
              {seq.calls.slice(0, visibleCalls).map((call, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  {/* Tool invocation */}
                  <div className="flex items-center gap-2 text-[#333]">
                    <span className="text-[#222]">→</span>
                    <span className="text-[#555]">conductor</span>
                    <span className="text-[#333]">·</span>
                    <span className="text-[#777]">{call.tool}</span>
                    <span className="text-[#2a2a2a]">{call.args}</span>
                  </div>
                  {/* Result */}
                  <div className="mt-1 flex items-center gap-2 pl-4 text-xs">
                    <span className="text-white">✓</span>
                    <span className="text-[#444]">{call.ms}</span>
                    <span className="text-[#2a2a2a]">—</span>
                    <span className="text-[#555]">{call.result}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Cursor */}
        {mounted && (
          <div className="mt-4 flex items-center gap-2">
            <span className="select-none text-[#2a2a2a]">$</span>
            <span className="inline-block h-4 w-2 animate-pulse bg-[#333]" />
          </div>
        )}
      </div>

      {/* Step indicator */}
      <div className="flex items-center justify-end gap-1.5 border-t border-[#1a1a1a] px-4 py-2">
        {sequences.map((_, i) => (
          <span
            key={i}
            className={`h-1 rounded-full transition-all duration-300 ${
              i === currentStep ? "w-4 bg-[#444]" : "w-1 bg-[#1e1e1e]"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
