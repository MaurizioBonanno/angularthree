import { Injectable } from '@angular/core';
import * as Three from 'three';

@Injectable({
  providedIn: 'root'
})
export class GroundService {

  plane: Three.PlaneBufferGeometry;
  scene: Three.Scene;
  material: Three.Material;
  mesh: Three.Mesh;
  gridHelper: Three.GridHelper;
  sizeX: number;
  sizeZ: number;

  constructor(scene: Three.Scene) {
    this.scene = scene;
    this.sizeX = 4000;
    this.sizeZ = 4000;
    this.plane = new Three.PlaneBufferGeometry(this.sizeX, this.sizeZ);
    this.material = new Three.MeshPhongMaterial({ color: 0x999999, depthWrite: false } );
    this.mesh = new Three.Mesh(this.plane, this.material);
    this.mesh.rotation.x = Math.PI / 2;
    this.mesh.receiveShadow = true;
    this.scene.add(this.mesh);
   }

   addGridHelper(){
    this.gridHelper = new Three.GridHelper(4000, 40, 0x000000, 0x000000);
    this.scene.add(this.gridHelper);
   }
}
