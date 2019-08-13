import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {UserService} from '../services/user.service';
import {GLOBAL} from '../services/global';
import {Artist} from '../models/artist';
import {AlbumService} from '../services/album.service';
import {UploadService} from '../services/upload.service';
import {Album} from '../models/album';

@Component({
    selector: 'artist-edit',
    templateUrl: '../views/album-add.html',
    providers: [UserService, AlbumService, UploadService]
})

export class AlbumEditComponent implements OnInit{
    public titulo: string;
    public album: Album;
    public token;
    public identity;
    public url: string;
    public alertMessage;
    public is_edit;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _albumService: AlbumService,
        private _uploadService: UploadService
    ){
        this.titulo = 'Editar album';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.album = new Album('', '', 2017, '', '', '');
        this.is_edit = true;
    }

    ngOnInit(){
        console.log('album-edit.component.ts cargado');

        //conseguir el album
        this.getAlbum();
    }

    getAlbum(){
        this._route.params.forEach((params:Params) =>{
            let id = params['id'];

            this._albumService.getAlbum(this.token, id).subscribe(
                response =>{
                    if(!response.album){
                        this._router.navigate(['/']);
                    }else{
                        //this.alertMessage = 'El album se ha creado correctamente';
                        this.album = response.album; 
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
            );
        });
    }

    onSubmit(){
        this._route.params.forEach((params:Params) =>{
            let id = params['id'];

            //this.album.artist = artist_id;
            //console.log(this.album);

            this._albumService.editAlbum(this.token, id, this.album).subscribe(
                response =>{
                    if(!response.album){
                        this.alertMessage = 'Error en el servidor';
                    }else{
                        this.alertMessage = 'El album se ha actualizado correctamente';
                        //this.album = response.album; 
                        //this._router.navigate(['/editar-artista'], response.artist.id);

                        if(!this.filesToUpload){
                            //redirigir
                            this._router.navigate(['/artista', response.album.artist]);
                        }else{
                        //subir la imágen
                            this._uploadService.makeFileRequest(this.url + 'upload-image-album/' + id, [], this.filesToUpload, this.token, 'image')
                            .then(
                                (result) =>{
                                    //para que nos lleve a la primera página de artistas
                                    this._router.navigate(['/artista', response.album.artist]);
                                }, 
                                (error) =>{
                                    console.log(error);
                                }
                            );
                        }
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
            );
        });
    }

    public filesToUpload: Array<File>;

    fileChangeEvent(fileInput: any){
        this.filesToUpload = <Array<File>>fileInput.target.files;
    }
}