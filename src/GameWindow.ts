import Canvas from './canvas';
import Ball from './Entities/Ball';
import Paddle from './Entities/Paddle';
import PauseScreen from './Entities/UI/PauseScreen';
import Collision from './Logic/Collision';
import { IPlayer } from './Interface/interfaces';
import { Player } from './Logic/Player';
import Audio from './Audio/Audio';

export default class GameWindow extends Canvas {

    static WINDOW_LENGTH = 800;
    static WINDOW_HEIGHT = 600;
    static WINDOW_COLOR = 100;
    static WINDOW_PAUSED_COLOR = 40;

    private isGameStarted: boolean = false;

    private ball: Ball;
    private pauseScreen: PauseScreen;
    private Audio: Audio;

    private players: Array<IPlayer>;

    private collision: Collision;

    constructor() {
        super();
        this.Audio = new Audio();
        this.ball = new Ball();
        this.collision = new Collision(this);
        this.pauseScreen = new PauseScreen(GameWindow.WINDOW_LENGTH, GameWindow.WINDOW_HEIGHT, GameWindow.WINDOW_PAUSED_COLOR)

        // Setup Players
        let humanPlayer = new Player("Human");
        let aiPlayer = new Player("Computer", true);

        this.players = [humanPlayer, aiPlayer];
    }

    setup() {
        this.createCanvas(GameWindow.WINDOW_LENGTH, GameWindow.WINDOW_HEIGHT);
        this.frameRate(60);
    }

    mouseClicked () {
        if(this.pauseScreen.clicked(this.mouseX, this.mouseY)) {
            this.isGameStarted = true;
        }
    }

    draw() {
        // Render Background
        this.background(GameWindow.WINDOW_COLOR);
        for (let i = 0; i < GameWindow.WINDOW_HEIGHT; i += 10) {
            this.line(GameWindow.WINDOW_LENGTH / 2, i, GameWindow.WINDOW_LENGTH / 2, i + 5);
        }

        if (!this.isGameStarted) {
            this.pauseScreen.display(this);
        } else {
            this.players.forEach(player => {
                const y = player.IsAI ? player.Paddle.y : this.mouseY;

                if (this.collision.circRect(this.ball, player.Paddle)) {
                    this.ball.velocityX = -this.ball.velocityX;
                    this.ball.velocityY = -this.ball.velocityY;

                    this.Audio.playSound(this.Audio.paddleHitsBall);
                }

                player.Paddle.display(this, player.Paddle.x, y);
            })

            // Update the ball
            this.ball.display(this);
        }
    }

}