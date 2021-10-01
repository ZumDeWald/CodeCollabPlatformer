import Phaser from 'phaser';
import bg from './assets/Mario1-1_bg.png';

class MyGame extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.image('bg', bg);
    }
      
    create ()
    {
        this.add.image(0, 0, 'bg').setOrigin(0,0);
    }
}

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 600,
    height: 400,
    scene: MyGame
};

const game = new Phaser.Game(config);
