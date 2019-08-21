import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { GLOBAL } from './global';
import { Gender } from "../models/gender";

@Injectable()
export class GenderService {

    public url: string;

    constructor(private _http: HttpClient) {
        this.url = GLOBAL.url;
    }

    getGenders(token) {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        let options = {
            headers: headers
        };

        return this._http.get(this.url + 'genders', options)
            .pipe(map( (res: any) =>  res ));
    }

    getGender(token, id: string) {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        let options = {
            headers: headers
        };

        return this._http.get(this.url + 'gender/' + id, options)
            .pipe(map( (res: any) =>  res ));
    }

    addGender(token, gender: Gender) {
        let params = JSON.stringify(gender);
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.post(this.url + 'gender', params, { headers: headers })
            .pipe(map( (res: any) =>  res ));
    }

    editGender(token, id: string, gender: Gender) {
        let params = JSON.stringify(gender);
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.put(this.url + 'gender/' + id, params, { headers: headers })
            .pipe(map( (res: any) =>  res ));
    }

    deleteGender(token, id: string) {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        let options = {
            headers: headers
        };

        return this._http.delete(this.url + 'gender/' + id, options)
            .pipe(map( (res: any) =>  res ));
    }

}
