import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../services/user.service';
import { GLOBAL } from '../services/global';
import { AlbumService } from '../services/album.service';
import { UploadService } from '../services/upload.service';
import { Album } from '../models/album';

@Component({
    selector: 'artist-edit',
    templateUrl: '../views/album-add.html',
    providers: [ UserService, AlbumService, UploadService ]
})

export class AlbumEditComponent implements OnInit {

    public titulo: string;
    public album: Album;
    public token;
    public identity;
    public url: string;
    public alertMessage;
    public is_edit;
    public albumForm: FormGroup;
    public submitted = false;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _albumService: AlbumService,
        private _uploadService: UploadService,
        private formBuilder: FormBuilder
    ) {
        this.titulo = 'Editar album';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.album = new Album('', '', '', 2017, '', '');
        this.is_edit = true;
    }

    ngOnInit() {
        console.log('album-edit.component.ts cargado');

        //conseguir el album
        this.getAlbum();

        this.albumForm = this.formBuilder.group({
            title: ['', [Validators.required]],
            description: ['', [Validators.required]],
            year: ['', [Validators.required]]
        });
    }

    get form() {
        return this.albumForm.controls;
    }

    getAlbum() {
        this._route.params.forEach((params:Params) => {
            let id = params['id'];

            this._albumService.getAlbum(this.token, id).subscribe(
                response => {
                    if (!response.album) {
                        this._router.navigate(['/']);
                    } else {
                        this.album = response.album;
                    }
                },
                err => {
                    this.alertMessage = err.error.message;
                }
            );
        });
    }

    onSubmit() {
        this.submitted = true;
        if (this.album.title && this.album.description && this.album.year) {
            this._route.params.forEach((params: Params) => {
                let id = params['id'];

                this._albumService.editAlbum(this.token, id, this.album).subscribe(
                    response => {
                        if (!response.album) {
                            this.alertMessage = 'Error en el servidor';
                        } else {
                            this.alertMessage = 'El album se ha actualizado correctamente';

                            if (!this.filesToUpload) {
                                this._router.navigate(['/artista', response.album.artist]);
                            } else {
                                //subir la imágen
                                this._uploadService.makeFileRequest(this.url + 'upload-image-album/' + id, [], this.filesToUpload, this.token, 'image')
                                .then(
                                    (result) => {
                                        //para que nos lleve al detalle del artista
                                        this._router.navigate(['/artista', response.album.artist]);
                                    },
                                    (error) => {
                                        console.log(error);
                                    }
                                );
                            }
                        }
                    },
                    err => {
                        this.alertMessage = err.error.message;
                    }
                );
            });
        }
    }

    public filesToUpload: Array<File>;

    fileChangeEvent(fileInput: any) {
        this.filesToUpload = <Array<File>> fileInput.target.files;
    }

}
