import { Injectable } from '@angular/core';
import * as Three from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import { ManService } from './loader/people/fbxpeople/man.service';
import { GroundService } from '../loader/ground/ground.service';
import { Colliders } from '../../classes/colliders';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  renderer = new Three.WebGLRenderer();
  scene: Three.Scene;
  camera: Three.PerspectiveCamera;
  light: Three.HemisphereLight;
  ambientLight: Three.AmbientLight;
  clock: Three.Clock;
  grid: Three.GridHelper;
  controls: OrbitControls;
  groundService: GroundService;
  manService: ManService;
  colliders: Colliders;
  constructor() {
    this.scene = new Three.Scene();
    this.scene.background = new Three.Color(0xa0a0a0);
    this.scene.fog = new Three.Fog(0xa0a0a0, 700, 1200 );
    this.createCamera();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.clock = new Three.Clock();


    // light
    this.light = new Three.HemisphereLight(0xffffff, 0x444444 );
    this.light.position.set(0, 200 , 0);
    this.ambientLight = new Three.AmbientLight(0x707070);
    this.ambientLight.position.set(0, 200, 100);
    // this.ambientLight.castShadow = true;

    // plane
    this.groundService = new GroundService(this.scene);
    this.groundService.addGridHelper();

    // carico gli edifici con cui collide
    this.colliders = new Colliders(this.scene);
    this.colliders.createBoxColliders(this.groundService);

    // loader

    this.manService = new ManService(this.scene);
    this.manService.createModel('../../../../../../assets/fbx/people/Policeman.fbx', '../../../../../../assets/images/SimplePeople_Policeman_Black.png', 'PoliceMan');



    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target.set(0, 150, 0);
    this.controls.update();



    this.scene.add(this.light);
    this.scene.add(this.ambientLight);

   }

   createCamera(){
    this.camera = new Three.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(112, 100, 400);
   }


   animate(){
     this.manService.animate();
     this.camera.position.lerp(this.manService.activeCamera.getWorldPosition(new Three.Vector3()), 0.05);
     const pos = this.manService.object.position.clone();
     pos.y += 200;
     this.camera.lookAt(pos);
     this.renderer.render(this.scene, this.camera);
   }
}
