import Player from "./player.js";
import Particle from "./particle.js";
import ModuleManager from "./moduleManager.js";

const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);

var MAX_GAME_SPEED = 0.9;
var GAME_IS_STARTED = false;

const createScene = () => {
  const scene = new BABYLON.Scene(engine);
  const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
  scene.GAME_SPEED = 0.2; 
  scene.loaded = false;
  light.intensity = 0.7;

  
  return scene;
};

const createCamera = (scene, target) => {
  let camera = new BABYLON.FollowCamera("PlayerFollowCamera", target.position, scene, target);

  camera.radius = 20; // how far from the object to follow
  camera.heightOffset = 9; // how high above the object to place the camera
  camera.rotationOffset = 180; // the viewing angle
  camera.cameraAcceleration = 0.2; // how fast to move
  camera.maxCameraSpeed = 2; // speed limit

  return camera;
}

const moveScene = (speed) => {
  scene.meshes.forEach((mesh) => {

    if (mesh.name !== "Player" && mesh.name !== "__root__" && mesh.name !== "PlayerBox") {
      mesh.position.z -= speed;    
    }
  });
};


// Créez la scence
const scene = createScene();

// Créez le joueur
const player = new Player(scene);
player.mesh = await player.createPlayerMesh();

player.animations[0].stop();
player.animations[2].play(true);

// Créez la caméra
const camera = createCamera(scene, player.mesh);

// Créez les particules
const particle = new Particle(scene, player);

// Créez le gestionnaire de module
const moduleManager = new ModuleManager(scene, player, particle);

var s = "20 KM/H"

//Fonction qui augmente la vitesse du jeu mais aussi des particules
const increaseGameSpeed = () => {
  if (scene.GAME_SPEED < MAX_GAME_SPEED) {
    var s2 = Math.round(scene.GAME_SPEED * 100) + " KM/H"
    if (s2 != s) {
      console.log(s2)
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

//Fonction qui démarre le jeu. On passe de l'animation de départ à l'animation de course
const startGame = () => {
  GAME_IS_STARTED = true;
  player.animations[2].stop();
  player.animations[8].play(true);
  
  
} 

moduleManager.setup()
moduleManager.loadModule("module1.json");

// if (!scene.loaded){
//   console.log("boucle for");
//   // On charge le premier module
//   for (let i = 0; i < 3; i++) {
//     moduleManager.loadModule("module1.json", true);
//   }
//   scene.loaded = true;
// }

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
      moduleManager.loadNextModule();
      //removeCurrentModule();
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

