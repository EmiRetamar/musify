import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../services/user.service';
import { UploadService } from '../services/upload.service';
import { SongService } from '../services/song.service';
import { GLOBAL } from '../services/global';
import { Song } from '../models/song';

@Component({
    selector: 'song-edit',
    templateUrl: '../views/song-add.html',
    providers: [ UserService, SongService, UploadService ]
})

export class SongEditComponent implements OnInit {

    public titulo: string;
    public song: Song;
    public token;
    public identity;
    public url: string;
    public alertMessage;
    public is_edit;
    public songForm: FormGroup;
    public submitted = false;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _songService: SongService,
        private _uploadService: UploadService,
        private formBuilder: FormBuilder
    ) {
        this.titulo = 'Editar canción';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.song = new Song('', 1, '', '', '', '');
        this.is_edit = true;
    }

    ngOnInit() {
        console.log('song-add.component.ts cargado');

        //sacar la canción a editar
        this.getSong();

        this.songForm = this.formBuilder.group({
            number: ['', [Validators.required]],
            name: ['', [Validators.required]],
            duration: ['', [Validators.required]]
        });
    }

    get form() {
        return this.songForm.controls;
    }

    getSong() {
        this._route.params.forEach((params:Params) =>{
            let id = params['id'];

            this._songService.getSong(this.token, id).subscribe(
                response => {
                    if (!response.song) {
                        this._router.navigate(['/']);
                    } else {
                        this.song = response.song;
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
        if (this.song.number && this.song.name && this.song.duration) {
            this._route.params.forEach((params: Params) => {
                let id = params['id'];

                this._songService.editSong(this.token, id, this.song).subscribe(
                    response => {
                        if (!response.song) {
                            this.alertMessage = 'Error en el servidor';
                        } else {
                            this.alertMessage = 'La canción se ha actualizado correctamente';

                            if (!this.filesToUpload) {
                                this._router.navigate(['/album', response.song.album]);
                            } else {
                                //subir el fichero de audio
                                this._uploadService.makeFileRequest(this.url + 'upload-file-song/' + id, [], this.filesToUpload, this.token, 'file')
                                .then(
                                    (result) => {
                                        //para que nos lleve a detalle del album
                                        this._router.navigate(['/album', response.song.album]);
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

    public filesToUpload;

    fileChangeEvent(fileInput: any) {
        this.filesToUpload = <Array<File>> fileInput.target.files;
    }

}
