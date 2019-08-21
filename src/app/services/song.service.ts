//importamos los servicios
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
//libreria para mapear objetos
import { map } from 'rxjs/operators';
//para recojer una respuesta de algúna petición
import { Observable } from 'rxjs/Observable';

import { GLOBAL } from './global';
import { Song } from "../models/song";

//creamos el servicio del usuario
@Injectable()
export class SongService {

    public url: string;

    //asignamos un valor a la url creando un constructor
    constructor(private _http: HttpClient) {
        //asignamos un valor a la url
        this.url = GLOBAL.url;
    }

    getSongs(token, albumId = null) {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        let options = {
            headers: headers
        };

        if (albumId == null) {
            return this._http.get(this.url + 'songs', options)
                .pipe(map( (res: any) =>  res ));
        } else {
            return this._http.get(this.url + 'songs/' + albumId, options)
                .pipe(map( (res: any) =>  res ));
        }
    }

    getSong(token, id: string) {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        let options = {
            headers: headers
        };

        return this._http.get(this.url + 'song/' + id, options)
            .pipe(map( (res: any) =>  res ));
    }

    searchSongs(token, text: string) {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        let options = {
            headers: headers
        };

        return this._http.get(this.url + 'search-songs/' + text, options)
            .pipe(map( (res: any) =>  res ));
    }

    addSong(token, song: Song) {
        let params = JSON.stringify(song);
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.post(this.url + 'song', params, { headers: headers })
            .pipe(map( (res: any) =>  res ));
    }

    editSong(token, id: string, song: Song) {
        let params = JSON.stringify(song);
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.put(this.url + 'song/' + id, params, { headers: headers })
            .pipe(map( (res: any) =>  res ));
    }

    deleteSong(token, id: string) {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        let options = {
            headers: headers
        };

        return this._http.delete(this.url + 'song/' + id, options)
            .pipe(map( (res: any) =>  res ));
    }

}
