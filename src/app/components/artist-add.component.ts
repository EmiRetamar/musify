import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../services/user.service';
import { GLOBAL } from '../services/global';
import { Artist } from '../models/artist';
import { Gender } from '../models/gender';
import { ArtistService } from '../services/artist.service';
import { GenderService } from '../services/gender.service';

@Component({
    selector: 'artist-add',
    templateUrl: '../views/artist-add.html',
    providers: [ UserService, ArtistService, GenderService ]
})

export class ArtistAddComponent implements OnInit {

    public titulo: string;
    public artist: Artist;
    public genders: Gender[];
    public token;
    public identity;
    public url: string;
    public alertMessage;
    public artistForm: FormGroup;
    public submitted = false;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _artistService: ArtistService,
        private _genderService: GenderService,
        private formBuilder: FormBuilder
    ) {
        this.titulo = 'Crear nuevo artista';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.artist = new Artist('', '', '', '', '');
    }

    ngOnInit() {
        console.log('artist-add.component.ts cargando');

        this.getGenders();

        this.artistForm = this.formBuilder.group({
            name: ['', [Validators.required]],
            description: ['', [Validators.required]],
            gender: ['', [Validators.required]]
        });
    }

    get form() {
        return this.artistForm.controls;
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

    onSubmit() {
        this.submitted = true;
        if (this.artist.name && this.artist.description && this.artist.gender) {
            this._artistService.addArtist(this.token, this.artist).subscribe(
                response => {
                    if (!response.artist) {
                        this.alertMessage = 'Error en el servidor';
                    } else {
                        this.alertMessage = 'El artista se ha creado correctamente';
                        this.artist = response.artist;
                        this._router.navigate(['/editar-artista', this.artist._id]);
                    }
                },
                err => {
                    this.alertMessage = err.error.message;
                }
            )
        }
    }

}
