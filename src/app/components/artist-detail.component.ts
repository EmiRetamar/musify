import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../services/user.service';
import { GLOBAL } from '../services/global';
import { Artist } from '../models/artist';
import { ArtistService } from '../services/artist.service';
import { AlbumService } from '../services/album.service';
import { Album } from '../models/album';

@Component({
    selector: 'artist-detail',
    templateUrl: '../views/artist-detail.html',
    providers: [ UserService, ArtistService, AlbumService ]
})

export class ArtistDetailComponent implements OnInit {

    public artist: Artist;
    public token;
    public identity;
    public url: string;
    public alertMessage;
    public albums: Album[];

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _artistService: ArtistService,
        private _albumService: AlbumService
    ) {
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
    }

    ngOnInit() {
        console.log('artist-edit.component.ts cargando');

        //llamar al método del api para sacar un artista en base a su id
        this.getArtist();
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

                        //sacar los albums del artista
                        this._albumService.getAlbums(this.token, this.artist._id).subscribe(
                            response => {
                                if (!response.albums) {
                                    this.alertMessage = 'Este artista no tiene albums';
                                } else {
                                    this.albums = response.albums;
                                }
                            },
                            err => {
                                this.alertMessage = err.error.message;
                            }
                        );
                    }
                },
                err => {
                    this.alertMessage = err.error.message;
                }
            );
        });
    }

    public confirmado;

    onDeleteConfirm(id) {
        this.confirmado = id;
    }

    onCancelAlbum() {
        this.confirmado = null;
    }

    onDeleteAlbum(id) {
        this._albumService.deleteAlbum(this.token, id).subscribe(
            response => {
                if (!response.album) {
                    alert('Error en el servidor');
                } else {
                    this.getArtist();
                }
            },
            err => {
                this.alertMessage = err.error.message;
            }
        );
    }

}
