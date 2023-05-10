class ModuleManager {
  constructor(scene, player, particle, engine) {
    this.scene = scene;
    this.player = player;
    this.engine = engine;
    this.particle = particle;
    this.loadTreeModel();
    this.graphicsQuality;
    this.treeInstances = [];
    this.wasteInstances = [];
    this.obstacleInstances = [];
    this.platforms = [];
    this.grounds = [];
    this.boundingBoxes = [];
    this.lastGroundZ = 0;
    this.platformCount = 0;
  }
  async loadTreeModel() {
    const result = await BABYLON.SceneLoader.ImportMeshAsync(
      "",
      "models/",
      "tree.babylon",
      this.scene
    );
    this.treeModel = result.meshes[0];
    this.treeModel.setEnabled(false); // rendre le modèle original invisible
  }

  createTree() {
    if (!this.treeModel) {
      console.error("Le modèle d'arbre n'a pas été chargé");
      return;
    }

    // crée une nouvelle instance de l'arbre
    const treeInstance = this.treeModel.createInstance("treeInstance");

    return treeInstance;
  }
  removeTreesBehindPlayer() {
    this.treeInstances = this.treeInstances.filter((tree) => {
      if (tree.position.z < -10) {
        tree.dispose(); // Supprime l'arbre de la scène
        return false;
      } else {
        return true;
      }
    });
  }

  removeWastesBehindPlayer() {
    this.wasteInstances = this.wasteInstances.filter((waste) => {
      if (waste.position.z < -10) {
        waste.dispose();
        return false;
      } else {
        return true;
      }
    });
  }

  removeObstaclesBehindPlayer() {
    this.obstacleInstances = this.obstacleInstances.filter((obstacle) => {
      if (obstacle.position.z < -10) {
        obstacle.dispose();
        return false;
      } else {
        return true;
      }
    });
  }

  removeGroundsBehindPlayer() {
    this.grounds = this.grounds.filter((ground) => {
      if (ground.position.z < -200) {
        ground.dispose();
        return false;
      }
      return true;
    });
  }

  removePlatformsBehindPlayer() {
    this.platforms = this.platforms.filter((platform) => {
      if (platform.position.z < -60) {
        platform.dispose();
        return false;
      }
      return true;
    });
  }

  removeBoundingBoxesBehindPlayer() {
    this.boundingBoxes = this.boundingBoxes.filter((boundingBox) => {
      if (boundingBox.position.z < -5) {
        boundingBox.dispose();
        return false;
      }
      return true;
    });
  }

  moduleList = ["module1.json"]; //Les modules à charger
  currentModuleIndex = 0;
  number = 1;
  score = 0;


  wasteTypes = ["plasticBottle.png", "banana.png"];


  getScore() {
    return this.score;
  }

  setup() {
    const box = BABYLON.MeshBuilder.CreateBox(
      "box",
      { width: 10, height: 1, depth: 40 },
      this.scene
    );
    box.position = new BABYLON.Vector3(0, 0, 5);
    box.material = new BABYLON.StandardMaterial("boxMaterial", this.scene);
    box.material.diffuseTexture = new BABYLON.Texture(
      "textures/sol.jpg",
      this.scene
    );
    box.material.diffuseTexture.uScale = 5;
    box.material.diffuseTexture.vScale = 1;
    box.material.diffuseTexture.wAng = Math.PI / 2;
    setInterval(() => {
      this.removeTreesBehindPlayer();
      this.removeWastesBehindPlayer();
      this.removeObstaclesBehindPlayer();
      this.removeGroundsBehindPlayer();
      this.removePlatformsBehindPlayer();
    }, 2500);

    setInterval(() => {
      this.removeBoundingBoxesBehindPlayer();
    }
      , 300);
  }

  async loadModule(moduleName, graphicsQuality) {
    this.graphicsQuality = graphicsQuality;
    const response = await fetch(moduleName);
    const moduleData = await response.json();

    //Le point de sortie du module. On creer un mesh invisible pour verifier si on a atteint le point de sortie du module
    const exitPointData = moduleData.exitPoint;
    const exitPoint = new BABYLON.MeshBuilder.CreateBox(
      "exitPoint",
      { size: 1 },
      this.scene
    );
    exitPoint.isVisible = false;
    exitPoint.position = new BABYLON.Vector3(
      exitPointData.x,
      exitPointData.y,
      20
    );

    // Décalage entre les modules. Plus c'est grand, plus les modules sont placer loin les uns des autres (et donc on ne les voit pas apparaitre)

    //La génération du module à partir des données JSON
    this.createGround();
    moduleData.geometry.forEach((geomData) => {
      //le box est le sol du module
      if (geomData.type === "box") {
        const box = BABYLON.MeshBuilder.CreateBox(
          "box",
          {
            width: geomData.size.width,
            height: geomData.size.height,
            depth: 90,
          },
          this.scene
        );
        this.platforms.push(box);
        box.position = new BABYLON.Vector3(
          geomData.position.x,
          0,
          this.scene.GAME_SPEED < 0.3 ? this.number * 69.8 : this.number * 69
        );
        box.material = new BABYLON.StandardMaterial("boxMaterial", this.scene);

        if (this.platformCount > 5) {
          box.material.diffuseTexture = new BABYLON.Texture(
            "textures/sol2.jpg",
            this.scene
          );
        } else {
          box.material.diffuseTexture = new BABYLON.Texture(
            "textures/sol.jpg",
            this.scene
          );
          //retate texture
          box.material.diffuseTexture.wAng = Math.PI / 2;
        }

        //scale texture
        box.material.diffuseTexture.uScale = 5;
        box.material.diffuseTexture.vScale = 1;
      }
    });
    this.platformCount++;


    this.number++;

    // Créez les objets déchets à partir des données JSON
    moduleData.wasteSpawns.forEach((wasteData) => {
      var item =
        this.wasteTypes[Math.floor(Math.random() * this.wasteTypes.length)];
      const waste = this.createWaste(item); // Fonction pour créer un objet déchet en fonction du type
      waste.position = new BABYLON.Vector3(
        this.randomXPosition(),
        1.3,
        wasteData.position.z * this.number
      );
      this.wasteInstances.push(waste);
      this.addCollisionDetection(waste);
    });

    // Créez les objets poubelles à partir des données JSON
    moduleData.binSpawns.forEach((binData) => {
      const bin = this.createBin(binData.type); // Fonction pour créer un objet poubelle en fonction du type
      bin.position = new BABYLON.Vector3(
        this.randomXPosition(),
        binData.position.y,
        binData.position.z * this.number
      );
      this.obstacleInstances.push(bin);
      this.addCollisionDetection(bin);
      if (graphicsQuality === "high") {
        BABYLON.SceneLoader.ImportMesh(
          "",
          "models/",
          "Drum.glb",
          this.scene,
          (newMeshes, particleSystems, skeletons, animationGroups) => {
            // Créez un conteneur pour le modèle Drum
            let drum = new BABYLON.Mesh("Drum", this.scene);

            // Attribuez le mesh importé au conteneur créé
            let importedDrum = newMeshes[0];
            importedDrum.parent = drum;

            // Donnez un nom aux meshs importés
            newMeshes.forEach((mesh) => {
              mesh.name = "Drum";
            });

            // Créez une boîte de collision pour le modèle Drum
            const boundingBox = BABYLON.MeshBuilder.CreateBox(
              "drumBoundingBox",
              { width: 1, height: 1, depth: 1 },
              this.scene
            );
            boundingBox.position = new BABYLON.Vector3(
              bin.position.x,
              bin.position.y,
              bin.position.z
            );
            boundingBox.isVisible = false;
            boundingBox.checkCollisions = true;
            this.boundingBoxes.push(boundingBox);
            // Attribuez la boîte de collision au modèle Drum
            drum.parent = boundingBox;

            // Positionnez le modèle Drum à la position souhaitée par rapport à la boîte de collision
            drum.position = new BABYLON.Vector3(0, 0, 0);

            drum.scaling = new BABYLON.Vector3(1, 0.6, 1);

          }
        );
      }
    });

    // Créez les objets arbres à partir des données JSON
    moduleData.treeSpawns.forEach((treeData) => {
      let treeNumber = graphicsQuality === "high" ? 8 : graphicsQuality === "medium" ? 4 : 0;
      // Afficher 10 arbres à gauche de la route placés aléatoirement et espacés de 10 et pas trop proche de la route
      for (let i = 0; i < treeNumber; i++) {
        const tree = this.createTree(); // Fonction pour créer un objet arbre
        tree.position = new BABYLON.Vector3(
          // L'arbre doit être entre -3 et 3
          Math.floor(Math.random() * -15) - 5,
          treeData.position.y,
          // Espacement entre les arbres
          treeData.position.z * this.number + i * 10
        );
        this.treeInstances.push(tree);

        // Afficher 10 arbres à droite de la route placés aléatoirement et espacés de 10 et pas trop proche de la route
        const tree2 = this.createTree(); // Fonction pour créer un objet arbre
        tree2.position = new BABYLON.Vector3(
          // L'arbre doit être entre -3 et 3
          Math.floor(Math.random() * 15) + 5,
          treeData.position.y,
          // Espacement entre les arbres
          treeData.position.z * this.number + i * 10
        );
        this.treeInstances.push(tree2);
      }
    });
  }

  //Pour que la position X des dechets et obstacle soit aléatoire
  randomXPosition() {
    const positions = [-3, 0, 3];
    const index = Math.floor(Math.random() * positions.length);
    return positions[index];
  }

  gameOver = (graphicsQuality) => {
       
    //show game over menu
    const gameOverMenu = document.createElement("div");
    gameOverMenu.id = "gameOverMenu";
    gameOverMenu.style.width = "100%";
    gameOverMenu.style.height = "100%";
    gameOverMenu.style.position = "absolute";
    gameOverMenu.style.top = "0";
    gameOverMenu.style.left = "0";
    gameOverMenu.style.zIndex = "100";
    gameOverMenu.style.backgroundColor = "rgba(0,0,0,0.5)";
    gameOverMenu.style.display = "flex";
    gameOverMenu.style.justifyContent = "center";
    gameOverMenu.style.alignItems = "center";
    gameOverMenu.style.flexDirection = "column";
    //add container to the body
    document.body.appendChild(gameOverMenu);
    //create main menu title
    const newDiv = document.createElement("div");
    newDiv.className = "container";
    newDiv.innerHTML = `
    <svg viewBox="0 0 960 300">

      <symbol id="s-text">
        <text text-anchor="middle" x="50%" y="80%">GAME OVER</text>
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
    const gameOverButton = document.createElement("button");
    gameOverButton.id = "gameOverButton";
    gameOverButton.innerHTML = "Try again";
    gameOverButton.onclick = function() {
      document.body.removeChild(gameOverMenu);
      const restartEndlessModeEvent = new CustomEvent('restartEndlessMode', {
        detail: {
          graphics: graphicsQuality,
        }
      })
      document.dispatchEvent(restartEndlessModeEvent);
    }

    //ajouter le score
    const score = document.createElement("div");
    score.id = "score";
    score.innerHTML = "Score : " + this.score;
    

    //create main menu button quit
    const gameOverButtonQuit = document.createElement("button");
    gameOverButtonQuit.id = "gameOverButtonQuit";
    gameOverButtonQuit.innerHTML = "Quit Game";
    gameOverButtonQuit.onclick = function() {
      window.location.href = "index.html";
    }

    //add title and button to the container
    gameOverMenu.appendChild(newDiv);
    gameOverMenu.appendChild(score);
    gameOverMenu.appendChild(gameOverButton);
    gameOverMenu.appendChild(gameOverButtonQuit);
  }

  //Pour charger le prochain module
  async loadNextModule(graphicsQuality) {
    //On supprime le point de sortie du module précédent car on l'a déjà atteint.
    this.scene.getMeshByName("exitPoint").dispose();
    const nextModuleIndex =
      (this.currentModuleIndex + 1) % this.moduleList.length;
    await this.loadModule(this.moduleList[nextModuleIndex], graphicsQuality);
    this.currentModuleIndex = nextModuleIndex;
  }

  //Fonction pour créer les déchets
  createWaste(type) {
    const wasteMaterial = new BABYLON.StandardMaterial(
      "wasteMaterial",
      this.scene
    );
    wasteMaterial.diffuseTexture = new BABYLON.Texture(
      `textures/${type}`,
      this.scene
    );
    wasteMaterial.diffuseTexture.hasAlpha = true;
    wasteMaterial.backFaceCulling = false;

    //le tableau des faces du cube
    var faceUV = new Array(6);

    //On met toute les faces à 0 pour que le cube soit transparent
    for (var i = 0; i < 6; i++) {
      faceUV[i] = new BABYLON.Vector4(0, 0, 0, 0);
    }

    //On met la texture sur la face avant du cube uniquement
    faceUV[1] = new BABYLON.Vector4(0, 0, 1, 1);

    //On crée le cube
    const waste = BABYLON.MeshBuilder.CreateBox(
      "waste",
      { width: 2, height: 2, depth: 1, faceUV: faceUV },
      this.scene
    );
    waste.material = wasteMaterial;

    //Pour rendre le déchet plus lumineux
    wasteMaterial.emissiveColor = new BABYLON.Color3(1, 1, 1);

    //cree une animation rotation rapide
    var animationBox = new BABYLON.Animation(
      "myAnimation",
      "rotation.y",
      15,
      BABYLON.Animation.ANIMATIONTYPE_FLOAT,
      BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
    );

    // Animation keys
    var keys = [];
    keys.push({
      frame: 0,
      value: 0,
    });

    keys.push({
      frame: 30,
      value: 2 * Math.PI,
    });

    animationBox.setKeys(keys);

    //il faut ajouter l'animation à l'objet
    waste.animations.push(animationBox);

    // Démarrez l'animation
    this.scene.beginAnimation(waste, 0, 240, true);

    return waste;
  }

  createGround() {
    const ground = BABYLON.MeshBuilder.CreateGroundFromHeightMap(
      "ground",
      "textures/bPuyw.png", // Remplacez par le chemin de votre heightmap
      {
        width: 100, // La largeur du terrain
        height: 200, // La hauteur du terrain
        subdivisions: 100, // Le nombre de subdivisions
        minHeight: 0, // La hauteur minimale du terrain
        maxHeight: -0.5, // La hauteur maximale du terrain
        onReady: () => {
          const groundMaterial = new BABYLON.StandardMaterial(
            "groundMaterial",
            this.scene
          );
          groundMaterial.diffuseTexture = new BABYLON.Texture(
            "textures/grass.jpg",
            this.scene
          );
          groundMaterial.diffuseTexture.uScale = 50;
          groundMaterial.diffuseTexture.vScale = 50;

          // Remplacez par le chemin de votre texture
          ground.material = groundMaterial;
          ground.position.y = 0.7;
          ground.checkCollisions = true;
        },
      },

      this.scene
    );
    this.grounds.push(ground);
  }

  //Fonction pour créer les poubelles
  createBin(type) {
    const bin = BABYLON.MeshBuilder.CreateBox(
      "bin",
      { width: 2, height: 2, depth: 2 },
      this.scene
    );
    bin.material = new BABYLON.StandardMaterial("binMaterial", this.scene);
    bin.material.diffuseColor = new BABYLON.Color3(0, 0, 1); // Bleu pour les poubelles
    bin.material.ambientColor = new BABYLON.Color3(0.5, 0.5, 0.5);
    bin.isVisible = this.graphicsQuality === "high" ? false : true;
    return bin;
  }

  //Fonction pour ajouter la collision entre le joueur et les objets
  addCollisionDetection(mesh) {
    const actionManager = new BABYLON.ActionManager(this.scene);
    actionManager.registerAction(
      new BABYLON.ExecuteCodeAction(
        {
          trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
          parameter: { mesh: this.player.playerBox },
        },
        (evt) => {
          this.onPlayerCollision(this.player, evt.source);
        }
      )
    );
    mesh.actionManager = actionManager;
  }

  onPlayerCollision(player, obj) {
    //Si le joueur touche un déchet, on le supprime et on augmente le score
    if (obj.name === "waste") {
      obj.dispose();
      this.score += 1;
    }
    //Si le joueur touche une poubelle, le joueur a perdu, on arrete le jeu et les animations
    else if (obj.name === "bin") {
      //pour debug
      if (player.isInvincible) return;
      player.isAlive = false;
      this.particle.particleSystem.stop();
      player.animations[8].stop();
      player.animations[1].play();
      setTimeout(() => {
      this.scene.dispose();
      this.engine.stopRenderLoop();
      this.gameOver(this.graphicsQuality)}, 2000);
    }
  }
}

export default ModuleManager;
