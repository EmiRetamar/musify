//importamos los servicios
import { Injectable } from '@angular/core';
import { GLOBAL } from './global';

//creamos el servicio del usuario
@Injectable()
export class PlayerService {

    public url: string;

    //asignamos un valor a la url creando un constructor
    constructor() {
        //asignamos un valor a la url
        this.url = GLOBAL.url;
    }

    play(song) {
        //convertir el objeto song en string de json para tener en sesión la canción
        let song_player = JSON.stringify(song);
        //para guardar la canción
        let file_path = this.url + 'get-file-song/' + song.file;
        //para guardar la imágen del album
        let image_path = this.url + 'get-image-album/' + song.album.image;

        //para guardar el localStorage la canción que esta sonando
        localStorage.setItem('sound_song', song_player);

        //cambiar los valores del reproductor
        document.getElementById("mp3-source").setAttribute("src", file_path);
        //usamos etiquetas de html5
        (document.getElementById("player") as any).load();
        (document.getElementById("player") as any).play();

        //para mostrar el nombre del artista y de la canción
        document.getElementById('play-song-title').innerHTML = song.name;
        document.getElementById('play-song-artist').innerHTML = song.album.artist.name;
        document.getElementById('play-image-album').setAttribute('src', image_path);
    }

}
