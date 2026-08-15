"use client";

import React, { useState, useEffect } from "react";
import { Shield, EyeOff, TrendingUp, DollarSign, BarChart3, X, RefreshCw } from "lucide-react";
import { soundFX } from "@/lib/soundFX";

export default function PanicDisguise() {
  const [isPanicActive, setIsPanicActive] = useState(false);
  const [disguiseMode, setDisguiseMode] = useState<"bloomberg" | "excel">("bloomberg");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle stealth camouflage with ESC key
      if (e.key === "Escape") {
        try { soundFX?.playPanicDisguise(); } catch {}
        setIsPanicActive(prev => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!isPanicActive) {
    return (
      <button
        onClick={() => setIsPanicActive(true)}
        title="Modo Pánico Rápido (Presiona ESC)"
        className="fixed bottom-6 left-6 z-[100] group p-3 rounded-2xl glass-obsidian border border-white/15 text-white/50 hover:text-brand-gold hover:border-brand-gold shadow-2xl transition-all hover:scale-105 active:scale-95 flex items-center gap-2 text-[9px] uppercase font-mono"
      >
        <EyeOff size={15} />
        <span className="hidden sm:inline">Camuflaje (ESC)</span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[999] bg-[#0c1017] text-[#c9d1d9] font-mono select-none overflow-auto p-4 sm:p-8 flex flex-col justify-between">
      
      {/* ── TOP TERMINAL BAR ── */}
      <div className="flex items-center justify-between border-b border-[#30363d] pb-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#fa7970]" />
            <span className="w-3 h-3 rounded-full bg-[#faa356]" />
            <span className="w-3 h-3 rounded-full bg-[#7ce38b]" />
          </div>
          <span className="text-xs font-bold text-[#79c0ff] tracking-wider">
            BLOOMBERG TERMINAL · GLOBAL MARKET MONITOR v4.8
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setDisguiseMode(disguiseMode === "bloomberg" ? "excel" : "bloomberg")}
            className="text-[10px] px-3 py-1 bg-[#21262d] rounded border border-[#30363d] text-[#8b949e] hover:text-white"
          >
            Modo: {disguiseMode.toUpperCase()}
          </button>
          
          {/* Secret return button disguised as 'Disconnect' */}
          <button
            onClick={() => setIsPanicActive(false)}
            className="text-xs px-4 py-1.5 bg-[#238636] hover:bg-[#2ea043] text-white font-bold rounded flex items-center gap-1.5"
          >
            <span>Volver a la App (ESC)</span>
          </button>
        </div>
      </div>

      {disguiseMode === "bloomberg" ? (
        /* ── BLOOMBERG TERMINAL DASHBOARD ── */
        <div className="my-6 space-y-6">
          {/* Market Ticker Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { ticker: "NASDAQ: QQQ", price: "482.15", change: "+1.42%", up: true },
              { ticker: "S&P 500: SPY", price: "554.80", change: "+0.85%", up: true },
              { ticker: "BTC/USDT", price: "64,280.00", change: "+3.10%", up: true },
              { ticker: "US 10Y YIELD", price: "3.88%", change: "-0.04%", up: false },
            ].map((m) => (
              <div key={m.ticker} className="p-4 bg-[#161b22] border border-[#30363d] rounded-xl space-y-1">
                <span className="text-[10px] text-[#8b949e] block font-bold">{m.ticker}</span>
                <div className="text-xl font-bold text-white">{m.price}</div>
                <span className={`text-xs font-bold ${m.up ? "text-[#7ee787]" : "text-[#ffa198]"}`}>{m.change}</span>
              </div>
            ))}
          </div>

          {/* Candle Chart Simulation */}
          <div className="p-6 bg-[#161b22] border border-[#30363d] rounded-2xl space-y-4">
            <div className="flex items-center justify-between text-xs text-[#8b949e]">
              <span>EQUITY TRADING PORTFOLIO · REAL TIME (1D)</span>
              <span className="text-[#7ee787]">STATUS: ONLINE · LATENCY 14ms</span>
            </div>

            <div className="h-44 w-full flex items-end justify-between gap-1 border-b border-l border-[#30363d] p-2">
              {[40, 65, 55, 80, 70, 95, 85, 110, 100, 130, 120, 145, 135, 160, 150, 175, 165, 190, 180, 205].map((val, idx) => (
                <div
                  key={idx}
                  className="w-full bg-[#238636] rounded-t hover:bg-[#2ea043] transition-all"
                  style={{ height: `${(val / 210) * 100}%` }}
                />
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* ── EXCEL SPREADSHEET ── */
        <div className="my-6 overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse border border-[#30363d]">
            <thead className="bg-[#161b22] text-[#8b949e]">
              <tr>
                {["A: Account", "B: Asset Class", "C: Allocation ($)", "D: Target Return (%)", "E: Risk Score"].map((col) => (
                  <th key={col} className="p-3 border border-[#30363d] font-bold">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { acc: "ACC-9081-ALPHA", asset: "Private Equity Latin America", alloc: "$450,000", ret: "18.5%", risk: "Low" },
                { acc: "ACC-9082-CORP", asset: "Real Estate Swiss Trust", alloc: "$1,200,000", ret: "12.0%", risk: "Minimal" },
                { acc: "ACC-9083-CRYPTO", asset: "USDT Liquidity Pool", alloc: "$180,000", ret: "14.2%", risk: "Medium" },
                { acc: "ACC-9084-EQUITY", asset: "Tech High Alpha Fund", alloc: "$650,000", ret: "22.4%", risk: "Medium" },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-[#161b22]/80">
                  <td className="p-3 border border-[#30363d] text-[#79c0ff]">{row.acc}</td>
                  <td className="p-3 border border-[#30363d]">{row.asset}</td>
                  <td className="p-3 border border-[#30363d] font-bold text-white">{row.alloc}</td>
                  <td className="p-3 border border-[#30363d] text-[#7ee787]">{row.ret}</td>
                  <td className="p-3 border border-[#30363d]">{row.risk}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── FOOTER STATUS ── */}
      <div className="border-t border-[#30363d] pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-[#8b949e]">
        <span>ENCRYPTED SECURE SESSION · ZERO COOKIES · NO PERSISTED DATA</span>
        <button
          onClick={() => setIsPanicActive(false)}
          className="text-white hover:text-[#79c0ff] font-bold underline"
        >
          Desactivar Camuflaje y Continuar Navegando
        </button>
      </div>

    </div>
  );
}
