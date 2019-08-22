import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../services/user.service';
import { SongService } from '../services/song.service';
import { GLOBAL } from '../services/global';
import { Song } from '../models/song';

@Component({
    selector: 'song-add',
    templateUrl: '../views/song-add.html',
    providers: [ UserService, SongService ]
})

export class SongAddComponent implements OnInit {

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
        private formBuilder: FormBuilder
    ) {
        this.titulo = 'Crear nueva canción';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.song = new Song('', 1, '', '', '', '');
        this.is_edit = false;
    }

    ngOnInit() {
        console.log('song-add.component.ts cargado');

        this.songForm = this.formBuilder.group({
            number: ['', [Validators.required]],
            name: ['', [Validators.required]],
            duration: ['', [Validators.required]]
        });
    }

    get form() {
        return this.songForm.controls;
    }

    onSubmit() {
        this.submitted = true;
        if (this.song.number && this.song.name && this.song.duration) {
            this._route.params.forEach((params: Params) => {
                let albumId = params['album'];
                this.song.album = albumId;

                this._songService.addSong(this.token, this.song).subscribe(
                    response => {
                        if (!response.song) {
                            this.alertMessage = 'Error en el servidor';
                        } else {
                            this.alertMessage = 'La canción se ha creado correctamente';
                            this.song = response.song;
                            this._router.navigate(['/editar-tema', this.song._id]);
                        }
                    },
                    err => {
                        this.alertMessage = err.error.message;
                    }
                );
            });
        }
    }

    fileChangeEvent(fileInput) { }

}
