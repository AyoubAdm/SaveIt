class Particle{
    constructor(scene, player){
        this.scene = scene;
        this.player = player;
        this.particleSystem = this.createParticleSystem();
    }

    createParticleSystem(){
                //Les particules du joueur
        let particleSystem = new BABYLON.ParticleSystem("particles", 20, this.scene);
        particleSystem.particleTexture = new BABYLON.Texture("../textures/speed.png", this.scene);
        particleSystem.emitter = new BABYLON.Vector3(0, 3, -1);
        particleSystem.minEmitBox = new BABYLON.Vector3(-1, 0, -0.5);
        particleSystem.maxEmitBox = new BABYLON.Vector3(1, 0, -0.5);


        particleSystem.minSize = 0.02;
        particleSystem.maxSize = 0.02;
        particleSystem.minLifeTime = 0.2;
        particleSystem.maxLifeTime = 1;

        
        particleSystem.minAngularSpeed = -0.8;
        particleSystem.maxAngularSpeed = 0.8;
        particleSystem.direction1 = new BABYLON.Vector3(-0.2, 0, -10);
        particleSystem.direction2 = new BABYLON.Vector3(0.2, 0, -10);
        particleSystem.move = (dir) => {
            if (!this.player.isAlive) {
                return;
            }
            const targetX = particleSystem.emitter.x + dir;
            if (targetX >= -4 && targetX <= 4) {
                

                particleSystem.emitter = new BABYLON.Vector3(targetX, 3, -0.5);
        }


    }
        return particleSystem;
    }
}

export default Particle;