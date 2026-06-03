export default function MoveList({ moves }) {
  const pairs = []
  for (let i = 0; i < moves.length; i += 2)
    pairs.push({ n: Math.floor(i / 2) + 1, w: moves[i], b: moves[i + 1] })

  return (
    <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
      <p className="text-xs text-zinc-500 mb-3 font-mono tracking-widest uppercase">
        move history
      </p>
      <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
        {pairs.map(p => (
          <div key={p.n} className="flex gap-3 text-sm font-mono">
            <span className="text-zinc-600 w-6 flex-shrink-0">{p.n}.</span>
            <span className="text-zinc-200 w-16">{p.w || ''}</span>
            <span className="text-zinc-400 w-16">{p.b || ''}</span>
          </div>
        ))}
        {moves.length === 0 && (
          <p className="text-zinc-600 text-xs">no moves yet</p>
        )}
      </div>
    </div>
  )
}
