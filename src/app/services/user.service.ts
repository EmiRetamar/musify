//importamos los servicios
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
//libreria para mapear objetos
import { map } from 'rxjs/operators';
//para recojer una respuesta de algúna petición
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';

//creamos el servicio del usuario
@Injectable()
export class UserService {

    public identity;
    public token;
    public url: string;

    //asignamos un valor a la url creando un constructor
    constructor(private _http: HttpClient) {
        //asignamos un valor a la url
        this.url = GLOBAL.url;
    }

    //método para el servicio de login
    //recibe el usuario que se loguea y un parámetro
    signin(user_to_login, gethash = null) {
        if (gethash != null) {
            user_to_login.gethash = gethash;
        }

        //transformamos el objeto en string
        let json = JSON.stringify(user_to_login);
        let params = json;

        let headers = new HttpHeaders({'Content-Type': 'application/json'});

        //accedemos al modulo post para hacer una consulta en nuestra api
        return this._http.post(this.url + 'login', params, { headers: headers })
            .pipe(map( (res: any) =>  res ));
    }

    //método para registrar
    register(user_to_register) {
        //transformamos el objeto en string
        let json = JSON.stringify(user_to_register);
        let params = json;

        let headers = new HttpHeaders({'Content-Type':'application/json'});

        //accedemos al modulo post para hacer una consulta en nuestra api
        return this._http.post(this.url + 'register', params, { headers: headers })
            .pipe(map( (res: any) =>  res ));
    }

    //método de actualizar los datos del usu
    updateUser(user_to_update) {
        //transformamos el objeto en string
        let json = JSON.stringify(user_to_update);
        let params = json;

        let headers = new HttpHeaders({
            'Content-Type':'application/json',
            'Authorization': this.getToken()
        });

        //accedemos al modulo post para hacer una consulta en nuestra api
        return this._http.put(this.url + 'update-user/' + user_to_update._id, params, { headers: headers })
            .pipe(map( (res: any) =>  res ));
    }

    //crear método para consultar localStorage
    getIdentity() {
        let identity = JSON.parse(localStorage.getItem('identity'));

        if (identity != null) {
            this.identity = identity;
        } else {
            this.identity = null;
        }

        return this.identity;
    }

    getToken() {
        let token = localStorage.getItem('token');

        if (token != null) {
            this.token = token;
        } else {
            this.token = null;
        }

        return this.token;
    }

}
