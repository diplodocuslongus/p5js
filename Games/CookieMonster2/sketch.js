// A basic keyboard game in p5js. 
// 
// See also 'Cookie Monster 1': https://editor.p5js.org/jonfroehlich/sketches/YPT_BMxFI
//
// By Jon Froehlich
// http://makeabilitylab.io
// 
// See:
//  - https://learning.oreilly.com/library/view/make-getting-started/9781457186769/ch05.html#response
//
// Ideas for Extension:
// - make it coffee monster, so it's not a cookie, it's coffee?
// - add in cookie/coffee monster who "chases" me and also eats cookies
// - [done] track cookie monster score too
// - if cookie monster touches avatar, game over?
// - add in sound effects
//   -- cookie monster sounds here: https://www.soundboard.com/sb/Cookie_Monster_Soundboard
//   -- [done] bite sound effect: https://youtu.be/B3vkzRdp9vU
// - make it so cookie has to actually go in the mouth (rather than just head)
// - use game font
// - add in more than one cookie at a time?
// - grow the avatar everytime he eats a cookie? same with cookie monster?
//   this will make game more challenging over time
// - support two player! (so have two heads, of different types)

let avatar;
let cookieMonster;
let cookie;
let playerScore = 0;
let cookieMonsterScore = 0;

let drawDebugInfo = false; // set to true to turn on debug

function preload(){
  
  // create the game characters
  avatar = new Avatar(50, 50);
  cookieMonster = new CookieMonster();
}

function setup() {
  createCanvas(600, 400);
  
  
  frameRate(8);
  cookie = new Cookie(); 
  
}

function draw() {
  background(204);
  
  
  cookie.draw();
  
  cookieMonster.update();
  cookieMonster.draw();
  
  if(avatar.contains(cookie.x, cookie.y)){
    print("Yum!");
    playerScore++;
    avatar.ateCookie();
    cookie.relocate();
  }
  else if(cookieMonster.contains(cookie.x, cookie.y)){
    cookieMonsterScore++;
    cookie.relocate();
  }
  
  avatar.draw();
  textSize(20);
  text("Your Score: " + playerScore + "     Cookie Monster Score: " + cookieMonsterScore, 10, 20);

}

function keyPressed() {
  //print(keyCode, key);
  
  // don't put any drawing code in here!
  let pixelIncrement = 15;
  if (keyCode == LEFT_ARROW) {
    avatar.x = avatar.x - pixelIncrement;
    avatar.setDir(DIRECTION.LEFT);
  } else if (keyCode == RIGHT_ARROW) {
    avatar.x = avatar.x + pixelIncrement;
    avatar.setDir(DIRECTION.RIGHT);
  } else if(keyCode == DOWN_ARROW){
    avatar.y = avatar.y + pixelIncrement; 
    avatar.setDir(DIRECTION.DOWN);
  }else if(keyCode == UP_ARROW){
    avatar.y = avatar.y - pixelIncrement; 
    avatar.setDir(DIRECTION.UP);
  }
  
  if(key == ' '){ // jump
    avatar.y = avatar.y - 100; 
  }
  
  if(avatar.getTop() < 0){
    avatar.y = 0; 
  }else if(avatar.getBottom() > height){
    avatar.y = height - avatar.height; 
  }
  
  if(avatar.getLeft() < 0){
    avatar.x = 0; 
  }else if(avatar.getRight() > width){
    avatar.x = width - avatar.width; 
  }
  
}


class Circle extends Shape{
  constructor(x, y, diameter, fillColor){
    super(x, y, diameter, diameter);
    this.fillColor = fillColor;
  }
  
  containsCircle(otherCircle){
    let distFromThisCircleToOtherCircle = dist(this.x, this.y, otherCircle.x, otherCircle.y);
    let otherCircleRadius = otherCircle.diameter / 2;
    let thisRadius = this.diameter / 2;
    if(distFromThisCircleToOtherCircle + otherCircleRadius <= thisRadius){
      return true;  
    }
    return false;
  }
  
  draw(){
    push();
    noStroke();
    fill(this.fillColor);
    ellipse(this.x, this.y, this.width);
    pop();
  }
}

const DIRECTION = {
  LEFT: 'left',
  RIGHT: 'right',
  UP: 'up',
  DOWN: 'down'
}

class CookieMonster extends Shape{
  constructor(){
    //cookie monster is 347 x 500
    let imgHeight = 200;
    let imgWidth = imgHeight / 500 * 347;
    super(150, 150, imgWidth, imgHeight); 
    this.fillColor = color(0, 0, 255);
    
    this.xVelocity = random(3, 7);
    this.yVelocity = random(3, 7);
    
    this.imgLeftStep = loadImage('assets/cookie_monster_left_step_347x500.png');
    this.imgRightStep = loadImage('assets/cookie_monster_right_step_347x500.png');
  }
  
  update(){
    this.x += this.xVelocity;
    this.y += this.yVelocity;
    
    if(this.getTop() < 0 || this.getBottom() > height){
      this.yVelocity *= -1; 
    }
    
    if(this.getLeft() < 0 || this.getRight() > width){
      this.xVelocity *= -1; 
    }   
  }
  
  draw(){
    push();
    //fill(this.fillColor);
    //rect(this.x, this.y, this.width, this.height);  
    pop();  
    
    let img = this.imgLeftStep;
    if (frameCount % 2 == 0){
      img = this.imgRightStep; 
    }
    image(img, this.x, this.y, this.width, this.height);
    
  }
  
}

class Avatar extends Shape{
  
  constructor(x, y){
    // dimensions of the avatar pngs are 200x229
    // mouth is ~46 pixels in height and 132 pixels from top
    let imgHeight = 229;
    let imgWidth = 200;
    
    let scaledHeight = 80;
    let scaledWidth = scaledHeight / imgHeight * imgWidth;
    
    super(x, y, scaledWidth, scaledHeight);
    
    this.imgOpenMouth = loadImage('assets/JonOpenMouth_200x229.png');
    this.imgClosedMouth = loadImage('assets/JonClosedMouth_200x229.png');
    //this.imgHappyMouth = loadImage('assets/JonHappyMouth_200x229.png');
    this.curDirection = DIRECTION.RIGHT;
    this.fillColor =  color(128, 0, 0);
    
    this.biteSound = loadSound('assets/bite_sound_effect.mp3');
  }
  
  ateCookie(){
    this.biteSound.play(); 
  }
  
  setDir(direction){
    this.curDirection = direction; 
  }
  
  draw(){
    push();
    
    let img = this.imgOpenMouth;
    if (frameCount % 4){
      img = this.imgClosedMouth; 
    }
  
    
    if(this.curDirection == DIRECTION.LEFT){
      translate(this.x + this.width, this.y); 
      scale(-1, 1);  
    }else if(this.curDirection == DIRECTION.RIGHT){
      translate(this.x, this.y);  
    }else if(this.curDirection == DIRECTION.DOWN){
      translate(this.x + this.height, this.y); 
      rotate(HALF_PI);
    }else if(this.curDirection == DIRECTION.UP){
      translate(this.x, this.y + this.width); 
      rotate(-HALF_PI);
    }
    
    //imageMode(CENTER);
    image(img, 0, 0, this.width, this.height);
    
    pop();
    
    
    if(drawDebugInfo){
      push();
      stroke(255,0,0);
      noFill();
      rect(this.x, this.y, this.width, this.height);
      pop();
    }
  }
}

class Cookie extends Circle{
  constructor(){
    let cookieDiameter = 30;
    let cookieRadius = cookieDiameter/2;
    let cookieX = random(cookieRadius, width - cookieRadius);
    let cookieY = random(cookieRadius, height - cookieRadius);
    super(cookieX, cookieY, cookieDiameter, color(255));
    
    this.imgCookie = loadImage('assets/cookie_300x300.png');
  }
  
  relocate(){
    let radius = this.width / 2;
    this.x = random(radius, width - radius);
    this.y = random(radius, height - radius);  
  }
  
  draw(){
    push();
    imageMode(CENTER);
    image(this.imgCookie, this.x, this.y, this.width, this.height); 
    
    if(drawDebugInfo){
      noFill();
      stroke(255, 0, 0);
      ellipse(this.x, this.y, this.width, this.height);
    }
    pop();
  }
}










