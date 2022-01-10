var mario, mario_running, mario_collided;
var bg, bgImage;
var brickGroup, brickImage;
var coinsGroup, coinImage;
var turtle, mushroom;
var obsGroup
var coinScore=0;
var gamemode = "off";
var start, restart, startImage, restartImage;
var dieSound,marioDeadImage;
//load external files 
function preload(){
  mario_running =  loadAnimation("images/mar1.png","images/mar2.png","images/mar3.png",
  "images/mar4.png","images/mar5.png","images/mar6.png","images/mar7.png");
  bgImage = loadImage("images/bgnew.jpg");
  brickImage = loadImage("images/brick.png");
  coinSound = loadSound("sounds/coinSound.mp3");
  coinImage = loadAnimation("images/con1.png","images/con2.png","images/con3.png","images/con4.png","images/con5.png","images/con6.png");
  turtle = loadAnimation("images/tur1.png","images/tur2.png","images/tur3.png","images/tur4.png","images/tur5.png",)
  mushroom = loadAnimation("images/mush1.png","images/mush2.png","images/mush3.png","images/mush4.png","images/mush5.png","images/mush6.png",)
  marioDeadImage = loadAnimation("images/dead.png")
  dieSound = loadSound("sounds/dieSound.mp3")
  startImage = loadImage("images/Start.png")
  restartImage = loadImage("images/Restart.png")
}
//inetial environment
function setup() {
  createCanvas(1000, 600);
  //bg property 
  bg = createSprite(580,300);
  bg.addImage(bgImage);
  bg.scale =0.5;

  
  //makes mario running animation
  mario = createSprite(200,505,20,50);
  mario.addAnimation("running", mario_running);
  mario.addAnimation("dead",marioDeadImage);
  mario.scale =0.3;
  mario.debug = false
  //creates the sprite for mario to stand
  ground = createSprite(200,585,400,10);
  //hide the ground sprite
  ground.visible = false;
  //In p5.play groups are collections of sprites with similar behavior. For example a group may contain all the sprites in the background or all the sprites that "kill" the player.
  brickGroup = new Group();
  coinsGroup = new Group();
  obsGroup = new Group();
  start = createSprite(500,300);
  start.addImage(startImage)
  start.scale = 0.1
  restart = createSprite(500,300);
  restart.addImage(restartImage)
  restart.visible = false
}
//exicutes continiously 
function draw() {
  if(mousePressedOver(start)){
    gamemode = "start"
    start.visible = false
  }
  if(gamemode == "start"){ 
    bg.velocityX = -6;
    //scrool background
  if (bg.x < 100){
    bg.x=bg.width/4;
  }
  //avoid mario moving out of the screen in x direction(horizontal direction)
  if(mario.x<200){
    mario.x=200;
  }
 //avoid mario moving out of the screen in y direction(vertical direction)
  if(mario.y<50){
    mario.y=50;
  }
  //jump
  if(keyDown("space") ) {
    mario.velocityY = -16;
  }
  //gravity
  mario.velocityY = mario.velocityY + 0.5;
  //calling the function to generate bricks
  generateBricks();
  //make mario to stand on bricks
  for(var i = 0 ; i< (brickGroup).length ;i++){
    var temp = (brickGroup).get(i) ;
    //give collide property 
    if (temp.isTouching(mario)) {
       mario.collide(temp);
      }
        
    }
    //generating coins for score
    generateCoins();
    //make mario collect coins
    for(var i = 0 ; i< (coinsGroup).length ;i++){
      var temp = (coinsGroup).get(i) ;
      //collide property and incriment score 
      if (temp.isTouching(mario)) {
        coinSound.play();
        coinScore++;
        temp.destroy();
        temp=null;
        }
          
      }
            //creates obsticle 
            obsticle();
            if(obsGroup.isTouching(mario)){
              dieSound.play()
              gamemode = "end"
            }
  }
  if(gamemode == "end"){
    mario.changeAnimation("dead",marioDeadImage)
    mario.setCollider("rectangle",0,0,300,10)
    mario.y = 570
    obsGroup.setVelocityXEach(0)
    coinsGroup.setVelocityXEach(0)
    brickGroup.setVelocityXEach(0)
    mario.velocityX = 0
    mario.velocityY = 0
    bg.velocityX = 0
    coinsGroup.setLifetimeEach(-1)
    brickGroup.setLifetimeEach(-1)
    obsGroup.setLifetimeEach(-1)
    restart.visible = true
    if(mousePressedOver(restart)){
      gamemode = "start"

      restartGame()      
    }
  }
  
      //collide property for mario to stand
  mario.collide(ground);

      //draws all sprites on canvas 
  drawSprites();
  textSize(20);
  fill("brown")
  text("Coins Collected: "+ coinScore, 500,50);
  
}

//creates bricks 
function generateBricks() {
  if (frameCount % 70 === 0) {
    var brick = createSprite(1200,120,40,10);
    //makes brick location random in the y axis
    brick.y = random(50,450);
    brick.addImage(brickImage);
    brick.scale = 0.5;
    brick.velocityX = -5;
    //makes a lifetime for the bricks
    brick.lifetime =250;
    brickGroup.add(brick);
  }
}
// makes coins 
function generateCoins() {
  if (frameCount % 50 === 0) {
    var coin = createSprite(1200,120,40,10);
    coin.addAnimation("coin", coinImage);
    coin.y = Math.round(random(80,350));
    coin.scale = 0.1;
    coin.velocityX = -3;
    coin.lifetime = 1200;
    coinsGroup.add(coin);
  }
}

function obsticle() {
  if (frameCount % 100 == 0) {
    var obs1 = createSprite(1100,550)
    obs1.velocityX = -5
    var variable = Math.round(random(1,2))
    console.log(variable)
    switch (variable){
      case 1: obs1.addAnimation("mushroom",mushroom); break
      case 2: obs1.addAnimation("turt",turtle); break
    }
    obs1.scale = 0.2;
    obs1.lifetime = 1200;
    obsGroup.add(obs1)
  }
}

function restartGame(){
  obsGroup.destroyEach()
  coinsGroup.destroyEach()
  brickGroup.destroyEach()
  mario.changeAnimation("running",mario_running)
  restart.visible = false
  coinScore = 0
}