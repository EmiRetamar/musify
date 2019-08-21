import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../services/user.service';
import { GenderService } from '../services/gender.service';
import { GLOBAL } from '../services/global';
import { Gender } from '../models/gender';

@Component({
    selector: 'gender-add',
    templateUrl: '../views/gender-form.html',
    providers: [ UserService, GenderService ]
})

export class GenderFormComponent implements OnInit {

    public titulo: string;
    public gender: Gender;
    public token;
    public identity;
    public url: string;
    public alertMessage;
    public genderForm: FormGroup;
    public idGender: string;
    public submitted = false;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _genderService: GenderService,
        private formBuilder: FormBuilder
    ) {
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.gender = new Gender('', '',);
    }

    ngOnInit() {
        console.log('gender-form.component.ts cargado');

        this.idGender = this._route.snapshot.paramMap.get('id');

        if (this.idGender) {
            this.titulo = 'Editar género musical';
            this._genderService.getGender(this.token, this.idGender).subscribe(
                response => this.gender = response.gender,
                err => console.log(err.error.message)
            );
        }
        else {
            this.titulo = 'Crear nuevo género musical';
        }

        this.genderForm = this.formBuilder.group({
            name: ['', [Validators.required]]
        });
    }

    get form() {
        return this.genderForm.controls;
    }

    onSubmit() {
        this.submitted = true;
        if (this.gender.name) {
            if (this.idGender) {
                this.editGender();
            }
            else {
                this.addGender();
            }
        }
    }

    addGender() {
        this._genderService.addGender(this.token, this.gender).subscribe(
            response => {
                if (!response.gender) {
                    this.alertMessage = 'Error en el servidor';
                } else {
                    this.alertMessage = 'El genero musical se ha creado correctamente';
                    this.gender = response.gender;
                    this._router.navigate(['/generos']);
                }
            },
            err => {
                this.alertMessage = err.error.message;
            }
        );
    }

    editGender() {
        this._genderService.editGender(this.token, this.idGender, this.gender).subscribe(
            response => {
                if (!response.gender) {
                    this.alertMessage = 'Error en el servidor';
                } else {
                    this.alertMessage = 'El genero musical se ha creado correctamente';
                    this.gender = response.gender;
                    this._router.navigate(['/generos']);
                }
            },
            err => {
                this.alertMessage = err.error.message;
            }
        );
    }

}
