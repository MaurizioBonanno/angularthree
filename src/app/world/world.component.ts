import { Component, OnInit } from '@angular/core';
import * as Three from 'three';
import { GameService } from '../services/game/game.service';
import { Joystic } from '../classes/joystic';

@Component({
  selector: 'app-world',
  templateUrl: './world.component.html',
  styleUrls: ['./world.component.css']
})
export class WorldComponent implements OnInit {

  joystic: Joystic;

  constructor(private gameService: GameService) {

     this.joystic = new Joystic(gameService);
     document.body.appendChild(this.gameService.renderer.domElement);
     this.animate();
   }

  ngOnInit(): void {


  }



  animate(): void{
   // console.log('render');
    requestAnimationFrame(this.animate.bind(this));
    this.gameService.animate();

  }

}
