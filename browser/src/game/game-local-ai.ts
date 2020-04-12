import { Board } from '../board'
import { BoardBase, BoardPiece } from '@kenrick95/c4/src/board'
import { GameBase } from '@kenrick95/c4/src/game'
import { Player, PlayerHuman, PlayerAi } from '@kenrick95/c4/src/player'
import { showMessage, animationFrame, getColumnFromCoord } from '@kenrick95/c4/src/utils'

class GameLocalAi extends GameBase {
  constructor(players: Array<Player>, board: BoardBase) {
    super(players, board)
  }
  afterMove() {
    // no-op
  }

  announceWinner(winnerBoardPiece: BoardPiece) {
    super.announceWinner(winnerBoardPiece)

    if (winnerBoardPiece === BoardPiece.EMPTY) {
      return
    }
    let message = '<h1>Thank you for playing.</h1>'
    if (winnerBoardPiece === BoardPiece.DRAW) {
      message += `It's a draw`
    } else {
      message += `Player ${winnerBoardPiece} wins`
    }
    message +=
      '.<br />After dismissing this message, click the board to reset game.'
    showMessage(message)
  }
}
export function initGameLocalAi() {
  const canvas = document.querySelector('canvas')
  if (!canvas) {
    console.error('Canvas DOM is null')
    return
  }
  const board = new Board(canvas)
  const humanPlayer = new PlayerHuman(BoardPiece.PLAYER_1)
  const game = new GameLocalAi(
    [humanPlayer, new PlayerAi(BoardPiece.PLAYER_2)],
    board
  )

  game.start()
  canvas.addEventListener('click', async (event: MouseEvent) => {
    if (game.isGameWon) {
      game.reset()
      await animationFrame()
      game.start()
    } else {
      const rect = canvas.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      const column = getColumnFromCoord({ x: x, y: y })
      humanPlayer.doAction(column)
    }
  })
}
