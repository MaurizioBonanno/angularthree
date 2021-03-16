import { Injectable } from '@angular/core';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import * as Three from 'three';
import { Action } from '../../../../../enums/action.enum';
import { Animable } from '../../../../../interfaces/animable';
import { Inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ManService implements Animable{

  fbxLoader: FBXLoader;
  material: Three.MeshNormalMaterial;
  scene: Three.Scene;
  mixer: Three.AnimationMixer;
  animations: Three.AnimationAction[];
  activeAction: Three.AnimationAction;
  lastAction: Three.AnimationAction;
  modelReady = false;
  clock: Three.Clock;
  object: Three.Object3D;
  front: Three.Object3D;
  back: Three.Object3D;
  activeCamera: any;
  maxSpeed: number;
  minSpeed: number;

  velocityY = 0;

  forward: any;
  backward: any;
  left: any;
  right: any;
 // colliders: Three.Mesh[];


  constructor(scene: Three.Scene, @Inject(Three.Mesh) private colliders: Three.Mesh[]) {
    this.scene = scene;
    this.clock = new Three.Clock();
    this.animations = new Array();
    this.fbxLoader = new FBXLoader();
    this.material = new Three.MeshNormalMaterial();


    this.object = new Three.Object3D();
    this.front = new Three.Object3D();
    this.back = new Three.Object3D();

    this.forward = 0;
    this.backward = 0;
    this.left = 0;
    this.right = 0;

    this.maxSpeed = 400;
    this.minSpeed = 40;

    this.createCameras();
    this.colliders = colliders;
  }

  createModel(path: string, textPath: string, name: string){

    this.fbxLoader.load(path, (object) => {


      object.name = name;


      this.mixer = new Three.AnimationMixer(object);
      const animationAction = this.mixer.clipAction((object as any).animations[0]).play();
      this.animations.push(animationAction);
      this.activeAction = this.animations[Action.idle];

      const tLoader = new Three.TextureLoader();
      tLoader.load(textPath, (texture) => {
        object.traverse((child) => {
          if ((child as Three.Mesh).isMesh){
            ((child as Three.Mesh).material as Three.MeshBasicMaterial).map = texture;
           }
        });
      });

      this.scene.add(this.object);

      this.object.add(object);


          // carico un'animazione da un altro file
      this.loadAnimation('../../../../../../assets/fbx/anims/Walking.fbx');
      this.loadAnimation('../../../../../../assets/fbx/anims/Running.fbx');
      this.loadAnimation('../../../../../../assets/fbx/anims/Talking.fbx');
      this.loadAnimation('../../../../../../assets/fbx/anims/Walking Backwards.fbx');
      this.loadAnimation('../../../../../../assets/fbx/anims/Turn.fbx');

      this.modelReady = true;
    }, (xhr) => {
      console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    }, (error) => {});
  }

  loadAnimation(path: string){
    this.fbxLoader.load(path, (object) => {
      console.log('carico :' + path);
      const animationAction = this.mixer.clipAction((object as any).animations[0]);
      this.animations.push(animationAction);
    }, (xhr) => {}, (error) => {
      console.log('errore nel caricamento animazione:' + path);
    });
  }


  setAction(action: Action){
    if ( this.activeAction !== this.animations[action]){
      this.activeAction.stop();
      this.activeAction = this.animations[action];
      this.activeAction.play();
    }
  }

  createCameras(){
    const offset = new Three.Vector3(0, 80, 0);

    this.front.position.set(112, 100, 600);
    this.front.parent = this.object;

    this.back.position.set(0, 350, -500);
    this.back.parent = this.object;

    this.setActiveCamera(this.back);
  }

  setActiveCamera(cameraObject){
    this.activeCamera = cameraObject;
  }

  moveForward(){
    this.forward = 1;
  }
  moveBack(){
    this.backward = 1;
  }
  moveLeft(turn){
    this.left = turn;
  }
  moveRight(turn){
    this.right = turn;
  }
  stopMovement(){
    this.forward = 0;
    this.backward = 0;
    this.right = 0;
    this.left = 0;
  }

  animate(){
    const pos = this.object.position.clone();
    pos.y += 60;
    const dir = new Three.Vector3();
    this.object.getWorldDirection(dir);

    // aggiungo il raycaster
    let raycaster = new Three.Raycaster(pos, dir);
    let intersect = raycaster.intersectObjects(this.colliders);
    let blocked = false;

    if (intersect.length > 0){
      if (intersect[0].distance > 100) { blocked = true; }
    }

    if (this.backward !== 0) { dir.negate(); }

    const dt = this.clock.getDelta();

    if (this.modelReady){
      this.mixer.update(dt);
    }

    if ( blocked){
      if (this.forward !== 0){
        this.object.translateZ(dt * this.maxSpeed);
      }
      if (this.backward !== 0){
        this.object.translateZ(-dt * this.minSpeed);
      }
    }

     // cast left
    dir.set(-1, 0, 0);
    dir.applyMatrix4(this.object.matrix);
    dir.normalize();
    raycaster = new Three.Raycaster(pos, dir);
    intersect = raycaster.intersectObjects(this.colliders);
    if ( intersect.length > 0 ){
      if ( intersect[0].distance < 50 ){ this.object.translateX(100 - intersect[0].distance); }
    }

    // cast right
    dir.set( 1, 0, 0);
    dir.applyMatrix4(this.object.matrix);
    dir.normalize();
    raycaster = new Three.Raycaster(pos, dir);
    intersect = raycaster.intersectObjects(this.colliders);
    if ( intersect.length > 0 ){
      if ( intersect[0].distance < 50 ){ this.object.translateX(intersect[0].distance - 100 ); }
    }

    // cast down
    dir.set( 0, -1, 0);
    pos.y += 200;
    raycaster = new Three.Raycaster( pos, dir);
    const gravity = 30;
    intersect = raycaster.intersectObjects(this.colliders);

    if (intersect.length > 0){
      const targetY = pos.y - intersect[0].distance;
      if (targetY > this.object.position.y){
        // Going up
        this.object.position.y = 0.8 * this.object.position.y + 0.2 * targetY;
        this.velocityY = 0;
      }else if (targetY < this.object.position.y){
        // Falling
        if (this.velocityY === undefined) { this.velocityY = 0; }
        this.velocityY += dt * gravity;
        this.object.position.y -= this.velocityY;
        if (this.object.position.y < targetY){
          this.velocityY = 0;
          this.object.position.y = targetY;
        }
      }
    }



    if (this.left !== 0){
      this.object.rotateY(this.left * dt);
    }
    if (this.right !== 0 ){
      this.object.rotateY(this.right * dt);
    }
  }
}
