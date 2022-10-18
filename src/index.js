const { Game } = require('./gameLoop');
// const { Interface } = require('./interface');




let game = new Game();


document.addEventListener('DOMContentLoaded',() => {
  document.querySelector('input[type="submit"]')
    .addEventListener('click', (event) => {
    event.preventDefault();
    game.start();
    const form = event.target.parentNode;
    const playerName = form.querySelector('#name').value;
    form.remove();
    game.getPlayerInterface(playerName);
    window.events.register('newgame',() => {
      location.reload();
    })
  })
})



console.log('I WORK');