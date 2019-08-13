//cargar modulos de angular
import {Component, OnInit} from '@angular/core';
//importar el servicio y el modelo
import {UserService} from '../services/user.service';
import {User} from '../models/user';
import {GLOBAL} from '../services/global';

//indicamos el componente y sus datos
@Component({
    selector: 'user-edit',
    templateUrl: '../views/user-edit.html',
    providers: [UserService]
})

export class UserEditComponent implements OnInit{
    public titulo: string;
    public user: User;
    public identity;
    public token;
    public alertMessage;
    public url:string;

    constructor(
        private _userService: UserService
    ){
        this.titulo = 'Actualizar mis datos';
        //localStorage
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.user = this.identity;
        this.url = GLOBAL.url;
    }

    ngOnInit(){
        //estas dos lineas se pueden poner tambien en el constructor
        /*this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();*/
        console.log('user-edit.component.ts cargado')
    }

    onSubmit(){
        //console.log(this.user);

        this._userService.updateUser(this.user).subscribe(
            response =>{
                this.user = response.user;

                if(!response.user){
                    this.alertMessage = 'El usuario no se ha actualizado';
                }else{
                    //this.user = response.user;
                    localStorage.setItem('identity', JSON.stringify(this.user));
                    //mediante java script modificamos el nombre del usuario
                    //sin que tengamos que actualizar la página
                    document.getElementById("identity_name").innerHTML = this.user.name;
                    this.alertMessage = 'Usuario actualizado correctamente';

                    //subir la imagen
                    if(!this.filesToUpload){
                        //redirección
                    }else{
                        this.makeFileRequest(this.url + 'upload-image-user' + this.user.id, [], this.filesToUpload).then(
                            (result: any) =>{
                                this.user.image = result.image;
                                localStorage.setItem('identity', JSON.stringify(this.user));

                                //console.log(this.user);
                                //mediante java script modificamos la imágen del usuario
                                //sin que tengamos que actualizar la página
                                let image_path = this.url + 'get-image-user/' + this.user.image;
                                document.getElementById("iimage-logged").setAttribute('src', image_path);
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
    }

    public filesToUpload: Array<File>;
    //método de subir imagen 
    fileChangeEvent(fileInput: any){
        //recojer los archivos que se pasan por input
        this.filesToUpload = <Array<File>>fileInput.target.files;
    }

    makeFileRequest(url: string, params: Array<string>, file: Array<File>){
        //pasar el token del usu identificado
        var token = this.token;

        return new Promise(function(resolve, reject){
            var formData: any = new FormData();
            var xhr = new XMLHttpRequest();

            //recorrer los ficheros para subirlos
            for(var i = 0; i < file.length; i++){
                formData.append('image', file[i], file[i].name);
            }

            xhr.onreadystatechange = function(){
                if(xhr.readyState == 4){
                    if(xhr.status == 200){
                        resolve(JSON.parse(xhr.response));
                    }else{
                        reject(xhr.response);
                    }
                }
            }

            //lazar la petición
            xhr.open('POST', url, true);
            xhr.setRequestHeader('Authorization', token);
            xhr.send(formData);
        });
    }
}