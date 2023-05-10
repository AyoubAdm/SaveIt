class Player {
    constructor(scene) {
        this.scene = scene;

        // player.playerBox est un mesh invisible qui sert à détecter les collisions
        this.playerBox = BABYLON.MeshBuilder.CreateBox("PlayerBox", { width: 0.5, height: 1, depth: 0.5 }, this.scene);
        this.playerBox.position = new BABYLON.Vector3(0, 0.5, 0.9);
        this.playerBox.isVisible = false;

        // Les différentes propriétés du joueur
        this.isAnimating = false; // Pour bloquer les mouvements
        this.isAlive = true; // Pour savoir si le joueur est en vie
        this.keyIsDown = false; // Pour empecher le joueur de sortir de la plateforme en maintenant la touche enfoncée
    }

    //La creation du model 3D du joueur
    async createPlayerMesh() {
        return new Promise((resolve, reject) => {
            BABYLON.SceneLoader.ImportMesh("", "models/", "player.glb", this.scene, (newMeshes, particleSystems, skeletons, animationGroups) => {
                let player = new BABYLON.Mesh("Player", this.scene);
                let imported = newMeshes[0];
                imported.parent = player;
                this.animations = animationGroups;
                newMeshes.forEach((mesh) => {
                    mesh.name = "Player";
                });

                // On place le model au centre de la scène
                player.position = new BABYLON.Vector3(0, 1, 0);
                player.scaling = new BABYLON.Vector3(1.5, 1.5, 1.5);
                this.playerBox.parent = player;
                resolve(player);
            }, null, reject);
        });
    }


    //pour empecher le joueur de sortir de la plateforme en maintenant la touche enfoncée
    releaseKey() {
        this.keyIsDown = false;
      }
      

    //Pour déplacer le joueur de gauche à droite
    movePlayer(direction) {
        if (this.isAnimating || !this.isAlive || this.keyIsDown) {
            return;
          }
        
          this.keyIsDown = true;

        // On calcule la position cible du joueur (la ou il va aller)
        const targetX = this.mesh.position.x + direction;

        // On vérifie que le joueur ne sort pas de la plateforme
        if (targetX >= -4 && targetX <= 4) {

            // On isAnimating à true pour bloquer les mouvements
            this.isAnimating = true;

            //a droite
            if (direction == 3) {
                this.animations[6].speedRatio = 1.3*this.scene.GAME_SPEED*10
                this.animations[6].play()
            }
            //a gauche
            else if (direction == -3) {
                this.animations[4].speedRatio = 1.3*this.scene.GAME_SPEED*10
                this.animations[4].play()
            }

            //On lance l'animation
            this.animate(targetX);

        } 
        
        //si le joueur sort de la plateforme
        else {
            //de la gauche
            if(direction == -3){
                //on joue une animation ou le joueur se cogne contre le mur
                this.animations[0].speedRatio = 1.3*this.scene.GAME_SPEED*10
                this.animations[0].play();
            }
            //de la droite TODO

            
        }
    }


    //Pour animer le joueur lors de son déplacement
    animate(targetX) {
        const anim = new BABYLON.Animation(
            "playerMove",
            "position.x",
            30,
            BABYLON.Animation.ANIMATIONTYPE_FLOAT,
            BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
        ); const easingFunction = new BABYLON.QuadraticEase();
        easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
        anim.setEasingFunction(easingFunction);

        const keys = [
            { frame: 0, value: this.mesh.position.x },
            { frame: 8 / (this.scene.GAME_SPEED * 5), value: targetX },
        ];

        anim.setKeys(keys);

        this.mesh.animations = [anim];
        this.scene.beginAnimation(this.mesh, 0, 30, false).onAnimationEnd = () => {

            this.isAnimating = false;
        };
    }

}

export default Player;