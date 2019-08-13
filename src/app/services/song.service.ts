//importamos los servicios
import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
//libreria para mapear objetos
import 'rxjs/add/operator/map';
//para recojer una respuesta de algúna petición
import {Observable} from 'rxjs/Observable';

import {GLOBAL} from './global';
import { Song } from "../models/song";

//creamos el servicio del usuario
@Injectable()
export class SongService{
    public url: string;

    //asignamos un valor a la url creando un constructor
    constructor(private _http: Http){
        //asignamos un valor a la url
        this.url = GLOBAL.url;
    }

    //método de add artist
    addSong(token, song: Song){
        let params = JSON.stringify(song);
        let headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.post(this.url + 'song', params, {headers: headers})
                .map(res => res.json());
    }

    getSong(token, id:string){
        let headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        let options = new RequestOptions({headers: headers});

        return this._http.get(this.url + 'song/' + id, options)
            .map(res => res.json());
    }

    editSong(token, id:string, song: Song){
        let params = JSON.stringify(song);
        let headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.put(this.url + 'song' + id, params, {headers: headers})
                .map(res => res.json());
    }

    getSongs(token, albumId = null){
        let headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        let options = new RequestOptions({headers: headers});

        if(albumId == null){
            return this._http.get(this.url + 'songs', options)
                .map(res => res.json());
        }else{
            return this._http.get(this.url + 'songs/' + albumId, options)
                .map(res => res.json());
        }
    }

    deleteSong(token, id:string){
        let headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        let options = new RequestOptions({headers: headers});

        return this._http.delete(this.url + 'song/' + id, options)
            .map(res => res.json());
    }
}