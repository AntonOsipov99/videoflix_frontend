import { Routes } from '@angular/router';
import { StartPageComponent } from './start-page/start-page.component';
import { MovieDashboardComponent } from './movie-dashboard/movie-dashboard.component';
import { VideoplayerComponent } from './videoplayer/videoplayer.component';
import { authGuard, alreadyAuthGuard } from './auth.guard';

export const routes: Routes = [
    { 
        path: '',
        component: StartPageComponent,
        canActivate: [() => alreadyAuthGuard()]
    },
    { 
        path: 'videoplayer',
        component: VideoplayerComponent,
        canActivate: [() => authGuard()]
    },
    { 
        path: 'movie-dashboard',
        component: MovieDashboardComponent,
        canActivate: [() => authGuard()]
    },
    { path: '**', redirectTo: ''}
];
