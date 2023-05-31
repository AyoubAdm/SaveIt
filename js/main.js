import Player from "./player.js";
import Particle from "./particle.js";
import ModuleManager from "./moduleManager.js";
import { setupMenuScreen, updateLoadingScreenVisibility } from "./menuScreen.js";


// Créez une nouvelle instance Audio pour la musique du menu
const menuMusic = new Audio();
menuMusic.src = 'sounds/menu.wav'; 
menuMusic.loop = true;

// Créez une nouvelle instance Audio pour la musique du jeu
const gameMusic = new Audio();
gameMusic.src = 'sounds/game.wav';
gameMusic.loop = true;



const initGame = async (graphicsQuality, gameMode) => {

  const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);

var MAX_GAME_SPEED = 1.2;
var GAME_IS_STARTED = false;
const createScene = () => {
  updateLoadingScreenVisibility(true);
  const scene = new BABYLON.Scene(engine);
  const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
  scene.GAME_SPEED = 0.2; 
  scene.loaded = false;
  light.intensity = 0.8;
  
  
  return scene;
};


const disposeGame = () => {
  // Arrêtez le moteur de rendu
  engine.stopRenderLoop();

  // Nettoyez les objets liés à la scène
  scene.dispose();
};


// Fonction qui pause le jeu
const pauseGame = () => 
{
  if (GAME_IS_STARTED) {
    menuMusic.pause();
    if (player.isAlive) {
      if (scene.isPaused) {
        scene.isPaused = false;
        player.animations[8].play(true);
        //remove pause menu
        const pauseMenu = document.getElementById("pauseMenu");
        document.body.removeChild(pauseMenu);

      } else {
        scene.isPaused = true;
        GAME_IS_STARTED = false;
        player.animations[8].stop();
        player.animations[8].play(false);
        //show pause menu
        const pauseMenu = document.createElement("div");
        pauseMenu.id = "pauseMenu";
        pauseMenu.style.width = "100%";
        pauseMenu.style.height = "100%";
        pauseMenu.style.position = "absolute";
        pauseMenu.style.top = "0";
        pauseMenu.style.left = "0";
        pauseMenu.style.zIndex = "100";
        pauseMenu.style.backgroundColor = "rgba(0,0,0,0.5)";
        pauseMenu.style.display = "flex";
        pauseMenu.style.justifyContent = "center";
        pauseMenu.style.alignItems = "center";
        pauseMenu.style.flexDirection = "column";

        //create main menu title
        const newDiv = document.createElement("div");
        newDiv.className = "container";

        newDiv.innerHTML = `
        <svg viewBox="0 0 960 300">
          <symbol id="s-text">
            <text text-anchor="middle" x="50%" y="80%">SAVE IT</text>
          </symbol>
          <g class="g-ants">
            <use xlink:href="#s-text" class="text-copy"></use>
            <use xlink:href="#s-text" class="text-copy"></use>
            <use xlink:href="#s-text" class="text-copy"></use>
            <use xlink:href="#s-text" class="text-copy"></use>
            <use xlink:href="#s-text" class="text-copy"></use>
          </g>
        </svg>
        `;


        //create main menu button
        const pauseButton = document.createElement("button");
        pauseButton.id = "pauseButtonPlay";
  
        pauseButton.innerHTML = "Continue";
   
        pauseButton.onclick = function() {
          document.body.removeChild(pauseMenu);
          pauseGame();
        }

        //create main menu button restart
        const pauseButtonRestart = document.createElement("button");
        pauseButtonRestart.id = "pauseButtonRestart";
        pauseButtonRestart.innerHTML = "Restart";
        pauseButtonRestart.onclick = function() {
          document.body.removeChild(pauseMenu);
          document.getElementById("wasteScore").innerHTML = "Collected waste : 0" ;
          disposeGame();
          initGame(graphicsQuality, gameMode);
        }

        //create main menu button quit
        const pauseButtonQuit = document.createElement("button");
        pauseButtonQuit.id = "pauseButtonQuit";
        pauseButtonQuit.innerHTML = "Quit Game";
        pauseButtonQuit.onclick = function() {
          window.location.href = "index.html";
        }

        //add title and button to the container
        pauseMenu.appendChild(newDiv);
        pauseMenu.appendChild(pauseButton);
        pauseMenu.appendChild(pauseButtonRestart);
        pauseMenu.appendChild(pauseButtonQuit);

        //add container to the body
        document.body.appendChild(pauseMenu);
        
      }
    }
  }
}

// Fonction qui affiche message de victoire
const win = () => {
  scene.isPaused = true;
  GAME_IS_STARTED = false;
  player.animations[8].stop();
  player.animations[8].play(false);
  // Create the win menu
  const winMenu = document.createElement("div");
  winMenu.id = "winMenu";
  winMenu.style.width = "100%";
  winMenu.style.height = "100%";
  winMenu.style.position = "absolute";
  winMenu.style.top = "0";
  winMenu.style.left = "0";
  winMenu.style.zIndex = "100";
  winMenu.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  winMenu.style.display = "flex";
  winMenu.style.justifyContent = "center";
  winMenu.style.alignItems = "center";
  winMenu.style.flexDirection = "column";

  

  // Create the "You win!" text
  const winText = document.createElement("h1");
  winText.textContent = "Level completed";
  winText.style.color = "white";

  // Create the "Back to Menu" button
  const backButton = document.createElement("button");
  backButton.textContent = "Back to Menu";
  backButton.onclick = function() {
    document.body.removeChild(winMenu);
    window.location.href = "index.html";
  };

  // Add the elements to the win menu
  winMenu.appendChild(winText);
  winMenu.appendChild(backButton);

  // Add the win menu to the body
  document.body.appendChild(winMenu);
};


const createCamera = (scene, target) => {
  let camera = new BABYLON.FollowCamera("PlayerFollowCamera", target.position, scene, target);

  camera.radius = 13; // how far from the object to follow
  camera.heightOffset = 7; // how high above the object to place the camera
  camera.rotationOffset = 180; // the viewing angle
  camera.cameraAcceleration = 0.2; // how fast to move
  camera.maxCameraSpeed = 2; // speed limit

  return camera;
}

const moveScene = (speed) => {
  scene.meshes.forEach((mesh) => {
    if (mesh.name==="drumBoundingBox"){mesh.position.z -= speed;}
    else if (mesh.name !== "Player" && mesh.name !== "__root__" && mesh.name !== "PlayerBox" && mesh.name!=="Drum") {
      mesh.position.z -= speed; 
    }
  });
};


// Créez la scence
const scene = createScene();

//activer l'animation de départ


// Créez le joueur
const player = new Player(scene);
player.mesh = await player.createPlayerMesh();
// Arrêter la musique du menu
menuMusic.pause();
menuMusic.currentTime = 0;  // Remettre la musique à zéro

// Commencer la musique du jeu
gameMusic.play();


player.animations[0].stop();
player.animations[2].play(true);

// Créez la caméra
const camera = createCamera(scene, player.mesh);

// Créez les particules
const particle = new Particle(scene, player);

// Créez le gestionnaire de module
const moduleManager = new ModuleManager(scene, player, particle,engine);

var s = Math.round(scene.GAME_SPEED * 100) + " KM/H"
document.getElementById("speed").innerHTML = "Speed : " + s;

//Fonction qui augmente la vitesse du jeu mais aussi des particules
const increaseGameSpeed = () => {
  document.getElementById("speed")
  if (scene.GAME_SPEED < MAX_GAME_SPEED) {
    var s2 = Math.round(scene.GAME_SPEED * 100) + " KM/H"
    if (s2 != s) {
      document.getElementById("speed").innerHTML = "Speed : " + s2;
      s = s2;
    }
    scene.GAME_SPEED += 0.0001;

    //les particules
    if(scene.GAME_SPEED > 0.24){
      particle.particleSystem.start();
      particle.particleSystem.minEmitPower = 2*Math.exp(3*scene.GAME_SPEED);
      particle.particleSystem.maxEmitPower = 2*Math.exp(3*scene.GAME_SPEED);
      particle.particleSystem.emitRate = 4*Math.exp(2*scene.GAME_SPEED);
      particle.particleSystem.minScaleY = (scene.GAME_SPEED)*50;
      particle.particleSystem.maxScaleY = (scene.GAME_SPEED)*50;
    }
    
  }
}






window.addEventListener("resize", () => {
  engine.resize();
});


//Fonction qui démarre le jeu. On passe de l'animation de départ à l'animation de course
const startGame = () => {
    
  GAME_IS_STARTED = true;
  player.animations[2].stop();
  player.animations[8].play(true);
  
 
  
} 

if (gameMode == "endless") {

  moduleManager.setup()
  await moduleManager.loadModule("module1.json", graphicsQuality);
}
else if (gameMode == "level1") {
  await moduleManager.loadModule("level1.json", graphicsQuality);
}
else if (gameMode == "level2") {
  scene.GAME_SPEED = 0.25;
  await moduleManager.loadModule("level2.json", graphicsQuality);
}
else if (gameMode == "level3") {
  scene.GAME_SPEED = 0.3;
  await moduleManager.loadModule("level3.json", graphicsQuality);
}
updateLoadingScreenVisibility(false);





engine.runRenderLoop(() => {
  // Si le jeu est démarré et tant que le joueur est en vie, on augmente la vitesse du jeu
  if (GAME_IS_STARTED) {

    if (player.isAlive) {
      increaseGameSpeed();
      moveScene(scene.GAME_SPEED);
    }

    // On récupère le point de sortie
    const exitPoint = scene.getMeshByName("exitPoint");
    // Si le joueur a atteint le point de sortie, on charge le module suivant
    if (exitPoint && player.mesh.position.z > exitPoint.position.z ) {
      if(gameMode == "endless"){
        moduleManager.loadNextModule(graphicsQuality);
    }
    else if(gameMode.includes("level")){
      win();
    }

  }
}
  scene.render();
});


window.addEventListener("resize", () => {
  engine.resize();
});

window.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "ArrowLeft":
      player.movePlayer(-3); // Déplacez le joueur vers la gauche
      particle.particleSystem.move(-3);
      break;
    case "ArrowRight":
      player.movePlayer(3); // Déplacez le joueur vers la droite

      particle.particleSystem.move(3);
      break;
  
    case " ":
      if (GAME_IS_STARTED) return;
      startGame();
      break;

      case "p":
        pauseGame(); // Mettez le jeu en pause
        break;
  }



  window.addEventListener("keyup", (event) => {
    switch (event.key) {
      case "ArrowLeft":
      case "ArrowRight":
        player.releaseKey(); //le joueur peut se déplacer à nouveau
        break;
    }
  });
  


});

}


document.addEventListener('DOMContentLoaded', () => {
  setupMenuScreen();

  let isMusicPlaying = false;
  let isMusicMuted = false;
  menuMusic.volume = 0.5;
  gameMusic.volume = 0.3;

  const musicButton = document.getElementById("musicButton");
  const volumeSlider = document.getElementById("volumeSlider");
  musicButton.addEventListener("click", () => {
      volumeSlider.style.display = "block"; 
      if (!isMusicPlaying) {
          menuMusic.play();
          isMusicPlaying = true;
          isMusicMuted = false;
          musicButton.innerHTML = '<i class="fa-sharp fa-solid fa-volume-high"></i>';
      } else {
          if (isMusicMuted) {
              menuMusic.muted = false;
              gameMusic.muted = false;
              isMusicMuted = false;
              musicButton.innerHTML = '<i class="fa-sharp fa-solid fa-volume-high"></i>';
          } else {
              menuMusic.muted = true;
              gameMusic.muted = true;
              isMusicMuted = true;
              musicButton.innerHTML = '<i class="fas fa-volume-mute"></i>';
          }
      }
  });

  volumeSlider.addEventListener("input", () => {
      let volume = volumeSlider.value;
      menuMusic.volume = volume;
      gameMusic.volume = volume;
  });
});




//Recupere l'evenement startGame et lance le jeu en mode endless
document.addEventListener('startEndlessMode', (event) => {
  const graphics = event.detail.graphics;
  initGame(graphics, "endless");
  
});

//Recupere l'evenement startGame et lance le jeu en mode level1
document.addEventListener('startLevel1', (event) => {
  const graphics = event.detail.graphics;
  initGame(graphics, "level1");
});
//Recupere l'evenement startGame et lance le jeu en mode level2
document.addEventListener('startLevel2', (event) => {
  const graphics = event.detail.graphics;
  initGame(graphics, "level2");
});
//Recupere l'evenement startGame et lance le jeu en mode level3
document.addEventListener('startLevel3', (event) => {
  const graphics = event.detail.graphics;
  initGame(graphics, "level3");
});







