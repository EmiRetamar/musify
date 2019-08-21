//importamos los servicios
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
//libreria para mapear objetos
import { map } from 'rxjs/operators';
//para recojer una respuesta de algúna petición
import { Observable } from 'rxjs/Observable';

import { GLOBAL } from './global';
import { Album } from "../models/album";

@Injectable()
export class AlbumService {

    public url: string;

    //asignamos un valor a la url creando un constructor
    constructor(private _http: HttpClient){
        //asignamos un valor a la url
        this.url = GLOBAL.url;
    }

    getAlbums(token, artistId = null) {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        let options = {
            headers: headers
        };

        if (artistId == null) {
            return this._http.get(this.url + 'albums', options)
                .pipe(map( (res: any) =>  res ));
        } else {
            return this._http.get(this.url + 'albums/' + artistId, options)
                .pipe(map( (res: any) =>  res ));
        }
    }

    getAlbum(token, id: string) {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        let options = {
            headers: headers
        };

        return this._http.get(this.url + 'album/' + id, options)
            .pipe(map( (res: any) =>  res ));
    }

    searchAlbums(token, text: string) {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        let options = {
            headers: headers
        };

        return this._http.get(this.url + 'search-albums/' + text, options)
            .pipe(map( (res: any) =>  res ));
    }

    addAlbum(token, album: Album) {
        let params = JSON.stringify(album);
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.post(this.url + 'album', params, { headers: headers })
            .pipe(map( (res: any) =>  res ));
    }

    editAlbum(token, id: string, album: Album) {
        let params = JSON.stringify(album);
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.put(this.url + 'album/' + id, params, { headers: headers })
            .pipe(map( (res: any) =>  res ));
    }

    deleteAlbum(token, id: string) {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        let options = {
            headers: headers
        };

        return this._http.delete(this.url + 'album/' + id, options)
            .pipe(map( (res: any) =>  res ));
    }

}
