import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http"
import { Router } from '@angular/router';
import {JwtHelperService} from '@auth0/angular-jwt'
import { CookieService } from 'ngx-cookie-service';
import { User } from 'app/models/shared';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user:User;
  private baseUrl:string = "https://localhost:7250/api/User/"
  private userPayload:any;
  constructor(private http : HttpClient, private router: Router,  private cookieService: CookieService,) { 
    this.userPayload = this.decodedToken();
  }

  signUp(userObj:any){
   return this.http.post<any>(`${this.baseUrl}register`,userObj)
  }

  login(loginObj:any){
    return this.http.post<any>(`${this.baseUrl}authentificate`,loginObj)
   }

  storeToken(tokenValue : string){
    localStorage.setItem('token', tokenValue)
  } 

  getToken(){
    return localStorage.getItem('token')
  }
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token')
  }

  signOut(){
    delete this.user;

    localStorage.clear();
    localStorage.removeItem('token');
    this.router.navigate(['login'])
  }

  decodedToken(){
    const jwtHelper = new JwtHelperService();
    const token = this.getToken()!;
    console.log(jwtHelper.decodeToken(token))
    return jwtHelper.decodeToken(token)

  }
  
  getfullNameFromToken(){
    if(this.userPayload)
    return this.userPayload.name;
  }

  getRoleFromToken(){
    if(this.userPayload)
    return this.userPayload.role;
  }
 /* logout() {
    this.cookieService.delete('userLogin');
    this.cookieService.delete('passwordStrength');
    this.resetProfile();
}*/
resetProfile() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('expires_in');

  sessionStorage.clear();
}
}