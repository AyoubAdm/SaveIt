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
        particleSystem.emitter = new BABYLON.Vector3(0, 3, -0.5);
        particleSystem.minEmitBox = new BABYLON.Vector3(-0.5, 0, -0.5);
        particleSystem.maxEmitBox = new BABYLON.Vector3(0.5, 0, -0.5);


        particleSystem.minSize = 0.02;
        particleSystem.maxSize = 0.02;
        particleSystem.minLifeTime = 0.05;
        particleSystem.maxLifeTime = 0.1;

        

        particleSystem.direction1 = new BABYLON.Vector3(0, 0, -5);
        particleSystem.direction2 = new BABYLON.Vector3(0, 0, -20);
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