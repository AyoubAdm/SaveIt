class ModuleManager{
    constructor(scene,player,particle){
        this.scene = scene;
        this.player = player;
        this.particle = particle;
    }


    moduleList = ["module1.json"]; // Ajoutez autant de modules que vous le souhaitez
    currentModuleIndex = 0;


    async loadModule(moduleName) {
        
        const response = await fetch(moduleName);
        const moduleData = await response.json();
      
        // Ajoutez d'autres logiques nécessaires pour positionner et connecter les modules
        const exitPointData = moduleData.exitPoint;
        const exitPoint = new BABYLON.MeshBuilder.CreateBox("exitPoint", { size: 1 }, this.scene);
        exitPoint.isVisible = false; // Rendez le mesh invisible
        exitPoint.position = new BABYLON.Vector3(exitPointData.x, exitPointData.y, exitPointData.z);
        var decalage = exitPointData.z;
      
        // Créez la géométrie de base à partir des données JSON
        moduleData.geometry.forEach((geomData) => {
          if (geomData.type === "box") {
            const box = BABYLON.MeshBuilder.CreateBox(
              "box",
              { width: geomData.size.width, height: geomData.size.height, depth: geomData.size.depth },
              this.scene
            );
            box.position = new BABYLON.Vector3(geomData.position.x, geomData.position.y, geomData.position.z + decalage);
      
          }
        });
        

        

      
        // Créez les objets déchets à partir des données JSON
        moduleData.wasteSpawns.forEach((wasteData) => {
          const waste = this.createWaste(wasteData.type); // Fonction pour créer un objet déchet en fonction du type
          waste.position = new BABYLON.Vector3(this.randomXPosition(), wasteData.position.y, wasteData.position.z + decalage);
          this.addCollisionDetection(waste);
        });
      
        // Créez les objets poubelles à partir des données JSON
        moduleData.binSpawns.forEach((binData) => {
          const bin = this.createBin(binData.type); // Fonction pour créer un objet poubelle en fonction du type
          bin.position = new BABYLON.Vector3(this.randomXPosition(), binData.position.y, binData.position.z + decalage);
          this.addCollisionDetection(bin);
        });
      
      
      };


      randomXPosition() {
        const positions = [-3, 0, 3];
        const index = Math.floor(Math.random() * positions.length);
        return positions[index];
      }


      async loadNextModule() {
        this.scene.getMeshByName("exitPoint").dispose();
        const nextModuleIndex = (this.currentModuleIndex + 1) % this.moduleList.length;
        await this.loadModule(this.moduleList[nextModuleIndex]);
        this.currentModuleIndex = nextModuleIndex;
      };


       createWaste(type) {
        const waste = BABYLON.MeshBuilder.CreateBox("waste", { width: 1, height: 1, depth: 1 }, this.scene);
        waste.material = new BABYLON.StandardMaterial("wasteMaterial", this.scene);
        waste.material.diffuseColor = new BABYLON.Color3(0, 1, 0); // Vert pour les déchets
        return waste;
      };
      
       createBin(type) {
        const bin = BABYLON.MeshBuilder.CreateBox("bin", { width: 2, height: 2, depth: 2 }, this.scene);
        bin.material = new BABYLON.StandardMaterial("binMaterial", this.scene);
        bin.material.diffuseColor = new BABYLON.Color3(0, 0, 1); // Bleu pour les poubelles
        return bin;
      };
      
      
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
      };
      
    onPlayerCollision(player, obj) {
        // Gérez ici la logique de collision entre le joueur et l'objet
        if (obj.name === "waste") {
          obj.dispose();
        }
        else if (obj.name === "bin") {
          if (player.isInvincible) return;
          this.scene.GAME_SPEED = 0;
          player.isAlive = false;
          this.particle.particleSystem.stop();
          player.animations[8].stop()
          player.animations[1].play();
        }
      
      };


      

  
  


      
// const removeCurrentModule = () => {
//   let bin = scene.getMeshByName("bin");
//   let waste = scene.getMeshByName("waste");
//   let box = scene.getMeshByName("box");
//   setTimeout(() => {
//     bin.dispose();
//     waste.dispose();
//     box.dispose();
//   }, 1800);
// }
}

export default ModuleManager;