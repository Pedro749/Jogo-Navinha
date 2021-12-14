import debounce from "./debounce.js";

class Ship {
  constructor() {
    this.tela = document.createElement('div');
    this.tela.style.width = '600px';
    this.tela.style.height = '300px';
    this.tela.style.backgroundColor = '#e5e5e5';
    document.body.appendChild(this.tela);
    this.moves = debounce(this.moves.bind(this), 10);
    this.createEnimies = this.createEnimies.bind(this);
    this.index = 120;
    this.life = 3;
    this.score = 0;
    this.speedMove = 20;
    this.count = 5;
  }

  createShip() {
    this.ship = document.createElement('div');
    this.ship.style.width = '30px';
    this.ship.style.height = '30px';
    this.ship.style.backgroundColor = '#e5742d';
    this.ship.style.transform = `translate3d(30px, 120px, 0)`;
    this.tela.appendChild(this.ship);
  }

  shoot(position) {
    this.bullet = document.createElement('div');
    this.bullet.style.width = '10px';
    this.bullet.style.height = '10px';
    this.bullet.style.backgroundColor = '#000';
    this.bullet.style.position = `absolute`;
    this.bullet.style.left = '70px';
    this.bullet.dataset.shoot = '';
    this.bullet.style.top = `${position+10}px`;
    this.tela.appendChild(this.bullet);

    this.movement(this.bullet, 'right');
  }

  colision(element) {
    const enimies = document.querySelectorAll('[data-enimies]');
    enimies.forEach((enimie) => {
      if (
        +element.style.left.replace(/\D/g, '') +10 > +enimie.style.left.replace(/\D/g, '') - 30
        && ((+element.style.top.replace(/\D/g, '')-10 > +enimie.style.top.replace(/\D/g, '') - 20))
        && ((+element.style.top.replace(/\D/g, '') < +enimie.style.top.replace(/\D/g, '') + 25))){
          if (enimie.parentNode === this.tela && element.parentNode === this.tela) {
            this.score += 1;
            this.count -= 1;
            this.tela.removeChild(element);
            this.tela.removeChild(enimie);
          }
      }
    });
  }

  movement(elemento, direction) {
    let positionX;
    this.addSpeed();

    if (direction === 'right') {
      positionX = 70;
    } else if (direction === 'left') {
      positionX = 570;
    }

    const move = () => {
      this.countScore();
      if (direction === 'right') {
        positionX += 20;
        this.colision(elemento);
      } else if (direction === 'left') {
        positionX -= this.speedMove;
      }
      elemento.style.left = `${positionX}px`;
      let inter = setTimeout(move, 200);
      if ((positionX > 600 && direction === 'right') 
        || (positionX < -30 && direction === 'left')) { 
        clearTimeout(inter);
        if (elemento.parentNode === this.tela) {
          this.tela.removeChild(elemento);
          if (direction === 'left') {
            this.life -=1;
          }
          if (this.life === 0) {
            this.endGame();
          }
        }
      }
    }
    const interval = setTimeout(move, 200);
  }

  randNumber(max, min) {
    return Math.floor(Math.random() * (max - min) +  min);
  }

  createEnimies() {
    const number = this.randNumber(270, 0);
    this.enimies = document.createElement('div');
    this.enimies.style.width = '30px';
    this.enimies.style.height = '30px';
    this.enimies.style.backgroundColor = '#000';
    this.enimies.style.position = `absolute`;
    this.enimies.style.left = '570px';
    this.enimies.dataset.enimies = '';
    this.enimies.style.top = `${number}px`;
    this.tela.appendChild(this.enimies);
    this.movement(this.enimies, 'left');
  }

  moves(event) {
    switch(event.key) {
      case 'ArrowDown' :
        this.index = this.index > 240 ? 270 : this.index + 15; 
        this.ship.style.transform = `translate3d(30px, ${this.index}px, 0)`;
        break;
      case 'ArrowUp':
        this.index = this.index < 10 ? 0 : this.index - 15; 
        this.ship.style.transform = `translate3d(30px, ${this.index}px, 0)`;
        break;
      case ' ':
        this.shoot(this.index);
        break;
      case 'Enter':
        const start = document.querySelector('.inicio');
        start.classList.add('ativo');
        this.aliens = setInterval(() => { 
          this.createEnimies();
        }, 2000);
        break;
    }
  }

  countScore() {
    const lifes = document.querySelector('.lifes');
    lifes.innerHTML = `LIFES: ${this.life}`
    const score = document.querySelector('.score');
    score.innerHTML = `SCORE: ${this.score}`;
  }
  addSpeed() {
    if (this.count === 0) {
      this.speedMove += 1;
      this.count = 5;
    }
  }

  addEvents() {
    document.addEventListener('keydown', this.moves);
  }

  endGame() {
    const reset = confirm('PERDEU!!!');
    if (reset) window.location = 'index.html';
  }

  init() {
    this.addEvents();
    this.createShip();
    return this;
  }
}

const nave = new Ship();
nave.init();
