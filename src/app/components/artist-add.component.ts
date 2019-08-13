import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {UserService} from '../services/user.service';
import {GLOBAL} from '../services/global';
import {Artist} from '../models/artist';
import {ArtistService} from '../services/artist-service';

@Component({
    selector: 'artist-add',
    templateUrl: '../views/artist-add.html',
    providers: [UserService, ArtistService]
})

export class ArtistAddComponent implements OnInit{
    public titulo: string;
    public artist: Artist;
    public token;
    public identity;
    public url: string;
    public alertMessage;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _artistService: ArtistService
    ){
        this.titulo = 'Crear nuevo artista';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.artist = new Artist('', '', '');
    }

    ngOnInit(){
        console.log('artist-add.component.ts cargando');

        //comprobar que funciona el add artist
        //this._artistService.addArtist();
    }

    onSubmit(){
        this._artistService.addArtist(this.token, this.artist).subscribe(
            response =>{
                if(!response.artist){
                    this.alertMessage = 'Error en el servidor';
                }else{
                    this.alertMessage = 'El artista se ha creado correctamente';
                    this.artist = response.artist; 
                    //this._router.navigate(['/editar-artista'], response.artist.id);
                }
            },
            error =>{
                var errorMessage = <any>error;
                
                if(errorMessage != null){
                    //convertimos en obj json
                    var body = JSON.parse(error._body);
        
                    this.alertMessage = body.message;
                    console.log(error);
                }
            }
        )
    }
}