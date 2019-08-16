//cargar modulos de angular
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
//importar el servicio y el modelo
import { UserService } from '../services/user.service';
import { User } from '../models/user';
import { GLOBAL } from '../services/global';

//indicamos el componente y sus datos
@Component({
    selector: 'user-edit',
    templateUrl: '../views/user-edit.html',
    providers: [ UserService ]
})

export class UserEditComponent implements OnInit {

    public titulo: string;
    public user: User;
    public identity;
    public token;
    public alertMessage;
    public url:string;
    public editUserForm: FormGroup;
    public submitted = false;

    constructor(
        private _userService: UserService,
        private formBuilder: FormBuilder
    ) {
        this.titulo = 'Actualizar mis datos';
        //localStorage
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.user = this.identity;
        this.url = GLOBAL.url;
    }

    ngOnInit() {
        //estas dos lineas se pueden poner tambien en el constructor
        /*this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();*/
        console.log('user-edit.component.ts cargado');

        this.editUserForm = this.formBuilder.group({
            name: ['', [Validators.required]],
            surname: ['', [Validators.required]],
            email: ['', [Validators.required]]
        });
    }

    get form() {
        return this.editUserForm.controls;
    }

    onSubmit() {
        this.submitted = true;
        if (this.user.name && this.user.surname && this.user.email) {
            this._userService.updateUser(this.user).subscribe(
                response => {
                    if (!response.user) {
                        this.alertMessage = 'El usuario no se ha actualizado';
                    } else {
                        localStorage.setItem('identity', JSON.stringify(this.user));
                        //mediante javascript modificamos el nombre del usuario
                        //sin que tengamos que actualizar la página
                        document.getElementById("identity_name").innerHTML = this.user.name;
                        this.alertMessage = 'Usuario actualizado correctamente';

                        //subir la imagen
                        if (!this.filesToUpload) {
                            //redirección
                        } else {
                            this.makeFileRequest(this.url + 'upload-image-user/' + this.user._id, [], this.filesToUpload).then(
                                (result: any) => {
                                    this.user.image = result.image;
                                    localStorage.setItem('identity', JSON.stringify(this.user));

                                    //console.log(this.user);
                                    //mediante javascript modificamos la imágen del usuario
                                    //sin que tengamos que actualizar la página
                                    let image_path = this.url + 'get-image-user/' + this.user.image;
                                    document.getElementById("image-logged").setAttribute('src', image_path);
                                }
                            );
                        }
                    }
                },
                err => {
                    this.alertMessage = err.error.message;
                }
            );
        }
    }

    public filesToUpload: Array<File>;
    //método de subir imagen
    fileChangeEvent(fileInput: any) {
        //recojer los archivos que se pasan por input
        this.filesToUpload = <Array<File>>fileInput.target.files;
    }

    makeFileRequest(url: string, params: Array<string>, file: Array<File>) {
        //pasar el token del usu identificado
        var token = this.token;

        return new Promise(function(resolve, reject) {
            var formData: any = new FormData();
            var xhr = new XMLHttpRequest();

            //recorrer los ficheros para subirlos
            for (var i = 0; i < file.length; i++) {
                formData.append('image', file[i], file[i].name);
            }

            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        resolve(JSON.parse(xhr.response));
                    } else {
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
