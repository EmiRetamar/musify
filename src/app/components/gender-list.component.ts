import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../services/user.service';
import { GLOBAL } from '../services/global';
import { Gender } from '../models/gender';
import { GenderService } from '../services/gender.service';

@Component({
    selector: 'gender-list',
    templateUrl: '../views/gender-list.html',
    providers: [ UserService, GenderService ]
})

export class GenderListComponent implements OnInit {

    public titulo: string;
    public genders: Gender[];
    public token;
    public identity;
    public url: string;
    public alertMessage;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _genderService: GenderService,
    ) {
        this.titulo = 'Géneros musicales';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
    }

    ngOnInit() {
        console.log('gender-list.component.ts cargando');

        this.getGenders();
    }

    getGenders() {

        this._genderService.getGenders(this.token).subscribe(
            response => {
                if (!response.genders) {
                    this.alertMessage = 'Aun no hay generos musicales disponibles';
                } else {
                    this.genders = response.genders;
                }
            },
            err => {
                this.alertMessage = err.error.message;
            }
        );

    }

    public confirmado;

    onDeleteConfirm(id) {
        this.confirmado = id;
    }

    onCancelGender() {
        this.confirmado = null;
    }

    onDeleteGender(id) {
        this._genderService.deleteGender(this.token, id).subscribe(
            response => {
                if (!response.gender) {
                    alert('Error en el servidor');
                } else {
                    this.getGenders();
                }
            },
            err => {
                this.alertMessage = err.error.message;
            }
        );
    }

}
