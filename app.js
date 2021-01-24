const GAME_MODE_AUTO = 'auto';
const GAME_MODE_MANUAL = 'manual';


const GAME_STATUS_LOST = 'lost';
const GAME_STASTUS_WIN = 'win';
const GAME_STATUS_PLAYING = 'playing';

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Fruit {
    constructor(locationX, locationY) {
        this.hasBeenEaten = false;
        this.locationX = locationX;
        this.locationY = locationY;
    }
}

class Game {
    constructor() {
        this.gameMode = GAME_MODE_AUTO;

        this.gameWidth = 300;
        this.gameHeight = 300;

        this.chunkHeight = this.gameHeight / 10;
        this.chunkWidth = this.gameWidth / 10;

        let canvas = document.createElement('canvas');

        canvas.width = this.gameWidth ?? 300;
        canvas.height = this.gameHeight ?? 300;


        canvas.style.border = '1px solid black';

        document.querySelector('body').prepend(canvas);

        this.playerHeight = this.chunkHeight;
        this.playerWidth = this.chunkWidth;

        this.playerScore = 0;

        this.playerX = 0;
        this.playerY = 0;

        /** @type{Array <Point>} */
        this.playerPointLocations = [];

        this.canvas = document.querySelector('canvas');
        this.context = canvas.getContext('2d');

        this.context.fillStyle = "#FF0000";

        this.fruit = this.generateFruit();

        document.addEventListener('keydown', this.registerKey.bind(this), false);
    }

    generateFruit() {
        let x, y;

        do {
            const point = this.generateFruitPoint();

            x = point.x;
            y = point.y;

        } while (this.playerPointLocations.filter(point => point.x === x && point.y === y).length > 0);

        return new Fruit(x, y);
    }

    generateFruitPoint() {
        const chunkCountX = this.gameWidth / this.chunkWidth;
        const chunkCountY = this.gameHeight / this.chunkHeight;

        // return Math.random() * (max - min) + min;  - mdn <33
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
        const randX = parseInt(Math.random() * (chunkCountX - 1)) * this.chunkWidth;
        const randY = parseInt(Math.random() * (chunkCountY - 1)) * this.chunkHeight;

        return new Point(randX, randY);
    }

    moveUp() {
        if (this.playerY === 0) {
            return;
        }

        this.playerY -= this.playerHeight
    }

    moveDown() {
        if (this.playerY >= (this.gameHeight - this.playerHeight)) {
            return;
        }

        this.playerY += this.playerHeight
    }

    moveRight() {
        if (this.playerX >= (this.gameWidth - this.playerWidth)) {
            return;
        }

        this.playerX += this.playerWidth;
    }

    moveLeft() {
        if (this.playerX === 0) {
            return;
        }

        this.playerX -= this.playerWidth;
    }

    drawFruit() {
        this.context.fillStyle = "#0000FF";

        let width = this.playerWidth;
        let height = this.playerHeight;
        this.context.fillRect(this.fruit.locationX, this.fruit.locationY, width, height);
    }

    redrawGame() {
        this.clear();

        this.canvas = document.querySelector('canvas');

        this.context = this.canvas.getContext('2d');

        if (this.playerPointLocations.length > this.playerScore + 1) {
            this.playerPointLocations.shift();
        }

        this.context.fillStyle = "#FF0000";

        for(let point of this.playerPointLocations) {
            let width = this.playerWidth;
            let height = this.playerHeight;
            this.context.fillRect(point.x, point.y, width, height);
        }
        
        this.drawFruit();
    }

    addPlayerPoint() {
        const point = new Point(this.playerX, this.playerY);
        this.playerPointLocations.push(point);
    }

    registerKey(event) {
        switch (event.key) {
            case 'w':
                this.moveUp()
                break;
            case 's':
                this.moveDown();
                break;
            case 'a':
                this.moveLeft();
                break;
            case 'd':
                this.moveRight()
                break;
        }

        if (this.gameMode === GAME_MODE_AUTO) {

        }

        this.addPlayerPoint();

        if (this.playerX === this.fruit.locationX && this.playerY === this.fruit.locationY) {
            this.playerScore++;
            this.fruit = this.generateFruit();
        }

        this.redrawGame();
    }

    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

const game = new Game();