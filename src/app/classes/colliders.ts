
import * as Three from 'three';
import { GroundService } from '../services/loader/ground/ground.service';

export class Colliders {
  colliders: Three.Mesh[];
  scene: Three.Scene;
  constructor(scena: Three.Scene){
    this.scene = scena;
    this.colliders = new Array<Three.Mesh>();
  }

  createBoxColliders(ground: GroundService){
    const geometry = new Three.BoxGeometry(500, 800, 500);
    const material = new Three.MeshBasicMaterial({color: 0x222222, wireframe: false});

    for (let x = - ground.sizeX; x < ground.sizeX; x += 1000) {
     for (let z = - ground.sizeZ; z < ground.sizeZ; z += 1000) {
      if (x === 0 && z === 0) { continue; }
      const box = new Three.Mesh(geometry,material);
      box.position.set(x, 400, z);
      this.scene.add(box);
      this.colliders.push(box);
     }
    }

    const geometry2 = new Three.BoxGeometry(1000, 40, 1000);
    const stage = new Three.Mesh(geometry2, material);
    stage.position.set(0, 20, 0);
    this.scene.add(stage);
    this.colliders.push(stage);

  }
}
