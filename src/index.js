import Phaser from 'phaser';
import World from './assets/world.json';
import TileSet from './assets/tileSet.png';
import Player from './assets/player.png';
import PlayerAtlas from './assets/player.json';
import Nav from './assets/nav.png';
import NavAtlas from './assets/nav.json';
import Nre from './assets/nre.png';
import NreAtlas from './assets/nre.json';

class MyGame extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.tilemapTiledJSON('world', World);
        this.load.image('tileSet', TileSet);
        this.load.atlas('player', Player, PlayerAtlas);
        this.load.atlas('nav', Nav, NavAtlas);
        this.load.atlas('nre', Nre, NreAtlas);
    }
      
    create ()
    {
        const world = this.make.tilemap({key : 'world'});
        const tileSet = world.addTilesetImage('world', 'tileSet');
        world.createStaticLayer('background', tileSet, 0,0);
        const level = world.createStaticLayer('level1', tileSet, 0,0);
        
        level.setCollisionByExclusion(-1, true);
        
        this.player = this.physics.add.sprite(50, 0, 'player');
        this.player.setCollideWorldBounds(true);
        this.physics.add.collider(this.player, level);
        this.cameras.main.setBounds(0, 0, world.widthInPixels, world.heightInPixels);
        this.cameras.main.startFollow(this.player, true);
        this.cameras.main.setZoom(1.8);

        this.nav = this.physics.add.sprite(500, 300, 'nav');
        this.nav.setImmovable(true);
        this.physics.add.collider(this.nav, level);

        this.nre = this.physics.add.sprite(250, 200, 'nre');
        this.nre.setImmovable(true);
        this.physics.add.collider(this.nre, level);

        this.anims.create({key: 'idle', frames: [{key: 'player', frame: 'player_0'}], frameRate: 10});
        this.anims.create({key: 'jump', frames: [{key: 'player', frame: 'player_5'}], frameRate: 10});
        this.anims.create({key: 'walk', frames: this.anims.generateFrameNames('player', {prefix: 'player_', start: 1, end: 3 }), frameRate: 10, repeat: -1});

        this.anims.create({key: 'navHit', frames: [{key: 'nav', frame: 'nav_6'}], frameRate: 6});
        this.anims.create({key: 'navIdle', frames: this.anims.generateFrameNames('nav', {prefix: 'nav_', start: 0, end: 5 }), frameRate: 5, repeat: -1});

        this.anims.create({key: 'nreHit', frames: [{key: 'nre', frame: 'nre_6'}], frameRate: 6});
        this.anims.create({key: 'nreIdle', frames: this.anims.generateFrameNames('nre', {prefix: 'nre_', start: 0, end: 5 }), frameRate: 5, repeat: -1});
        
        this.physics.add.collider(this.player, this.nav);
        this.physics.add.collider(this.player, this.nre);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.physics.world.setBounds(0, 0, 7168, 400);
    }

    update() {
        if(this.cursors.left.isDown) {
            this.player.setVelocityX(-200);
            this.player.setFlipX(true);
            if(this.player.body.onFloor()) {
                this.player.play('walk', true);
            }

        } else if(this.cursors.right.isDown) {
            this.player.setVelocityX(200);
            this.player.setFlipX(false);
            if(this.player.body.onFloor()) {
                this.player.play('walk', true);
            }

        } else {
            this.player.setVelocityX(0);
            if(this.player.body.onFloor()) this.player.play('idle', true);
        }

        if(this.cursors.up.isDown && this.player.body.onFloor()){
            this.player.setVelocityY(-300);
            this.player.play('jump', true);
        }     
        
        if(this.player.body.hitTest(this.nav.body.x, this.nav.body.y)) this.nav.play('navHit', true);
        else this.nav.play('navIdle', true);

        if(this.player.body.hitTest(this.nre.body.x, this.nre.body.y)) this.nre.play('nreHit', true);
        else this.nre.play('nreIdle', true);
    }
}

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 600,
    height: 400,
    pixelArt: true,
    scene: MyGame,
    physics:{
        default: 'arcade',
        arcade: {
            gravity: { y: 500},
            debug: false
        }
    }
};

const game = new Phaser.Game(config);
