import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

//import user
import {UserEditComponent} from './components/user-edit.component';
//import artist
import {ArtistListComponent} from './components/artist-list.component';
import {HomeComponent} from './components/home.component';
//add artist
import {ArtistAddComponent} from './components/artist-add.component';
import {ArtistEditComponent} from './components/artist-edit.component';
import {ArtistDetailComponent} from './components/artist-detail.component';
//imort albums
import {AlbumAddComponent} from './components/album-add.component';
import {AlbumEditComponent} from './components/album-edit.component';
import {AlbumDetailComponent} from './components/album-detail.component';
//import song
import {SongAddComponent} from './components/song-add.component';
import {SongEditComponent} from './components/song-edit.component';
//import {PlayerComponent} from './components/player.component';

//un array con todas las configuraciones
const appRoutes: Routes =[
    /*{
        path: '',
        redirectTo: '/artists/1',
        pathMatch: 'full'
    },*/
    //componente cargado por defecto, vacio
    {path: '', component: HomeComponent},
    {path: 'artistas/:page', component: ArtistListComponent},
    {path: 'crear-artistas', component: ArtistAddComponent},
    {path: 'editar-artistas', component: ArtistEditComponent},
    {path: 'artista/:id', component: ArtistDetailComponent},
    {path: 'crear-album/:artist', component: AlbumAddComponent},
    {path: 'editar-album/:id', component: AlbumEditComponent},
    {path: 'album/:id', component: AlbumDetailComponent},
    {path: 'crear-tema/:album', component: SongAddComponent},
    {path: 'editar-tema/:id', component: SongEditComponent},
    {path: 'mis-datos', component: UserEditComponent},
    //cuando no se introduce una ruta valida
    {path: '**', component: HomeComponent}
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);