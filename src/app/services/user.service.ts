//importamos los servicios
import {Injectable} from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
//libreria para mapear objetos
import 'rxjs/add/operator/map';
//para recojer una respuesta de algúna petición
import {Observable} from 'rxjs/Observable';

import {GLOBAL} from './global';

//creamos el servicio del usuario
@Injectable()
export class UserService{
    public identity;
    public token;
    public url: string;

    //asignamos un valor a la url creando un constructor
    constructor(private _http: Http){
        //asignamos un valor a la url
        this.url = GLOBAL.url;
    }

    //método para el servicio de login
    //recibe el usuario que se loga y un parámetro 
    signup(user_to_login, gethash = null){
        if(gethash != null){
            user_to_login.gethash = gethash;
        }

        //transformamos el objeto en string
        let json = JSON.stringify(user_to_login);
        let params = json;

        let headers = new Headers({'Content-Type':'application/json'});

        //accedemos al modulo post para hacer una consulta en nuestra api
        return this._http.post(this.url + 'login', params, {headers: headers})
            .map(res => res.json());
    }

    //método para registrar
    register(user_to_register){
        //transformamos el objeto en string
        let json = JSON.stringify(user_to_register);
        let params = json;

        let headers = new Headers({'Content-Type':'application/json'});

        //accedemos al modulo post para hacer una consulta en nuestra api
        return this._http.post(this.url + 'register', params, {headers: headers})
            .map(res => res.json());
    }

    //método de actualizar los datos del usu
    updateUser(user_to_update){
        //transformamos el objeto en string
        let json = JSON.stringify(user_to_update);
        let params = json;

        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization': this.getToken()
        });

        //accedemos al modulo post para hacer una consulta en nuestra api
        return this._http.put(this.url + 'update-user/' + user_to_update.id, params, {headers: headers})
            .map(res => res.json());
    }

    //crear método para consultar localStorage
    getIdentity(){
        let identity = JSON.parse(localStorage.getItem('identity'));

        if(identity != 'undefined'){
            this.identity = identity;
        }else{
            this.identity = null;
        }

        return this.identity;
    }

    getToken(){
        let token = localStorage.getItem('token');

        if(token != 'undefinded'){
            this.token = token;
        }else{
            this.token = null;
        }

        return this.token;
    }
}