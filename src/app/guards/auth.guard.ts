/*import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from 'app/services/shared';

@Injectable()
export class AuthGuard implements CanActivate {
    userId = 0;
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        // check if user is logged in
        if (this.authenticationService.isAuthenticated()) {
            const routeFunction = route.data['function'];
            if (routeFunction === undefined) {
                return true;
            }
            const profile = this.authenticationService.getProfile();
            const fonctions = profile.currentUser.functionsId;
            if (profile) {
                // check if route is restricted by function
                if (fonctions.indexOf(routeFunction) === -1) {
                    // user not authorised so redirect to home page
                    this.router.navigate(['/dashboard']);
                    return false;
                }
                // route is authorised by function
                return true;
            }
        }
        // user is not logged in so redirect to login page with the return url
        this.router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
        return false;
    }

}*/
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { NotificationService } from 'app/services/shared';

import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private auth : AuthService, private router: Router,private notificationService: NotificationService){

  }
  canActivate ():boolean {
    if(this.auth.isLoggedIn()){
      return true
    }else {

      this.notificationService.danger('Please Login First!');
      this.router.navigate(['login'])
    return false;
    }
  }
  
}
