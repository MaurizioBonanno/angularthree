import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  isLogged = false;

  constructor(private afAuthService: AuthService, private router: Router){
    this.initializeApp();
  }

  ngOnInit(): void {

  }

  initializeApp(){
    this.getAuthState();

  }

  getAuthState(){
    this.afAuthService.getAuthState().subscribe(user=>{
      console.log(`user auth state `, user ? user.toJSON() : null );
      if(user){
        this.isLogged = true;
      }else{
        this.isLogged = false;
      }
      this.handleNavigation();
      console.log('isLogged:', this.isLogged);
    });
  }

  handleNavigation(){
    if(this.isLogged){
      console.log(this.router.url.split('/')[1]);
      this.router.navigate(['/world']);
    }else{
      this.router.navigate(['/']);
    }
  }


}
