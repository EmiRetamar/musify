import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {UserService} from '../services/user.service';
import {UploadService} from '../services/upload.service';
import {SongService} from '../services/song.service';
import {GLOBAL} from '../services/global';
import {Song} from '../models/song';

@Component({
    selector: 'song-edit',
    templateUrl: '../views/song-add.html',
    providers: [UserService, SongService, UploadService]
})

export class SongEditComponent implements OnInit{
    public titulo: string;
    public song: Song;
    public token;
    public identity;
    public url: string;
    public alertMessage;
    public is_edit;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _songService: SongService,
        private _uploadService: UploadService
    ){
        this.titulo = 'Editar canción';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.song = new Song(1, '', '', '', '');
        this.is_edit = true;
    }

    ngOnInit(){
        console.log('song-add.component.ts cargado');

        //sacar la canción a editar
        this.getSong();
    }

    onSubmit(){
        this._route.params.forEach((params:Params) =>{
            let id = params['id'];

            //this.song.album = albumId;
            //console.log(this.album);

            this._songService.editSong(this.token, id, this.song).subscribe(
                response =>{
                    if(!response.song){
                        this.alertMessage = 'Error en el servidor';
                    }else{
                        this.alertMessage = 'La canción se ha actualizado correctamente';
                        
                        //this.song = response.song; 
                        //this._router.navigate(['/editar-album'], response.album.id);

                        if(!this.filesToUpload){
                            this._router.navigate(['/album', response.song.album]);
                        }else{
                            //subir el fichero de autio
                            //subir la imágen
                            this._uploadService.makeFileRequest(this.url + 'upload-file-song/' + id, [], this.filesToUpload, this.token, 'file')
                            .then(
                                (result) =>{
                                    //para que nos lleve a la primera página de artistas
                                    this._router.navigate(['/album', response.song.album]);
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

    public filesToUpload;

    fileChangeEvent(fileInput: any){
        this.filesToUpload = <Array<File>>fileInput.target.files;
    }

    getSong(){
        this._route.params.forEach((params:Params) =>{
            let id = params['id'];

            this._songService.getSong(this.token, id).subscribe(
                response =>{
                    if(!response.song){
                        this._router.navigate(['/']);
                    }else{
                        this.song = response.song;
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
}