import Canvas from './canvas';
import Ball from './Entities/Ball';
import Paddle from './Entities/Paddle';
import PauseScreen from './Entities/UI/PauseScreen';
import Collision from './Logic/Collision';
import { IPlayer } from './Interface/interfaces';
import { Player } from './Logic/Player';

export default class GameWindow extends Canvas {

    static WINDOW_LENGTH = 800;
    static WINDOW_HEIGHT = 600;
    static WINDOW_COLOR = 100;
    static WINDOW_PAUSED_COLOR = 40;

    public isGameStarted: boolean = false;

    private ball: Ball;
    private pauseScreen: PauseScreen;

    private players: Array<IPlayer>;

    private collision: Collision;

    protected debuggingEnabled = true;

    constructor() {
        super();
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

    pauseGame (pause: boolean) {
        this.isGameStarted = !pause;
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
            // Render Scores


            // Handle Players & Paddles
            this.players.forEach(player => {
                const y = player.IsAI ? player.Paddle.y : (this.mouseY);

                if (this.collision.circRect(this.ball, player.Paddle)) {
                    const reflectAngle = (player.Paddle.height / 2) - (player.Paddle.height - this.ball.y);

                    this.ball.velocityX = this.ball.speed *= Math.cos(reflectAngle);
                    this.ball.velocityY = this.ball.speed *- Math.sin(reflectAngle);

                    this.ball.isColliding = true;
                }

                player.Paddle.display(this, player.Paddle.x, y);
                this.stroke(0);
            })

            if (this.collision.circleCollidesWithBorder(this.ball)) {
                this.ball.velocityY *= -1;
            }

            // Update the ball
            this.ball.display(this);
            this.ball.isColliding = false;
        }
    }

}