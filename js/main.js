const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);

const moduleList = ["module1.json"]; // Ajoutez autant de modules que vous le souhaitez
let currentModuleIndex = 0;
var GAME_SPEED = 0.2;
var MAX_GAME_SPEED = 0.7;


const createScene = () => {
  const scene = new BABYLON.Scene(engine);
  const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
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

const loadNextModule = async () => {
  scene.getMeshByName("exitPoint").dispose();
  const nextModuleIndex = (currentModuleIndex + 1) % moduleList.length;
  await loadModule(moduleList[nextModuleIndex]);
  currentModuleIndex = nextModuleIndex;
};




const createPlayer = () => {
  const player = BABYLON.MeshBuilder.CreateBox("player", { width: 1, height: 2, depth: 1 }, scene);
  player.position = new BABYLON.Vector3(0, 1, 0);
  player.material = new BABYLON.StandardMaterial("playerMaterial", scene);
  player.material.diffuseColor = new BABYLON.Color3(1, 0, 0);
  player.isAnimating = false;
  player.isAlive = true;  
  player.isInvincible = false;
  return player;
};

const moveScene = (speed) => {
  scene.meshes.forEach((mesh) => {
    if (mesh !== player && mesh !== camera) {
      mesh.position.z -= speed;
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

const movePlayer = (direction) => {
  if (player.isAnimating || !player.isAlive) {
    return;
  }


  const targetX = player.position.x + direction;

  // Limitez les déplacements du joueur pour qu'il reste sur la plateforme
  if (targetX >= -4 && targetX <= 4) {
    player.isAnimating = true;
    animatePlayer(targetX);
  }
  else {
    bounceAnimation(direction);
  }
};

const addCollisionDetection = (mesh) => {
  const actionManager = new BABYLON.ActionManager(scene);
  actionManager.registerAction(
    new BABYLON.ExecuteCodeAction(
      {
        trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
        parameter: { mesh: player },
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
    obj.dispose();}
  else if (obj.name === "bin") {
    if (player.isInvincible) return;
    GAME_SPEED = 0;
    player.isAlive = false;
  }
  
};



const animatePlayer = (targetX) => {
  const anim = new BABYLON.Animation(
    "playerMove",
    "position.x",
    30,
    BABYLON.Animation.ANIMATIONTYPE_FLOAT,
    BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
  );

  const easingFunction = new BABYLON.QuadraticEase();
  easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
  anim.setEasingFunction(easingFunction);

  const keys = [
    { frame: 0, value: player.position.x },
    { frame: 8/(GAME_SPEED*5), value: targetX }
  ];

  anim.setKeys(keys);

  player.animations = [anim];
  player.isAnimating = true;
  player.isInvincible = true;
  scene.beginAnimation(player, 0, 30, false).onAnimationEnd = () => {
    player.isAnimating = false;
    player.isInvincible = false;
  };
};

const bounceAnimation = (direction) => {
  if (player.isAnimating) {
    return;
  }

  const startPosition = player.position.clone();
  const targetPosition = player.position.add(new BABYLON.Vector3(direction * 0.2, 0, 0));
  const returnPosition = startPosition.clone();

  // Animer la position du joueur vers la nouvelle position
  const animation1 = new BABYLON.Animation(
    "animation1",
    "position",
    30,
    BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
    BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
  );

  const keys1 = [
    { frame: 0, value: startPosition },
    { frame: 20, value: targetPosition },
  ];

  animation1.setKeys(keys1);
  player.animations.push(animation1);

  // Animer la position du joueur de retour à sa position d'origine
  const animation2 = new BABYLON.Animation(
    "animation2",
    "position",
    30,
    BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
    BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
  );

  const keys2 = [
    { frame: 0, value: targetPosition },
    { frame: 8, value: returnPosition },
  ];

  animation2.setKeys(keys2);
  player.animations.push(animation2);

  // Lancer l'animation
  player.isAnimating = true;
  scene.beginAnimation(player, 0, 10, false, 1, () => {
    player.isAnimating = false;
  });


};




// Créez la scence
const scene = createScene();

// Créez le joueur
const player = createPlayer();

// Créez la caméra
const camera = createCamera(scene, player);

var s = "20 KM/H"
const increaseGameSpeed = () => {
  if (GAME_SPEED < MAX_GAME_SPEED) {
    var s2 = Math.round(GAME_SPEED*100) + " KM/H"
    if (s2 != s){
      console.log(s2)
      s = s2;}
    GAME_SPEED += 0.0001;
  }
}


// Chargez et créez un module à partir du fichier JSON
loadModule("module1.json");
engine.runRenderLoop(() => {

  if(player.isAlive){
    increaseGameSpeed();
  }
  moveScene(GAME_SPEED);
  const exitPoint = scene.getMeshByName("exitPoint");
  if (exitPoint && player.position.z > exitPoint.position.z - 5) {
    loadNextModule();
  }

  scene.render();
});


window.addEventListener("resize", () => {
  engine.resize();
});

window.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "ArrowLeft":
      movePlayer(-3); // Déplacez le joueur vers la gauche
      break;
    case "ArrowRight":
      movePlayer(3); // Déplacez le joueur vers la droite
      break;
  }
});

