import { useState, useEffect } from 'react'
import { Chessboard } from 'react-chessboard'
import { Chess } from 'chess.js'
import EvalBar from './components/EvalBar'
import EvalTimeline from './components/EvalTimeline'
import CoachPanel from './components/CoachPanel'
import MoveList from './components/MoveList'
import useWebSocket from './hooks/useWebSocket'

export default function App() {
  const [game, setGame] = useState(new Chess())
  const [fen, setFen] = useState(new Chess().fen())
  const [moveHistory, setMoveHistory] = useState([])
  const [evalHistory, setEvalHistory] = useState([])
  const [analysis, setAnalysis] = useState(null)
  const { send, lastMessage, connected } = useWebSocket('ws://localhost:8080')

  useEffect(() => {
    if (!lastMessage) return
    setAnalysis(lastMessage)
    setEvalHistory(prev => [
      ...prev,
      { move: prev.length + 1, eval: lastMessage.eval_cp / 100 }
    ])
  }, [lastMessage])

  function onDrop(sourceSquare, targetSquare) {
    const copy = new Chess(game.fen())
    let move = null
    try {
      move = copy.move({ from: sourceSquare, to: targetSquare, promotion: 'q' })
    } catch { return false }
    if (!move) return false

    setGame(copy)
    setFen(copy.fen())
    setMoveHistory(prev => [...prev, move.san])
    send({
      fen: copy.fen(),
      is_white: copy.turn() === 'w' ? 1 : 0,
      move_number: copy.moveNumber()
    })
    return true
  }

  function resetGame() {
    const fresh = new Chess()
    setGame(fresh)
    setFen(fresh.fen())
    setMoveHistory([])
    setEvalHistory([])
    setAnalysis(null)
  }

  const arrows = []
  if (analysis?.best_move?.length >= 4)
    arrows.push([
      analysis.best_move.slice(0, 2),
      analysis.best_move.slice(2, 4),
      'rgba(0,220,100,0.8)'
    ])
  if (analysis?.threat_move?.length >= 4 && analysis.threat_move !== '(none)')
    arrows.push([
      analysis.threat_move.slice(0, 2),
      analysis.threat_move.slice(2, 4),
      'rgba(220,50,50,0.8)'
    ])

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-mono font-bold text-white tracking-tight">
              ♟ chess coach
            </h1>
            <p className="text-xs text-zinc-500 font-mono mt-0.5">
              stockfish · 2300 elo · real-time analysis
            </p>
          </div>
          <button
            onClick={resetGame}
            className="text-xs font-mono px-4 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg transition-colors"
          >
            new game
          </button>
        </div>

        {/* Main layout */}
        <div className="flex gap-5 items-start">

          {/* Eval bar */}
          <div className="pt-4">
            <EvalBar evalCp={analysis?.eval_cp || 0} />
          </div>

          {/* Board */}
          <div className="flex-shrink-0" style={{ width: 500 }}>
            <Chessboard
              position={fen}
              onPieceDrop={onDrop}
              customArrows={arrows}
              boardStyle={{ borderRadius: 8, overflow: 'hidden' }}
              customDarkSquareStyle={{ backgroundColor: '#2d2d2d' }}
              customLightSquareStyle={{ backgroundColor: '#525252' }}
              animationDuration={150}
            />
          </div>

          {/* Right panel */}
          <div className="flex-1 flex flex-col gap-3 min-w-0">
            <CoachPanel
              coachText={analysis?.coach_text}
              threatMove={analysis?.threat_move}
              evalStr={analysis?.eval_str}
              bestMove={analysis?.best_move}
              connected={connected}
            />
            <MoveList moves={moveHistory} />
          </div>
        </div>

        {/* Timeline */}
        <div className="mt-5">
          <EvalTimeline history={evalHistory} />
        </div>

        {/* Legend */}
        <div className="flex gap-6 mt-3 text-xs font-mono text-zinc-500">
          <span className="flex items-center gap-2">
            <span className="w-4 h-0.5 bg-green-400 inline-block rounded" />
            best move
          </span>
          <span className="flex items-center gap-2">
            <span className="w-4 h-0.5 bg-red-500 inline-block rounded" />
            opponent threat
          </span>
        </div>

      </div>
    </div>
  )
}
