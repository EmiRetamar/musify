//importamos los servicios
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
//libreria para mapear objetos
import { map } from 'rxjs/operators';
//para recojer una respuesta de algúna petición
import { Observable } from 'rxjs/Observable';

import { GLOBAL } from './global';
import { Artist } from "../models/artist";

@Injectable()
export class ArtistService {

    public url: string;

    //asignamos un valor a la url creando un constructor
    constructor(private _http: HttpClient) {
        //asignamos un valor a la url
        this.url = GLOBAL.url;
    }

    getArtists(token, page) {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        let options = {
            headers: headers
        };

        return this._http.get(this.url + 'artists/' + page, options)
            .pipe(map( (res: any) =>  res ));
    }

    getArtist(token, id: string) {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        let options = {
            headers: headers
        };

        return this._http.get(this.url + 'artist/' + id, options)
            .pipe(map( (res: any) =>  res ));
    }

    //método de add artist
    addArtist(token, artist: Artist) {
        let params = JSON.stringify(artist);
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.post(this.url + 'artist', params, {headers: headers})
            .pipe(map( (res: any) =>  res ));
    }

    editArtist(token, id: string, artist: Artist) {
        let params = JSON.stringify(artist);
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.put(this.url + 'artist/' + id, params, {headers: headers})
            .pipe(map( (res: any) =>  res ));
    }

    deleteArtist(token, id: string) {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        let options = {
            headers: headers
        };

        return this._http.delete(this.url + 'artist/' + id, options)
            .pipe(map( (res: any) =>  res ));
    }

}
