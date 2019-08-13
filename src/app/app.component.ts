import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {User} from './models/user';
//importamos el método de login
import {UserService} from './services/user.service';
import {GLOBAL} from './services/global';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  //styleUrls: ['./app.component.css']
  //para poder usar el método de login hay que injectarlo
  providers: [UserService]
})
export class AppComponent implements OnInit{
  public title = 'MUSIFIY';
  public user: User;
  public user_register: User;
  //para el login
  public identity;
  public token;
  //error
  public errorMessage;
  public alertRegister;
  public url: string;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService
  ){
    this.user = new User('', '', '', '', '', 'ROLE_USER', '');
    this.user_register = new User('', '', '', '', '', 'ROLE_USER', '');
    this.url = GLOBAL.url;
  }

  ngOnInit(){
    //mantener la sesión hasta que se elimina
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();

    console.log(this.identity);
    console.log(this.token);
  }

  public onSubmit(){
    console.log(this.user);

    //hacemos la llamada al método del servicio
    //conseguir los datos del usuario identificado
    this._userService.signup(this.user).subscribe(
      response =>{
        //console.log(response);
        //muestra el usuario que se ha logueado
        let identity = response.user;
        this.identity = identity;

        if(!this.identity.id){
          alert('El usuario no esta correctamente identificado');
        }else{
          //crear elemento en el logalstorage para tener al usuario sesión
          localStorage.setItem('identity', JSON.stringify(identity));

          //conseguir el token para enviarselo a cada petición http
          this._userService.signup(this.user, 'true').subscribe(
            response =>{
              //console.log(response);
              //muestra el usuario que se ha logueado
              let token = response.token;
              this.token = token;
      
              if(this.token.length <= 0){
                alert('El token no se ha generado correctamente');
              }else{
                //crear elemento en el logalstorage para tener el token disponible
                localStorage.setItem('token', token);

                /*console.log(token);
                console.log(identity);*/

                this.user = new User('', '', '', '', '', 'ROLE_USER', '');
              }
            },
            error =>{
              var errorMessage = <any>error;
      
              if(errorMessage != null){
                //convertimos en obj json
                var body = JSON.parse(error._body);
      
                this.errorMessage = body.message;
                console.log(error);
              }
            }
          );
        }
      },
      error =>{
        var errorMessage = <any>error;

        if(errorMessage != null){
          //convertimos en obj json
          var body = JSON.parse(error._body);

          this.errorMessage = body.message;
          console.log(error);
        }
      }
    );
  }

  //método para cerrar sesión
  logout(){
    localStorage.removeItem('identity');
    localStorage.removeItem('token');
    localStorage.clear();

    //para salgamos de la parte privada
    this.identity = null;
    this.token = null;
    this._router.navigate(['/']);
  }


  //método de registro de usuarios 
  onSubmitRegister(){
    console.log(this.user_register);

    this._userService.register(this.user_register).subscribe(
      response =>{
        let user = response.user;
        this.user_register = user;

        if(!user.id){
          this.alertRegister = 'Error al registrarse';
        }else{
          this.alertRegister = 'Registro realizado correctamente, identificate con ' 
            + this.user_register.email;

          //para vasiar el formulario y permitir a otro usuario en registrarse
          this.user_register = new User('', '', '', '', '', 'ROLE_USER', '');
        }
      },
      error =>{
        var errorMessage = <any>error;

        if(errorMessage != null){
          //convertimos en obj json
          var body = JSON.parse(error._body);

          this.errorMessage = body.message;
          console.log(error);
        }
      }
    );
  }
}