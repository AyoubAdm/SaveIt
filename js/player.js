class Player {
    constructor(scene) {
        this.scene = scene;
        this.mesh = this.createPlayerMesh();
    }

    createPlayerMesh() {
        const player = BABYLON.MeshBuilder.CreateBox("Player", { width: 1, height: 2, depth: 1 }, this.scene);
        player.position = new BABYLON.Vector3(0, 1, 0);
        player.material = new BABYLON.StandardMaterial("playerMaterial", this.scene);
        player.material.diffuseColor = new BABYLON.Color3(1, 0, 0);

        //Les differentes propriétés du joueur
        player.isAnimating = false;
        player.isAlive = true;
        return player;
    }

    //Pour déplacer le joueur de gauche à droite
    movePlayer(direction) {
        if (this.mesh.isAnimating || !this.mesh.isAlive) {
            return;
        }
        const targetX = this.mesh.position.x + direction;

        if (targetX >= -4 && targetX <= 4) {
            this.mesh.isAnimating = true;
            this.animate(targetX);
        } else {
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
        this.mesh.isAnimating = true;
        this.scene.beginAnimation(this.mesh, 0, 30, false).onAnimationEnd = () => {
            this.mesh.isAnimating = false;
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