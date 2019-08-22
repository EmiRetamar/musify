import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../services/user.service';
import { GLOBAL } from '../services/global';
import { AlbumService } from '../services/album.service';
import { PlayerService } from '../services/player.service';
import { Album } from '../models/album';
import { Song } from '../models/song';
import { SongService } from '../services/song.service';

@Component({
    selector: 'album-detail',
    templateUrl: '../views/album-detail.html',
    providers: [ UserService, AlbumService, SongService, PlayerService ]
})

export class AlbumDetailComponent implements OnInit {

    public album: Album;
    public token;
    public identity;
    public url: string;
    public alertMessage;
    public songs: Song[];

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _albumService: AlbumService,
        private _songService: SongService,
        private _playerService: PlayerService
    ) {
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
    }

    ngOnInit() {
        console.log('album-detail.component.ts cargando');

        //llamar al método del api para sacar un album en base a su id
        this.getAlbum();
    }

    getAlbum() {
        this._route.params.forEach((params: Params) => {
            let id = params['id'];

            this._albumService.getAlbum(this.token, id).subscribe(
                response => {
                    if (!response.album) {
                        this._router.navigate(['/']);
                    } else {
                        this.album = response.album;

                        //sacar las canciones del artista
                        this._songService.getSongs(this.token, this.album._id).subscribe(
                            response => {
                                if (!response.songs) {
                                    this.alertMessage = 'Este album no tiene canciones';
                                } else {
                                    this.songs = response.songs;
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

    onCancelSong() {
        this.confirmado = null;
    }

    onDeleteSong(id) {
        this._songService.deleteSong(this.token, id).subscribe(
            response => {
                if (!response.song) {
                    alert('Error en el servidor');
                } else {
                    this.getAlbum();
                }
            },
            err => {
                alert('No se pudo eliminar la cancion');
                console.log(err.error.message);
            }
        );
    }

    startPlayer(song) {
		this._playerService.play(song);
	}

}
