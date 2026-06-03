export default function EvalBar({ evalCp }) {
  const clamped = Math.max(-500, Math.min(500, evalCp))
  const whitePercent = 50 + (clamped / 500) * 50
  const label = evalCp > 0
    ? `+${(evalCp / 100).toFixed(2)}`
    : (evalCp / 100).toFixed(2)

  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-xs text-zinc-400 font-mono">{label}</span>
      <div className="w-5 h-72 bg-zinc-800 rounded-full overflow-hidden flex flex-col-reverse border border-zinc-700">
        <div
          className="bg-white transition-all duration-700 ease-in-out"
          style={{ height: `${whitePercent}%` }}
        />
      </div>
      <span className="text-xs text-zinc-600">eval</span>
    </div>
  )
}
