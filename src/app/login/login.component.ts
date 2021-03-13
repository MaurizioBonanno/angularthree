

import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private fAuth: AuthService) { }

  ngOnInit(): void {
  }

 async loginWithGoogle(){
   try {
    await this.fAuth.googleLogin();
   } catch (error) {
     throw new Error(error)
   }
  }

}
