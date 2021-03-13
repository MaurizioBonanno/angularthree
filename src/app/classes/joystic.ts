
import { ManService } from '../services/game/loader/people/fbxpeople/man.service';
import { Action } from '../enums/action.enum';
import { GameService } from '../services/game/game.service';
export class Joystic {
  domElement: any;
  maxRadius: any;
  maxRadiusSquared: any;
  onMove: any;
  game: any;
  origin: any;
  rotationDamping: any;
  moveDamping: any;
  offset: any;
  player: ManService;
  constructor(gameService: GameService){

    this.player = gameService.manService;

    const circle = document.createElement('div');
    circle.style.cssText = 'position: absolute;bottom: 35px;width: 80px;height: 80px;background:rgba(126, 126, 126, 0.5); border:#444 solid medium; border-radius:50%; left:50%; transform:translateX(-50%);';
    const thumb = document.createElement('div');
    thumb.style.cssText = 'position: absolute; left: 18px; top: 15px; width: 40px; height: 40px; border-radius: 50%; background: #fff;';
    circle.appendChild(thumb);
    document.body.appendChild(circle);
    this.domElement = thumb;
    this.maxRadius = 40; // maxradius = option.maxradius || 40;
    this.maxRadiusSquared = this.maxRadius * this.maxRadius;
   // this.onMove = option.onMove //probabilmente è una funzione
   // this.game = option.game
    this.origin = { left: this.domElement.offsetLeft, top: this.domElement.offsetTop };
   //  this.rotationDamping = option.rotationDamping
    this.rotationDamping = 0.06;
    this.moveDamping = 0.01;
   // this.moveDamping = option.moveDamping
    if (this.domElement !== undefined ){
      const joystic = this;
      if ('ontouchstart' in window){
        this.domElement.addEventListener('touchstart', (evt) => {
          evt.preventDefault();
          joystic.tap(evt);
          evt.stopPropagation();
        });
      }else{
        this.domElement.addEventListener('mousedown', (evt) => {
          evt.preventDefault();
          joystic.tap(evt);
          evt.stopPropagation();
        });
      }
    }
  }

  getMousePosition(evt){
    const clientX = evt.targetTouches ? evt.targetTouches[0].pageX : evt.clientX ;
    const clientY = evt.targetTouches ? evt.targetTouches[0].pageX : evt.clientY ;
    return { x: clientX, y: clientY };
  }


  tap(evt) {
    evt = evt || window.event ;
    this.offset = this.getMousePosition(evt);
    const joystic = this;
    if ('ontouchstart' in window){
      document.ontouchmove = (evt) => {
         console.log('sono in ontouchmove');
         joystic.move(evt); };
      document.ontouchend = (evt) => {
        console.log('sono in ontouchend');
        joystic.up(evt); };
    }else{
      document.onmousemove = (evt) => {
        console.log('sono in onmousemove');
        joystic.move(evt); };
      document.onmouseup = (evt) => {
        console.log('sono in onmouseup');
        joystic.up(evt); };
    }
  }

  up(evt: any) {
    console.log('sono in up');
    if ('ontouchstart' in window){
      document.ontouchmove = null;
      document.ontouchend = null;
		}else{
      document.onmousemove = null;
      document.onmouseup = null;
		}
    this.domElement.style.top = `${this.origin.top}px`;
		  this.domElement.style.left = `${this.origin.left}px`;

    this.playerControl(0, 0);
  }

  playerControl(forward, turn){

    turn = -turn;
    console.log(`turn : ${turn}`);
    if (forward > 0.3) {
      // tslint:disable-next-line:max-line-length
      if (this.player.activeAction !== this.player.animations[Action.walking] && this.player.activeAction !== this.player.animations[Action.running]){
        this.player.setAction(Action.running);
        this.player.moveForward();
      }
     }else if ( forward < -0.3 ){
       if ( this.player.activeAction !== this.player.animations[Action.walking_backward]){
         this.player.setAction(Action.walking_backward);
         this.player.moveBack();
       }
     }
     else{
      forward = 0;
      if (Math.abs(turn) > 0.1){
        this.player.setAction(Action.turn);
        if(turn < 0){
          console.log('turn negativo');
          this.player.moveLeft(turn);

        }else{
          console.log('turn positivo');
          this.player.moveRight(turn);
        }
      }
     }

    if (forward === 0 && turn === 0){
      this.player.setAction(Action.idle);
      this.player.stopMovement();
     }

  }
// muove il joystic
  move(event: any) {

    const evt = event || window.event;
    const mouse = this.getMousePosition(evt);
    let left = mouse.x - this.offset.x;
    let top = mouse.y - this.offset.y;
    const sqMag = left * left + top * top;

    if (sqMag > this.maxRadiusSquared){
      const magnitude = Math.sqrt(sqMag);
      left /= magnitude;
      top /= magnitude;
      left *= this.maxRadius;
      top *= this.maxRadius;
      console.log(`sono in move sqMag:${sqMag}; Magnitude:${magnitude};left:${left};top:${top}`);
    }
		  this.domElement.style.top = `${top + this.domElement.clientHeight / 2}px`;
		  this.domElement.style.left = `${left + this.domElement.clientWidth / 2}px`;


		  const forward = -(top - this.origin.top + this.domElement.clientHeight / 2) / this.maxRadius;
		  const turn = (left - this.origin.left + this.domElement.clientWidth / 2) / this.maxRadius;

		  this.playerControl(forward, turn); // this.onMove.call(this.game, forward, turn);
  }
}
