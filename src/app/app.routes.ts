import { Routes } from '@angular/router';
import { StartPageComponent } from './start-page/start-page.component';
import { MovieDashboardComponent } from './movie-dashboard/movie-dashboard.component';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authGuard = () => {
    const router = inject(Router);

    if (!localStorage.getItem('token')) {
        router.navigate(['']);
        return false;
    }

    return true;
};

export const routes: Routes = [
    { path: '', component: StartPageComponent },
    { 
        path: 'movie-dashboard',
        component: MovieDashboardComponent,
        canActivate: [() => authGuard()]
    },
    { path: '**', redirectTo: ''}
];
