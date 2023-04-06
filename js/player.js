class Player {
    constructor(scene) {
        this.scene = scene;

        // player.playerBox est un mesh invisible qui servira à détecter les collisions
        this.playerBox = BABYLON.MeshBuilder.CreateBox("PlayerBox", { width: 0.5, height: 1, depth: 0.5 }, this.scene);
        this.playerBox.position = new BABYLON.Vector3(0, 0.5, 0.9);
        this.playerBox.isVisible = false;

        // Les différentes propriétés du joueur
        this.isAnimating = false;
        this.isAlive = true;
    }

    //La creation du model 3D du joueur
    async createPlayerMesh() {
        return new Promise((resolve, reject) => {
            BABYLON.SceneLoader.ImportMesh("", "models/", "final2.glb", this.scene, (newMeshes, particleSystems, skeletons, animationGroups) => {
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


    //Pour déplacer le joueur de gauche à droite
    movePlayer(direction) {
        if (this.isAnimating || !this.isAlive) {
            return;
        }
        const targetX = this.mesh.position.x + direction;


        if (targetX >= -4 && targetX <= 4) {

            
            
            this.isAnimating = true;
            if (direction == 3) {
                this.animations[6].speedRatio = 1.3*this.scene.GAME_SPEED*10
                this.animations[6].play()
            }
            else if (direction == -3) {
                this.animations[4].speedRatio = 1.3*this.scene.GAME_SPEED*10
                this.animations[4].play()
            }
            this.animate(targetX);
        } else {
            if(direction == -3){
                this.animations[0].speedRatio = 1.3*this.scene.GAME_SPEED*10
                this.animations[0].play();
            }
            
            this.bounceAnimation(direction);
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
        this.isAnimating = true;
        this.scene.beginAnimation(this.mesh, 0, 30, false).onAnimationEnd = () => {
            this.isAnimating = false;
        };
    }

    //Pour animer le joueur lorsqu'il touche un bord
    bounceAnimation(direction) {
        if (this.isAnimating) {
            return;
        } const startPosition = this.mesh.position.clone();
        const targetPosition = this.mesh.position.add(new BABYLON.Vector3(direction * 0.2, 0, 0));
        const returnPosition = startPosition.clone();

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
        this.mesh.animations.push(animation1);

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
        this.mesh.animations.push(animation2);

        this.mesh.isAnimating = true;
        this.scene.beginAnimation(this.mesh, 0, 10, false, 1, () => {
            this.mesh.isAnimating = false;
        });
    }
}

export default Player;