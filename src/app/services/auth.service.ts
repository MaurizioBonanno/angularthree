import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase';
import { error } from 'protractor';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private afAuth: AngularFireAuth) { }

  createUser(){

  }

  getAuthState(){
    return this.afAuth.authState;
  }

  async googleLogin(){
    try {
      await this.afAuth.signInWithRedirect(new firebase.auth.GoogleAuthProvider()).then(user=>{
        console.log(`Google login with succed user: ${user}`);
      }).catch(error=>{
        console.log(error);
      })
    } catch (error) {
      throw new Error(error);
    }
  }


}
