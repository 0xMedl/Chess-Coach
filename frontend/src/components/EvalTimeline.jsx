import {
  LineChart, Line, XAxis, YAxis,
  ReferenceLine, Tooltip, ResponsiveContainer
} from 'recharts'

export default function EvalTimeline({ history }) {
  return (
    <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
      <p className="text-xs text-zinc-500 mb-3 font-mono tracking-widest uppercase">
        evaluation timeline
      </p>
      <ResponsiveContainer width="100%" height={100}>
        <LineChart data={history}>
          <XAxis
            dataKey="move"
            tick={{ fontSize: 10, fill: '#52525b' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[-6, 6]}
            tick={{ fontSize: 10, fill: '#52525b' }}
            axisLine={false}
            tickLine={false}
            width={30}
          />
          <ReferenceLine y={0} stroke="#3f3f46" strokeWidth={1} />
          <Tooltip
            formatter={(v) => [v > 0 ? `+${v.toFixed(2)}` : v.toFixed(2), 'eval']}
            contentStyle={{
              background: '#18181b',
              border: '1px solid #3f3f46',
              borderRadius: 8,
              fontSize: 12
            }}
          />
          <Line
            type="monotone"
            dataKey="eval"
            stroke="#4ade80"
            dot={false}
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
