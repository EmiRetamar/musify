import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from './models/user';
//importamos el método de login
import { UserService } from './services/user.service';
import { GLOBAL } from './services/global';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	//styleUrls: ['./app.component.css']
	//para poder usar el método de login hay que injectarlo
	providers: [ UserService ]
})
export class AppComponent implements OnInit {
	public title = 'MUSIFIY';
	public user: User;
	public user_register: User;
	//para el login
	public identity;
	public token;
	//error
	public errorLogin;
	public alertRegister;
	public url: string;
	public loginForm: FormGroup;
	public registerForm: FormGroup;
	public submittedLogin = false;
	public submittedRegister = false;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserService,
		private formBuilder: FormBuilder
	) {
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

		this.loginForm = this.formBuilder.group({
			email: ['', [Validators.required]],
			password: ['', [Validators.required]]
		});

		this.registerForm = this.formBuilder.group({
			name: ['', [Validators.required]],
			surname: ['', [Validators.required]],
			emailRegister: ['', [Validators.required]],
			passwordRegister: ['', [Validators.required]]
		});
	}

	get formLogin() {
		return this.loginForm.controls;
	}

	get formRegister() {
		return this.registerForm.controls;
	}

	public onSubmit(){
		this.submittedLogin = true;
		//hacemos la llamada al método del servicio
		//conseguir los datos del usuario identificado
		this._userService.signin(this.user).subscribe(
			response => {
				//muestra el usuario que se ha logueado
				this.identity = response.user;;

				if (!this.identity) {
					alert('El usuario no esta correctamente identificado');
				} else {
					//crear elemento en el logalstorage para tener al usuario sesión
					localStorage.setItem('identity', JSON.stringify(this.identity));

					//conseguir el token para enviarselo a cada petición http
					this._userService.signin(this.user, 'true').subscribe(
						response => {
							//console.log(response);
							//muestra el usuario que se ha logueado
							let token = response.token;
							this.token = token;
							console.log(this.token);

							if (this.token.length <= 0) {
								alert('El token no se ha generado correctamente');
							} else {
								//crear elemento en el logalstorage para tener el token disponible
								localStorage.setItem('token', token);

								this.user = new User('', '', '', '', '', 'ROLE_USER', '');
							}
						},
						err => {
							this.errorLogin = err.error.message;
						}
					);
				}
			},
			err => {
				this.errorLogin = err.error.message;
			}
		);
	}

	//método para cerrar sesión
	logout() {
		localStorage.removeItem('identity');
		localStorage.removeItem('token');
		localStorage.clear();

		//para salgamos de la parte privada
		this.identity = null;
		this.token = null;
		this._router.navigate(['/']);
	}

	//método de registro de usuarios
	onSubmitRegister() {
		this.submittedRegister = true;
		this._userService.register(this.user_register).subscribe(
			response => {
				this.user_register = response.user;

				if (!this.user_register) {
					this.alertRegister = 'Error al registrarse';
				} else {
					this.alertRegister = 'Registro realizado correctamente, identificate con '
						+ this.user_register.email;

					//para vaciar el formulario y permitir a otro usuario en registrarse
					this.user_register = new User('', '', '', '', '', 'ROLE_USER', '');
				}
			},
			err => {
				this.alertRegister = err.error.message;
			}
		);
	}
}
