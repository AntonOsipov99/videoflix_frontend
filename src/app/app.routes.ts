import { Routes } from '@angular/router';
import { StartPageComponent } from './start-page/start-page.component';
import { MovieDashboardComponent } from './movie-dashboard/movie-dashboard.component';

export const routes: Routes = [
    { path: '', component: StartPageComponent },
    { path: 'movie-dashboard', component: MovieDashboardComponent },
];
