export default function CoachPanel({ coachText, threatMove, evalStr, bestMove, connected }) {
  return (
    <div className="bg-zinc-900 rounded-xl p-4 space-y-3 border border-zinc-800">
      <div className="flex items-center justify-between">
        <span className="text-xs text-zinc-500 font-mono tracking-widest uppercase">
          coach · 2300 elo
        </span>
        <span className={`text-xs px-2 py-0.5 rounded-full font-mono border ${
          connected
            ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
            : 'bg-zinc-800 text-zinc-500 border-zinc-700'
        }`}>
          {connected ? '● live' : '○ offline'}
        </span>
      </div>

      <div className="text-3xl font-mono font-bold text-emerald-400 tracking-tight">
        {evalStr || '0.00'}
      </div>

      {bestMove && (
        <div className="flex items-center gap-2 bg-zinc-800 rounded-lg px-3 py-2">
          <span className="text-xs text-zinc-400">best move</span>
          <span className="text-emerald-300 font-mono font-bold text-sm">{bestMove}</span>
          <div className="ml-auto w-3 h-0.5 bg-emerald-400 rounded" />
        </div>
      )}

      {threatMove && threatMove !== '(none)' && threatMove.length >= 4 && (
        <div className="flex items-center gap-2 bg-red-950 border border-red-900 rounded-lg px-3 py-2">
          <span className="text-xs text-red-400">⚠ threat</span>
          <span className="text-red-300 font-mono font-bold text-sm">{threatMove}</span>
          <div className="ml-auto w-3 h-0.5 bg-red-500 rounded" />
        </div>
      )}

      <p className="text-sm text-zinc-300 leading-relaxed border-t border-zinc-800 pt-3">
        {coachText || 'Make a move to receive coaching.'}
      </p>
    </div>
  )
}
