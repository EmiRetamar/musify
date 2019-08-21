import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './components/home.component';
import { SearchComponent } from './components/search.component';
//import user
import { UserEditComponent } from './components/user-edit.component';
//import artist
import { ArtistListComponent } from './components/artist-list.component';
import { ArtistAddComponent } from './components/artist-add.component';
import { ArtistEditComponent } from './components/artist-edit.component';
import { ArtistDetailComponent } from './components/artist-detail.component';
//import album
import { AlbumAddComponent } from './components/album-add.component';
import { AlbumEditComponent } from './components/album-edit.component';
import { AlbumDetailComponent } from './components/album-detail.component';
import { AlbumListComponent } from './components/album-list.component';
//import song
import { SongAddComponent } from './components/song-add.component';
import { SongEditComponent } from './components/song-edit.component';
//import player
import { PlayerComponent } from './components/player.component';
//import gender
import { GenderListComponent } from './components/gender-list.component';
import { GenderFormComponent } from './components/gender-form.component';

//un array con todas las configuraciones
const appRoutes: Routes =[
    /*{
        path: '',
        redirectTo: '/artists/1',
        pathMatch: 'full'
    },*/
    //componente cargado por defecto, vacio
    { path: '', component: HomeComponent },
    { path: 'search', component: SearchComponent },
    { path: 'artistas/:page', component: ArtistListComponent },
    { path: 'crear-artista', component: ArtistAddComponent },
    { path: 'editar-artista/:id', component: ArtistEditComponent },
    { path: 'artista/:id', component: ArtistDetailComponent },
    { path: 'crear-album/:artist', component: AlbumAddComponent },
    { path: 'editar-album/:id', component: AlbumEditComponent },
    { path: 'album/:id', component: AlbumDetailComponent },
    { path: 'crear-tema/:album', component: SongAddComponent },
    { path: 'editar-tema/:id', component: SongEditComponent },
    { path: 'albumes', component: AlbumListComponent },
    { path: 'generos', component: GenderListComponent },
    { path: 'crear-genero', component: GenderFormComponent },
    { path: 'editar-genero/:id', component: GenderFormComponent },
    { path: 'mis-datos', component: UserEditComponent },
    //cuando no se introduce una ruta valida
    { path: '**', component: HomeComponent }
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
