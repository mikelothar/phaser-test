import Phaser from 'phaser'
import firestore from './config/firestore'
import gameConfig from './config/GameConfig'

export function addHighscore(score) {
  const playerName = prompt('Enter your name', localStorage.getItem('misimiPlayerName') || '')

  if (playerName) {
    localStorage.setItem('misimiPlayerName', playerName)
    firestore.collection('highscores').add({
      points: score,
      name: playerName,
      createdAt: new Date().toISOString(),
    })
  }
}

export function showHighscores(game) {
  const rect = new Phaser.Geom.Rectangle(0, 0, gameConfig.width, gameConfig.height)
  const graphics = game.add.graphics({ fillStyle: { color: 'black', alpha: '.65' } })
  graphics.fillRectShape(rect)

  const nameFontProps = {
    font: '400 32px VT323',
    fill: 'white',
  }

  game.add.text(305, 40, 'MISIMI', { font: '400 80px VT323' })

  game.add.text(290, 120, 'High Scores', { font: '400 50px VT323' })

  const hsPos = []
  const hsName = []
  const hsScore = []

  firestore.collection('highscores')
    .orderBy('points', 'desc')
    .limit(15)
    .onSnapshot((snapshot) => {
      let i = 0
      let prevScore = { nameFontProps: '', points: '' }
      snapshot.forEach((doc) => {
        let { name, points } = doc.data()
        name = name.toUpperCase().replace(/[^A-Z0-9]+/g, '').substr(0, 10)
        // if (name === prevScore.name && points === prevScore.points) return;

        if (hsPos[i]) hsPos[i].destroy()
        hsPos[i] = game.add.text(280, 180 + (i * 25), `${i + 1}.`, nameFontProps)

        if (hsName[i]) hsName[i].destroy()
        hsName[i] = game.add.text(
          330, 180 + (i * 25),
          name,
          nameFontProps,
        )

        if (hsScore[i]) hsScore[i].destroy()
        hsScore[i] = game.add.text(
          470, 180 + (i * 25),
          points,
          nameFontProps,
        )

        prevScore = { name, points }
        i++
      })
    })
}
