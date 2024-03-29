import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../services/user.service';
import { GLOBAL } from '../services/global';
import { Artist } from '../models/artist';
import { Gender } from '../models/gender';
import { ArtistService } from '../services/artist.service';
import { GenderService } from '../services/gender.service';
import { UploadService } from '../services/upload.service';

@Component({
    selector: 'artist-edit',
    templateUrl: '../views/artist-add.html',
    providers: [ UserService, ArtistService, GenderService, UploadService ]
})

export class ArtistEditComponent implements OnInit {

    public titulo: string;
    public artist: Artist;
    public genders: Gender[];
    public token;
    public identity;
    public url: string;
    public alertMessage;
    public is_edit;
    public artistForm: FormGroup;
    public submitted = false;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _artistService: ArtistService,
        private _genderService: GenderService,
        private _uploadService: UploadService,
        private formBuilder: FormBuilder
    ) {
        this.titulo = 'Editar artista';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.artist = new Artist('', '', '', '', '');
        this.is_edit = true;
    }

    ngOnInit() {
        console.log('artist-edit.component.ts cargando');

        this.getArtist();
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

    getArtist() {
        this._route.params.forEach((params: Params) => {
            let id = params['id'];

            this._artistService.getArtist(this.token, id).subscribe(
                response => {
                    if (!response.artist) {
                        this._router.navigate(['/']);
                    } else {
                        this.artist = response.artist;
                    }
                },
                err => {
                    this.alertMessage = err.error.message;
                }
            );
        });
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
        if (this.artist.name && this.artist.description) {
            this._route.params.forEach((params: Params) => {
                let id = params['id'];

                this._artistService.editArtist(this.token, id, this.artist).subscribe(
                    response => {
                        if (!response.artist) {
                            this.alertMessage = 'Error en el servidor';
                        } else {
                            this.alertMessage = 'El artista se ha actualizado correctamente';

                            if (!this.filesToUpload) {
                                this._router.navigate(['/artistas', 1]);
                            } else {
                                //subir la imágen del artista
                                this._uploadService.makeFileRequest(this.url + 'upload-image-artist/' + id, [], this.filesToUpload, this.token, 'image')
                                    .then(
                                        (result) => {
                                            //para que nos lleve a la primera página de artistas
                                            this._router.navigate(['/artistas', 1]);
                                        },
                                        (error) => {
                                            console.log(error);
                                        }
                                    );
                            }
                        }
                    },
                    err =>{
                        this.alertMessage = err.error.message;
                    }
                )
            });
        }
    }

    public filesToUpload: Array<File>;

    fileChangeEvent(fileInput: any) {
        this.filesToUpload = <Array<File>> fileInput.target.files;
    }

}
