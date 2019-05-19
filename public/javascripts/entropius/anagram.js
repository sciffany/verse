var c = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var pad = 40;
c.width = window.innerWidth - pad * 2;
c.height = window.innerHeight - pad * 2;

var state = 1; //0-not playing, 1-playing, 2-ending
window.addEventListener("resize", resizeCanvas, false);
window.addEventListener("orientationchange", resizeCanvas, false);
c.focus();
var level = 0;
var word = selection[level];
var letters = shuffled[level];
var nLetters = letters.length;
var guess = [];
var noOfWords = shuffled.length;
var guessed = [];
var touchX;
var touchY;

for (var i = 0; i < noOfWords; i++) {
  guessed.push(0);
}

var keys = {};

var YELLOW = "#F0CA4D";
var GREEN = "#68ed80";

midGame();

function allWords() {}

function startGame() {}

function endGame() {}

function slid(e) {
  var touch = e.changedTouches[0];
  var deltaX = touch.pageX - touchX;
  var deltaY = touch.pageY - touchY;
  var gradient = deltaY / deltaX;
  console.log(deltaX);
  if (deltaX < -300) {
    if (!guessed[level]) {
      returnLetters();
    }
    changeLevel(-1);
  } else if (deltaX > 300) {
    if (!guessed[level]) {
      returnLetters();
    }
    changeLevel(1);
  }
}

function touched() {
  var touch = event.touches[0];

  var x = touch.pageX - canvas.offsetLeft;
  var y = touch.pageY - canvas.offsetTop;

  var percentCanvas = getPercentCanvas();

  var stride = getStride(nLetters, percentCanvas);

  x -= ((1 - percentCanvas) * c.width) / 2 + stride / 2;

  var i = x / stride;

  i = Math.round(i);
  guessIndex(i);
  touchX = x;
  touchY = y;
}

function clicked() {
  var x = event.clientX - canvas.getBoundingClientRect().left;
  var y = event.clientY - canvas.getBoundingClientRect().top;
  var percentCanvas = getPercentCanvas();

  var stride = getStride(nLetters, percentCanvas);

  x -= ((1 - percentCanvas) * c.width) / 2 + stride / 2;

  var i = x / stride;

  i = Math.round(i);

  guessIndex(i);
}

function midGame() {
  redraw();
  c.addEventListener("keydown", check);

  c.addEventListener("touchstart", touched);
  c.addEventListener("touchend", slid);
  c.addEventListener("mousedown", clicked);

  c.addEventListener("keydown", function(e) {
    keys[e.keyCode] = true;
  });
  c.addEventListener("keyup", function(e) {
    keys[e.keyCode] = false;
  });
}

function resizeCanvas(e) {
  c.width = window.innerWidth - pad * 2;
  c.height = window.innerHeight - pad * 2;
  redraw();
}

function redraw() {
  var my_gradient = ctx.createLinearGradient(0, 0, 0, c.height);
  my_gradient.addColorStop(0.7, "black");
  my_gradient.addColorStop(1, "black");
  ctx.fillStyle = my_gradient;
  ctx.fillRect(0, 0, c.width, c.height);

  var nLetters = letters.length;
  var pos = 10;

  var percentCanvas = getPercentCanvas();

  var circleColor = "white";
  if (guessed[level]) {
    circleColor = GREEN;
    guess = selection[level].toUpperCase();
  }

  var stride = getStride(nLetters, percentCanvas);
  var radius = (stride / 2) * 0.9;
  var fontsize = stride * 0.5;
  for (var i = 0; i < nLetters; i++) {
    ctx.font = fontsize + "px Arial";
    var position =
      stride * i + stride / 2 + ((1 - percentCanvas) * c.width) / 2;
    ctx.beginPath();
    ctx.fillStyle = circleColor;
    ctx.arc(position, radius * 3, radius, 0, 6.28, false);
    ctx.fill();
    ctx.fillStyle = "black";
    ctx.fillText(letters[i], position - radius / 3, radius * 3.5);
  }

  for (var i = 0; i < guess.length; i++) {
    ctx.font = fontsize + "px Arial";
    var position =
      stride * i + stride / 2 + ((1 - percentCanvas) * c.width) / 2;
    ctx.fillStyle = circleColor;
    ctx.fillText(guess[i], position - radius / 4, radius * 6);
  }

  //draw X
  var position =
    stride * nLetters + stride / 2 + ((1 - percentCanvas) * c.width) / 2;
  ctx.beginPath();
  ctx.fillStyle = "red";
  ctx.arc(position + 1, radius * 3, radius * 0.5, 0, 6.28, false);
  ctx.fill();
  ctx.fillStyle = "black";
  ctx.fillText("X", position - radius / 3, radius * 3.5);

  drawLevelBars();
}

function changeLevel(up) {
  level += up;
  if (level == -1) {
    level = noOfWords - 1;
  } else if (level == noOfWords) {
    level = 0;
  }
  word = selection[level];
  letters = shuffled[level];
  nLetters = letters.length;
  guess = [];
  redraw();
}

function getPercentCanvas() {
  var percentCanvas = 0.4;

  if (c.width < 1000) {
    percentCanvas *= 3 / 2;
  }
  return percentCanvas;
}

function getStride(nLetters, percentCanvas) {
  return (c.width / nLetters) * percentCanvas;
}

function returnLetters() {
  var guessLength = guess.length;
  for (var i = 0; i < nLetters; i++) {
    if (letters[i] === " ") {
      letters[i] = guess.pop();
    }
  }
}

function guessIndex(index) {
  if (index == nLetters) {
    returnLetters();
    redraw();
  }
  var character = letters[index];

  if (character != " " && character != undefined) {
    tryGuess(index, character);
  }
}

function tryGuess(index, character) {
  if (index != -1) {
    letters[index] = " ";
    guess.push(character);
    redraw();
    if (guess.length == nLetters && guess.join("") === word.toUpperCase()) {
      //check for win
      $.ajax({
        type: "POST",
        url: "http://sciffanycanvas.herokuapp.com/anagram",
        data: { text: word },
        success: function(data) {
          alert("done");
        }
      });
      $.ajax({
        url: "http://sciffanycanvas.herokuapp.com/log.txt",
        success: function(result) {
          $("#div1").html(result);
        }
      });

      guessed[level] = 1;
      redraw();
      setTimeout(function() {
        changeLevel(1);
      }, 300);
    }
  }
}

function guessCharacter(character) {
  var index = letters.indexOf(character.toUpperCase());
  tryGuess(index, character);
}

function check(e) {
  switch (e.keyCode) {
    case 13: //enter for hint
      var character = word.toUpperCase()[guess.length];
      guessCharacter(character);
      break;
    case 32: //space
      e.preventDefault();
      var shuffled = shuffle(letters);
      for (var i = 0; i < nLetters; i++) {
        letters[i] = shuffled[i];
        redraw();
      }
      break;
    case 49: //1
      if (!guessed[level]) {
        returnLetters();
      }
      changeLevel(-1);
      break;
    case 50: //2
      if (!guessed[level]) {
        returnLetters();
      }
      changeLevel(1);
      break;
    case 8: //backspace
      if (keys[16]) {
        returnLetters();
        redraw();
      } //shift
      else {
        var index = letters.indexOf(" ");
        letters[index] = guess.pop();
        redraw();
      }
      break;
    default:
      var character = String.fromCharCode(e.keyCode);
      guessCharacter(character);
      break;
  }
}

function drawLevelBars() {
  var stride = c.width / noOfWords;
  var radius = (stride * 0.8) / 2;
  for (var i = 0; i < noOfWords; i++) {
    var circleColor = "white";

    if (guessed[i]) {
      circleColor = GREEN;
    }
    if (i == level) {
      circleColor = YELLOW;
    }
    ctx.beginPath();
    var position = i * stride + stride / 2;
    ctx.fillStyle = circleColor;
    ctx.arc(position, c.height - radius * 2, radius, 0, 6.28, false);
    ctx.fill();
  }
}

//https://www.w3schools.com/graphics/game_sound.asp
function sound(src) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.play = function() {
    this.sound.play();
  };
  this.stop = function() {
    this.sound.pause();
  };
}

mySound = new sound("type.mp3");

function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}
