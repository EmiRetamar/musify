import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { ArtistService } from '../services/artist.service';
import { AlbumService } from '../services/album.service';
import { SongService } from '../services/song.service';
import { PlayerService } from '../services/player.service';
import { GLOBAL } from '../services/global';
import { Artist } from '../models/artist';
import { Album } from '../models/album';
import { Song } from '../models/song';

@Component({
	selector: 'search',
	templateUrl: '../views/search.html',
	styles: [],
	providers: [ UserService, ArtistService, AlbumService, SongService, PlayerService ]
})

export class SearchComponent implements OnInit {

	public artists: Artist[];
	public albums: Album[];
	public songs: Song[];
	public token;
    public identity;
	public url: string;
	public text: string;
	public alertMessageArtists;
	public alertMessageAlbums;
	public alertMessageSongs;

  	constructor(
		private _userService: UserService,
		private _artistService: ArtistService,
		private _albumService: AlbumService,
		private _songService: SongService,
		private _playerService: PlayerService
	) {
		this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
	}

	ngOnInit() {
        console.log('search.component.ts cargando');
    }

	search(text: string) {
		this.text = text;
		this._artistService.searchArtists(this.token, text).subscribe(
			response => {

				if (!response.artists)
					this.alertMessageArtists = 'No se encontraron coincidencias para los artistas';
				else
					this.artists = response.artists;

				this._albumService.searchAlbums(this.token, text).subscribe(
					response => {

						if (!response.albums)
							this.alertMessageAlbums = 'No se encontraron coincidencias para los albumes';
						else
							this.albums = response.albums;

						this._songService.searchSongs(this.token, text).subscribe(
							response => {

								if (!response.songs)
									this.alertMessageSongs = 'No se encontraron coincidencias para las canciones';
								else
									this.songs = response.songs;
							},
							err => {
								console.log(err.error.message);
							}
						);
					},
					err => {
						console.log(err.error.message);
					}
				);
			},
			err => {
				console.log(err.error.message);
			}
		);
	}

	getItemsSortedAsc() {
		if (this.artists) {
			/* No es necesario setear el valor devuelto por la funcion a "this.artists"
			ya que se esta pasando como parametro una referencia al objeto. Lo dejo asi solo por legibilidad */
			this.artists = this.sortAsc(this.artists);
		}
		if (this.albums) {
			/* No es necesario setear el valor devuelto por la funcion a "this.albums"
			ya que se esta pasando como parametro una referencia al objeto. Lo dejo asi solo por legibilidad */
			this.albums = this.sortAsc(this.albums);
		}
		if (this.songs) {
			/* No es necesario setear el valor devuelto por la funcion a "this.songs"
			ya que se esta pasando como parametro una referencia al objeto. Lo dejo asi solo por legibilidad */
			this.songs = this.sortAsc(this.songs);
		}
	}

	getItemsSortedDesc() {
		if (this.artists) {
			/* No es necesario setear el valor devuelto por la funcion a "this.artists"
			ya que se esta pasando como parametro una referencia al objeto. Lo dejo asi solo por legibilidad */
			this.artists = this.sortDesc(this.artists);
		}
		if (this.albums) {
			/* No es necesario setear el valor devuelto por la funcion a "this.albums"
			ya que se esta pasando como parametro una referencia al objeto. Lo dejo asi solo por legibilidad */
			this.albums = this.sortDesc(this.albums);
		}
		if (this.songs) {
			/* No es necesario setear el valor devuelto por la funcion a "this.songs"
			ya que se esta pasando como parametro una referencia al objeto. Lo dejo asi solo por legibilidad */
			this.songs = this.sortDesc(this.songs);
		}
	}

	sortAsc(items): any {
		items.sort((a, b) => {
			// Si se recibe una coleccion de artistas o canciones
			if (a.name && b.name) {
				// Si la funcion anonima devuelve un numero mayor que 0, se sitúa "b" en un indice menor que "a".
				if (a.name.toLowerCase() > b.name.toLowerCase()) {
					return 1;
				}
				// Si la funcion anonima devuelve un numero menor que 0, se sitúa "a" en un indice menor que "b"
				if (a.name.toLowerCase() < b.name.toLowerCase()) {
					return -1;
				}
				// Si "a" es igual a "b" devuelve 0
				return 0;
			}
			// Si se recibe una coleccion de albumes
			else if (a.title && b.title) {
				// Si la funcion anonima devuelve un numero mayor que 0, se sitúa "b" en un indice menor que "a".
				if (a.title.toLowerCase() > b.title.toLowerCase()) {
					return 1;
				}
				// Si la funcion anonima devuelve un numero menor que 0, se sitúa "a" en un indice menor que "b"
				if (a.title.toLowerCase() < b.title.toLowerCase()) {
					return -1;
				}
				// Si "a" es igual a "b" devuelve 0
				return 0;
			}
		});

		return items;
	}

	sortDesc(items): any {
		items.sort((a, b) => {
			// Si se recibe una coleccion de artistas o canciones
			if (a.name && b.name) {
				// Si la funcion anonima devuelve un numero mayor que 0, se sitúa "b" en un indice menor que "a".
				if (a.name.toLowerCase() < b.name.toLowerCase()) {
					return 1;
				}
				// Si la funcion anonima devuelve un numero menor que 0, se sitúa "a" en un indice menor que "b"
				if (a.name.toLowerCase() > b.name.toLowerCase()) {
					return -1;
				}
				// Si "a" es igual a "b" devuelve 0
				return 0;
			}
			// Si se recibe una coleccion de albumes
			else if (a.title && b.title) {
				// Si la funcion anonima devuelve un numero mayor que 0, se sitúa "b" en un indice menor que "a".
				if (a.title.toLowerCase() < b.title.toLowerCase()) {
					return 1;
				}
				// Si la funcion anonima devuelve un numero menor que 0, se sitúa "a" en un indice menor que "b"
				if (a.title.toLowerCase() > b.title.toLowerCase()) {
					return -1;
				}
				// Si "a" es igual a "b" devuelve 0
				return 0;
			}
		});

		return items;
	}

	startPlayer(song) {
		this._playerService.play(song);
	}

	public confirmadoArtist;

    onDeleteConfirmArtist(id) {
        this.confirmadoArtist = id;
    }

    onCancelArtist() {
        this.confirmadoArtist = null;
    }

    onDeleteArtist(id) {
        this._artistService.deleteArtist(this.token, id).subscribe(
            response => {
                if (!response.artist) {
                    alert('Error en el servidor');
                }

                this.search(this.text);
            },
            err => {
                alert('No se pudo eliminar el artista');
                console.log(err.error.message);
            }
        );
	}

	public confirmadoAlbum;

    onDeleteConfirmAlbum(id) {
        this.confirmadoAlbum = id;
    }

    onCancelAlbum() {
        this.confirmadoAlbum = null;
    }

    onDeleteAlbum(id) {
        this._albumService.deleteAlbum(this.token, id).subscribe(
            response => {
                if (!response.album) {
                    alert('Error en el servidor');
                }

                this.search(this.text);
            },
            err => {
                alert('No se pudo eliminar el album');
                console.log(err.error.message);
            }
        );
	}

	public confirmadoSong;

    onDeleteConfirmSong(id) {
        this.confirmadoSong = id;
    }

    onCancelSong() {
        this.confirmadoSong = null;
    }

    onDeleteSong(id) {
        this._songService.deleteSong(this.token, id).subscribe(
            response => {
                if (!response.song) {
                    alert('Error en el servidor');
                } else {
                    this.search(this.text);
                }
            },
            err => {
                alert('No se pudo eliminar la cancion');
                console.log(err.error.message);
            }
        );
    }

}
