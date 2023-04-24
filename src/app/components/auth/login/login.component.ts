import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService, NotificationService } from 'app/services/shared';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'environments/environment';
import { CaptchaComponent } from 'angular-captcha';
import { PasswordStrengthBarComponent } from 'app/shared/password-strength-bar/password-strength-bar.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'app/services/auth.service';
import { UserStoreService } from 'app/services/user-store.service';
import ValidateForm from 'app/helpers/validateform';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  idleState = 'Not started.';
  timedOut = false;
  lastPing?: Date = null;
  idlestart = false;
  public commitTime: string;
  failedLogin = false;
  failedCaptcha = false;
  @ViewChild(CaptchaComponent, {static: true}) captchaComponent: CaptchaComponent;
  errorMessages: string;

  recaptchaSended = false;
  

  type: string = "password";
  isText: boolean = false;
  eyeIcon: string = "fa fa-eye-slash";
  loginForm : FormGroup;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private cookieService: CookieService,
    private fb: FormBuilder,
    private auth: AuthService,

   
    //private toast: NgToastService,
    private userStore: UserStoreService
  ) {
    this.commitTime = environment.commitTime;
  }
  userLogin = '';
  userPassword = '';
  userNumber= '';
  returnUrl: string;
  isLoading = false;



  ngOnInit(): void {
    this.loginForm = this.fb.group({
      userNumber: ['',Validators.required],
      userPassword: ['',Validators.required]

    })
  }

  /*ngOnInit() {
    document.querySelector('body').setAttribute('themebg-pattern', 'theme1');

    this.authenticationService.logout();

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || 'dashboard';
    //this.captchaComponent.captchaEndpoint = environment.apiUrl + environment.captchaEndpointUrl;
  }*/

 /* validateCaptcha(): void {
    const userEnteredCaptchaCode = this.captchaComponent.userEnteredCaptchaCode;
    const captchaId = this.captchaComponent.captchaId;

    const postData = {
      userEnteredCaptchaCode: userEnteredCaptchaCode,
      captchaId: captchaId
    };

    this.authenticationService.validateCaptcha(postData)
      .subscribe(
        response => {
          if (response === 'false') {
            this.failedLogin = false;
           // this.failedCaptcha = true;
            //this.captchaComponent.reloadImage();
          } else {
            this.login();
           //this.failedCaptcha = false;
          }
        },
        error => {
          this.failedLogin = false;
          //this.failedCaptcha = true;
        });
  }*/

  /*login() {
    this.isLoading = true;
    const score = PasswordStrengthBarComponent.measureStrength(this.userPassword);
    this.authenticationService.login(this.userLogin, this.userPassword, score)
      .subscribe(
        userProfile => {
          this.isLoading = false;
          if (userProfile && this.authenticationService.isAuthenticated()) {
            this.cookieService.set('userLogin', this.userLogin);
            if (this.returnUrl.indexOf(';') > -1) {
              this.getOptionalParameters(this.returnUrl);
            } else {
              this.router.navigate([this.returnUrl]);
            }
          } else {
            //this.failedCaptcha = false;
            this.failedLogin = true;
          }
        },
        () => {
          this.isLoading = false;
          //this.failedCaptcha = false;
          this.failedLogin = true;
        }
      );
  }*/
  onLogin(){
    if(this.loginForm.valid){
      console.log(this.loginForm.value)
      this.auth.login(this.loginForm.value)
      .subscribe({
        next:(res)=>{
          alert(res.message)
          this.loginForm.reset();
          this.auth.storeToken(res.token);
          const tokenPayload = this.auth.decodedToken();
          this.userStore.setFullNameFromStore(tokenPayload.name);
          this.userStore.setRoleForStore(tokenPayload.role);
   
          this.router.navigate(['/dashboard']);
        },
        error:(err)=>{
          
          alert("ERROR");
        }
      })
    }else{
      
      ValidateForm.validateAllFormFileds(this.loginForm)
      alert("Your form is invalid")
    }
  }

  getOptionalParameters(Url: string) {
    const queryParams = {};
    let param: any;
    let value: any;
    const route = Url.substr(0, Url.indexOf(';'));
    let parameters = Url.substr(Url.indexOf(';') + 1, Url.length - Url.indexOf(';') - 1);
    while (parameters.indexOf(';') > -1) {
      param = parameters.substr(0, parameters.indexOf('='));
      value = parameters.substr(parameters.indexOf('=') + 1, parameters.indexOf(';') - parameters.indexOf('=') - 1);
      queryParams[param] = value;
      parameters = parameters.substr(parameters.indexOf(';') + 1, parameters.length - parameters.indexOf(';') - 1);
    }
    param = parameters.substr(0, parameters.indexOf('='));
    value = parameters.substr(parameters.indexOf('=') + 1, parameters.length - parameters.indexOf('=') - 1);
    queryParams[param] = value;

    this.router.navigate([route], { queryParams });
  }
}
