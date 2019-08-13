//importamos los servicios
import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
//libreria para mapear objetos
import 'rxjs/add/operator/map';
//para recojer una respuesta de algúna petición
import {Observable} from 'rxjs/Observable';

import {GLOBAL} from './global';
import { Artist } from "app/models/artist";

//creamos el servicio del usuario
@Injectable()
export class ArtistService{
    public url: string;

    //asignamos un valor a la url creando un constructor
    constructor(private _http: Http){
        //asignamos un valor a la url
        this.url = GLOBAL.url;
    }

    getArtists(token, page){
        let headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        let options = new RequestOptions({headers: headers});
        return this._http.get(this.url + 'artists' + page, options)
                    .map(res => res.json());
    }

    getArtist(token, id:string){
        let headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        let options = new RequestOptions({headers: headers});
        return this._http.get(this.url + 'artist' + id, options)
                    .map(res => res.json());
    }

    //método de add artist
    addArtist(token, artist: Artist){
        let params = JSON.stringify(artist);
        let headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.post(this.url + 'artist', params, {headers: headers})
                .map(res => res.json());
    }

    editArtist(token, id: string, artist: Artist){
        let params = JSON.stringify(artist);
        let headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.put(this.url + 'artist/' + id, params, {headers: headers})
                .map(res => res.json());
    }

    deleteArtist(token, id:string){
        let headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        let options = new RequestOptions({headers: headers});
        return this._http.delete(this.url + 'artist' + id, options)
                    .map(res => res.json());
    }
}