import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../services/user.service';
import { GLOBAL } from '../services/global';
import { Artist } from '../models/artist';
import { AlbumService } from '../services/album.service';
import { Album } from '../models/album';

@Component({
    selector: 'artist-add',
    templateUrl: '../views/album-add.html',
    providers: [ UserService, AlbumService ]
})

export class AlbumAddComponent implements OnInit {

    public titulo: string;
    public artist: Artist;
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
        private formBuilder: FormBuilder
    ) {
        this.titulo = 'Crear nuevo album';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.album = new Album('', '', '', 2017, '', '');
        this.is_edit = true;
    }

    ngOnInit() {
        console.log('album-add.component.ts cargado');

        this.albumForm = this.formBuilder.group({
            title: ['', [Validators.required]],
            description: ['', [Validators.required]],
            year: ['', [Validators.required]]
        });
    }

    get form() {
        return this.albumForm.controls;
    }

    onSubmit() {
        this.submitted = true;
        if (this.album.title && this.album.description && this.album.year) {
            this._route.params.forEach((params: Params) => {
                let artist_id = params['artist'];
                this.album.artist = artist_id;

                this._albumService.addAlbum(this.token, this.album).subscribe(
                    response => {
                        if (!response.album) {
                            this.alertMessage = 'Error en el servidor';
                        } else {
                            this.alertMessage = 'El album se ha creado correctamente';
                            this.album = response.album;
                            this._router.navigate(['/editar-album', this.album._id]);
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
