class ModuleManager {
    constructor(scene, player, particle) {
        this.scene = scene;
        this.player = player;
        this.particle = particle;
    }
    
    
    moduleList = ["module1.json"]; // Ajoutez autant de modules que vous le souhaitez
    firstModule = true;
    currentModuleIndex = 0;


    async loadModule(moduleName) {

        const response = await fetch(moduleName);
        const moduleData = await response.json();

        //Le point de sortie du module. On creer un mesh invisible pour verifier si on a atteint le point de sortie du module
        const exitPointData = moduleData.exitPoint;
        const exitPoint = new BABYLON.MeshBuilder.CreateBox("exitPoint", { size: 1 }, this.scene);
        exitPoint.isVisible = false;
        exitPoint.position = new BABYLON.Vector3(exitPointData.x, exitPointData.y, exitPointData.z);
        
        // Décalage entre les modules. Plus c'est grand, plus les modules sont placer loin les uns des autres (et donc on ne les voit pas apparaitre)
        var decalage = this.firstModule ? 25 : 40;

        if (this.firstModule) {
            this.firstModule = false;
        }

        //La génération du module à partir des données JSON
        moduleData.geometry.forEach((geomData) => {

            //le box est le sol du module
            if (geomData.type === "box") {
                const box = BABYLON.MeshBuilder.CreateBox(
                    "box",
                    { width: geomData.size.width, height: geomData.size.height, depth: geomData.size.depth },
                    this.scene
                );
                box.position = new BABYLON.Vector3(geomData.position.x, geomData.position.y, geomData.position.z+decalage );
                box.material = new BABYLON.StandardMaterial("boxMaterial", this.scene);
                box.material.diffuseColor = new BABYLON.Color3(0.5, 1.5, 1);

            }
        });





        // Créez les objets déchets à partir des données JSON
        moduleData.wasteSpawns.forEach((wasteData) => {
            const waste = this.createWaste(wasteData.type); // Fonction pour créer un objet déchet en fonction du type
            waste.position = new BABYLON.Vector3(this.randomXPosition(), 1.3, wasteData.position.z + decalage);
            this.addCollisionDetection(waste);
        });

        // Créez les objets poubelles à partir des données JSON
        moduleData.binSpawns.forEach((binData) => {
            const bin = this.createBin(binData.type); // Fonction pour créer un objet poubelle en fonction du type
            bin.position = new BABYLON.Vector3(this.randomXPosition(), binData.position.y, binData.position.z + decalage);
            this.addCollisionDetection(bin);
        });


    };


    //Pour que la position X des dechets et obstacle soit aléatoire
    randomXPosition() {
        const positions = [-3, 0, 3];
        const index = Math.floor(Math.random() * positions.length);
        return positions[index];
    }


    //Pour charger le prochain module
    async loadNextModule() {
        //On supprime le point de sortie du module précédent car on l'a déjà atteint.
        this.scene.getMeshByName("exitPoint").dispose();
        const nextModuleIndex = (this.currentModuleIndex + 1) % this.moduleList.length;
        await this.loadModule(this.moduleList[nextModuleIndex]);
        this.currentModuleIndex = nextModuleIndex;
    };


    //Fonction pour créer les déchets
    createWaste(type) {
        
        const wasteMaterial = new BABYLON.StandardMaterial("wasteMaterial", this.scene);
        wasteMaterial.diffuseTexture = new BABYLON.Texture("../textures/vrai2.png", this.scene);
        wasteMaterial.diffuseTexture.hasAlpha = true;

        //le tableau des faces du cube
        var faceUV = new Array(6);
        
        //On met toute les faces à 0 pour que le cube soit transparent
        for (var i = 0; i < 6; i++) {
            faceUV[i] = new BABYLON.Vector4(0, 0, 0, 0);
        }
    
        //On met la texture sur la face avant du cube uniquement
        faceUV[1] = new BABYLON.Vector4(0, 0, 1, 1);
        
        //On crée le cube
        const waste = BABYLON.MeshBuilder.CreateBox("waste", { width : 2, height : 2, depth : 1, faceUV : faceUV}, this.scene);
        waste.material = wasteMaterial;

        //Pour rendre le déchet plus lumineux
        wasteMaterial.emissiveColor = new BABYLON.Color3(1, 1, 1);
        
        return waste;
    };


    //Fonction pour créer les poubelles
    createBin(type) {
        const bin = BABYLON.MeshBuilder.CreateBox("bin", { width: 2, height: 2, depth: 2 }, this.scene);
        bin.material = new BABYLON.StandardMaterial("binMaterial", this.scene);
        bin.material.diffuseColor = new BABYLON.Color3(0, 0, 1); // Bleu pour les poubelles
        bin.material.ambientColor = new BABYLON.Color3(0.5, 0.5, 0.5);
        return bin;
    };


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
    };

    onPlayerCollision(player, obj) {
        //Si le joueur touche un déchet, on le supprime et on augmente le score
        if (obj.name === "waste") {
            obj.dispose();
        }
        //Si le joueur touche une poubelle, le joueur a perdu, on arrete le jeu et les animations
        else if (obj.name === "bin") {
            if (player.isInvincible) return;
            player.isAlive = false;
            this.particle.particleSystem.stop();
            player.animations[8].stop()
            player.animations[1].play();
        }

    };

}

export default ModuleManager;