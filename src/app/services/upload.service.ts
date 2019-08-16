//importamos los servicios
import { Injectable } from '@angular/core';
import { GLOBAL } from './global';

//creamos el servicio del usuario
@Injectable()
export class UploadService {

    public url: string;

    //asignamos un valor a la url creando un constructor
    constructor() {
        //asignamos un valor a la url
        this.url = GLOBAL.url;
    }

    //subir ficheros
    makeFileRequest(url: string, params: Array<string>, file: Array<File>, token: string, name: string) {

        return new Promise(function(resolve, reject) {
            let formData: any = new FormData();
            let xhr = new XMLHttpRequest();

            //recorrer los ficheros para subirlos
            for (let i = 0; i < file.length; i++) {
                formData.append(name, file[i], file[i].name);
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
