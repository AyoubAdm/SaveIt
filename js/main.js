import Player from "./player.js";
import Particle from "./particle.js";

const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);

const moduleList = ["module1.json"]; // Ajoutez autant de modules que vous le souhaitez
let currentModuleIndex = 0;
var MAX_GAME_SPEED = 1;
var GAME_IS_STARTED = false;


const createScene = () => {
  const scene = new BABYLON.Scene(engine);
  const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
  scene.GAME_SPEED = 0.2;
  light.intensity = 0.7;
  return scene;
};

const createCamera = (scene, target) => {
  let camera = new BABYLON.FollowCamera("PlayerFollowCamera", target.position, scene, target);

  camera.radius = 10; // how far from the object to follow
  camera.heightOffset = 7; // how high above the object to place the camera
  camera.rotationOffset = 180; // the viewing angle
  camera.cameraAcceleration = 0.2; // how fast to move
  camera.maxCameraSpeed = 2; // speed limit

  return camera;
}


function randomXPosition() {
  const positions = [-3, 0, 3];
  const index = Math.floor(Math.random() * positions.length);
  return positions[index];
}


const loadModule = async (moduleName) => {
  const response = await fetch(moduleName);
  const moduleData = await response.json();

  // Ajoutez d'autres logiques nécessaires pour positionner et connecter les modules
  const exitPointData = moduleData.exitPoint;
  const exitPoint = new BABYLON.MeshBuilder.CreateBox("exitPoint", { size: 1 }, scene);
  exitPoint.isVisible = false; // Rendez le mesh invisible
  exitPoint.position = new BABYLON.Vector3(exitPointData.x, exitPointData.y, exitPointData.z);
  var decalage = exitPointData.z;

  // Créez la géométrie de base à partir des données JSON
  moduleData.geometry.forEach((geomData) => {
    if (geomData.type === "box") {
      const box = BABYLON.MeshBuilder.CreateBox(
        "box",
        { width: geomData.size.width, height: geomData.size.height, depth: geomData.size.depth },
        scene
      );
      box.position = new BABYLON.Vector3(geomData.position.x, geomData.position.y, geomData.position.z + decalage);

    }
  });


  // Créez les objets déchets à partir des données JSON
  moduleData.wasteSpawns.forEach((wasteData) => {
    const waste = createWaste(wasteData.type); // Fonction pour créer un objet déchet en fonction du type
    waste.position = new BABYLON.Vector3(randomXPosition(), wasteData.position.y, wasteData.position.z + decalage);
    addCollisionDetection(waste);
  });

  // Créez les objets poubelles à partir des données JSON
  moduleData.binSpawns.forEach((binData) => {
    const bin = createBin(binData.type); // Fonction pour créer un objet poubelle en fonction du type
    bin.position = new BABYLON.Vector3(randomXPosition(), binData.position.y, binData.position.z + decalage);
    addCollisionDetection(bin);
  });


};

const removeCurrentModule = () => {
  let bin = scene.getMeshByName("bin");
  let waste = scene.getMeshByName("waste");
  let box = scene.getMeshByName("box");
  setTimeout(() => {
    bin.dispose();
    waste.dispose();
    box.dispose();
  }, 1800);
}

const loadNextModule = async () => {
  scene.getMeshByName("exitPoint").dispose();
  const nextModuleIndex = (currentModuleIndex + 1) % moduleList.length;
  await loadModule(moduleList[nextModuleIndex]);
  currentModuleIndex = nextModuleIndex;
};




const moveScene = (speed) => {
  scene.meshes.forEach((mesh) => {
    if (mesh.name !== "Player" && mesh.name !== "__root__" && mesh.name !== "PlayerBox") {
      mesh.position.z -= speed;
    }
    else {
    }


  });
};



const createWaste = (type) => {
  const waste = BABYLON.MeshBuilder.CreateBox("waste", { width: 1, height: 1, depth: 1 }, scene);
  waste.material = new BABYLON.StandardMaterial("wasteMaterial", scene);
  waste.material.diffuseColor = new BABYLON.Color3(0, 1, 0); // Vert pour les déchets
  return waste;
};

const createBin = (type) => {
  const bin = BABYLON.MeshBuilder.CreateBox("bin", { width: 2, height: 2, depth: 2 }, scene);
  bin.material = new BABYLON.StandardMaterial("binMaterial", scene);
  bin.material.diffuseColor = new BABYLON.Color3(0, 0, 1); // Bleu pour les poubelles
  return bin;
};


const addCollisionDetection = (mesh) => {
  const actionManager = new BABYLON.ActionManager(scene);
  actionManager.registerAction(
    new BABYLON.ExecuteCodeAction(
      {
        trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
        parameter: { mesh: player.playerBox },
      },
      (evt) => {
        onPlayerCollision(player, evt.source);
      }
    )
  );
  mesh.actionManager = actionManager;
};

const onPlayerCollision = (player, obj) => {
  // Gérez ici la logique de collision entre le joueur et l'objet
  if (obj.name === "waste") {
    obj.dispose();
  }
  else if (obj.name === "bin") {
    if (player.isInvincible) return;
    scene.GAME_SPEED = 0;
    player.isAlive = false;
    particle.particleSystem.stop();
    player.animations[8].stop()
    player.animations[1].play();
  }

};





// Créez la scence
const scene = createScene();

// Créez le joueur
const player = new Player(scene);
player.mesh = await player.createPlayerMesh();
player.animations[0].stop();
player.animations[2].play(true);
console.log(player);

// Créez la caméra
const camera = createCamera(scene, player.mesh);

// Créez les particules
const particle = new Particle(scene, player);

// Créez la caméra

var s = "20 KM/H"
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
      particle.particleSystem.emitRate = 2*Math.exp(2*scene.GAME_SPEED);
      particle.particleSystem.minScaleY = scene.GAME_SPEED*100;
      particle.particleSystem.maxScaleY = scene.GAME_SPEED*100;
    }
    
  }
}

const startGame = () => {
  GAME_IS_STARTED = true;
  player.animations[2].stop();
  player.animations[8].play(true);
}

// Chargez et créez un module à partir du fichier JSON
loadModule("module1.json");

engine.runRenderLoop(() => {
  if (player.animations.length === 0) return;
  if (GAME_IS_STARTED) {
    if (player.isAlive) {
      increaseGameSpeed();
    }
    moveScene(scene.GAME_SPEED);
    const exitPoint = scene.getMeshByName("exitPoint");
    if (exitPoint && player.mesh.position.z > exitPoint.position.z - 5) {
      loadNextModule();
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
});

