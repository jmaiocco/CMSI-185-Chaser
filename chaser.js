const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const progressBar = document.querySelector("progress");

function distanceBetween(sprite1, sprite2) {
  return Math.hypot(sprite1.x - sprite2.x, sprite1.y - sprite2.y);
}

function haveCollided(sprite1, sprite2) {
  return distanceBetween(sprite1, sprite2) < sprite1.radius + sprite2.radius;
}

class Sprite {
  draw() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }
}

class Player extends Sprite {
  constructor(x, y, radius, color, speed) {
    super();
    Object.assign(this, { x, y, radius, color, speed });
  }
}

let player = new Player(250, 150, 15, "lemonchiffon", 0.07);

class Enemy extends Sprite {
  constructor(x, y, radius, color, speed) {
    super();
    Object.assign(this, { x, y, radius, color, speed });
  }
}

let enemies = [
  new Enemy(
    1 + 800 * Math.random(),
    1 + 800 * Math.random(),
    20,
    "rgba(250, 0, 50, 0.8)",
    0.05
  ),
  new Enemy(
    1 + 800 * Math.random(),
    1 + 800 * Math.random(),
    17,
    "rgba(200, 100, 0, 0.7)",
    0.03
  ),
  new Enemy(
    1 + 800 * Math.random(),
    1 + 800 * Math.random(),
    22,
    "rgba(50, 10, 70, 0.5)",
    0.01
  )
];

let mouse = { x: 0, y: 0 };
document.body.addEventListener("mousemove", updateMouse);
function updateMouse(event) {
  const { left, top } = canvas.getBoundingClientRect();
  mouse.x = event.clientX - left;
  mouse.y = event.clientY - top;
}

let score = 0;
function drawScore() {
  ctx.font = "32px Brush Script MT";
  ctx.fillStyle = "#ffffff";
  ctx.fillText(`Score: ${score}`, 8, 36);
}
function increaseScore (){
  score+=5;
}

let level = 1;
function drawLevel() {
  ctx.font = "32px Brush Script MT";
  ctx.fillStyle = "#ffffff";
  ctx.fillText(`Level: ${level}`, 650, 36);
}
function changeLevel () {
  level+=1;
}

function moveToward(leader, follower, speed) {
  follower.x += (leader.x - follower.x) * speed;
  follower.y += (leader.y - follower.y) * speed;
}

function updateScene() {
  moveToward(mouse, player, player.speed);
  enemies.forEach(enemy => moveToward(player, enemy, enemy.speed));
  enemies.forEach(enemy => {
    if (haveCollided(enemy, player)) {
      progressBar.value -= 1;
    }
  });
}

function clearBackground() {
  ctx.fillStyle = "lightgreen";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawGameOver(){
  ctx.font = "54px Brush Script MT";
  ctx.fillStyle = "#FF0000";
  ctx.fillText("YOU HAVE BEEN DEVOURED", canvas.width/20, canvas.height/2);
}

function drawScene() {
  clearBackground();
  player.draw();
  enemies.forEach(enemy => enemy.draw());
  drawScore();
  drawLevel();
  updateScene();
  if (progressBar.value <= 0){
    drawGameOver();
  } else {
    requestAnimationFrame(drawScene);
  }
}

requestAnimationFrame(drawScene);
setInterval(increaseScore, 5000);
