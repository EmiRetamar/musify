import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { GLOBAL } from '../services/global';
import { Album } from '../models/album';
import { Gender } from '../models/gender';
import { AlbumService } from '../services/album.service';
import { GenderService } from '../services/gender.service';

@Component({
    selector: 'album-list',
    templateUrl: '../views/album-list.html',
    providers: [ UserService, AlbumService, GenderService ]
})

export class AlbumListComponent implements OnInit {

    public titulo: string;
    public albums: Album[];
    public genders: Gender[];
    public token;
    public identity;
    public url: string;
    public cantCheckeds: number = 0;
    public checked: boolean[] = new Array();
    public albumsByArtist = new Array();
    public filteredAlbums = new Array();

    constructor(
        private _router: Router,
        private _userService: UserService,
        private _albumService: AlbumService,
        private _genderService: GenderService
    ) {
        this.titulo = 'Albumes';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
    }

    ngOnInit() {
        console.log('album-list.component.ts cargando');

        this.getAlbums();
        this.getGenders();
    }

    getAlbums() {
        this._albumService.getAlbums(this.token).subscribe(
            response => {
                if (!response.albums) {
                    this._router.navigate(['/']);
                } else {
                    this.albums = response.albums;
                    this.getAlbumsByArtist();
                    // En "albumsByArtist" se guarda el total de items y en "filteredAlbums" solo los filtrados
                    this.filteredAlbums = this.albumsByArtist;
                }
            },
            err => {
                console.log(err.error.message);
            }
        );
    }

    getGenders() {
        this._genderService.getGenders(this.token).subscribe(
            response => {
                if (!response.genders) {
                    console.log('Aun no hay generos musicales disponibles');
                } else {
                    this.genders = response.genders;
                    this.initializeCheckeds();
                }
            },
            err => {
                console.log(err.error.message);
            }
        );
    }

    /* Esta funcion devuelve un array de objetos, donde cada objeto contiene los datos de un artista
    en concreto y un array con todos sus albumes */
    getAlbumsByArtist() {
        let currentArtist = null;
        let indexArtist = -1;
        let indexAlbum;
        for (let album of this.albums) {
            if (currentArtist == null || currentArtist != (<any> album.artist)._id) {
                currentArtist = (<any> album.artist)._id;
                indexArtist++;
                this.albumsByArtist[indexArtist] = {
                    _id: (<any> album.artist)._id,
                    nameArtist: (<any> album.artist).name,
                    description: (<any> album.artist).description,
                    image: (<any> album.artist).image,
                    idGender: (<any> album.artist).gender._id,
                    gender: (<any> album.artist).gender.name,
                    albums: new Array()
                }
                indexAlbum = 0;
            }
            (this.albumsByArtist[indexArtist]).albums[indexAlbum] = album;
            indexAlbum++;
        }
    }

    initializeCheckeds() {
        for (let gender of this.genders) {
            this.checked[gender._id] = false;
        }
    }

    filterByGender(event) {
        let idGender = event.srcElement.value;
		if (event.target.checked) {
            this.checked[idGender] = true;
            this.cantCheckeds++;
		}
		else {
            this.checked[idGender] = false;
            this.cantCheckeds--;
            if (this.cantCheckeds == 0) {
                this.filteredAlbums = this.albumsByArtist;
                this.ngOnInit();
            }
        }
        this.filter();
    }

    /* No se puede recorrer el array "this.checked" con for of ni con forEach porque tiene indices que contienen
    caracteres no numericos. Ejemplo: '5d5c4fb9687ea68facec3e3e'. Estos indices son los ids de los generos */

    /*reloadItems() {
        for (let checked of this.checked) {
            console.log(checked);
        }
        return false;
    }*/

    filter() {
        this.filteredAlbums = this.albumsByArtist.filter(artist => this.checked[artist.idGender]);
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
                }

                this.getAlbums();
            },
            err => {
                alert('No se pudo eliminar el album');
                console.log(err.error.message);
            }
        );
    }

}
