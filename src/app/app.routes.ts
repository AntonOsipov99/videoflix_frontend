import { Routes } from '@angular/router';
import { StartPageComponent } from './start-page/start-page.component';
import { MovieDashboardComponent } from './movie-dashboard/movie-dashboard.component';
import { VideoplayerComponent } from './videoplayer/videoplayer.component';
import { authGuard, alreadyAuthGuard } from './auth.guard';
import { ActivateAccountComponent } from './activate-account/activate-account.component';
import { ForgotPasswordComponent } from './start-page/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './start-page/reset-password/reset-password.component';
import { ImpressumComponent } from './impressum/impressum.component';
import { DatenschutzComponent } from './datenschutz/datenschutz.component';

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
    {
        path: 'activate/:key',
        component: ActivateAccountComponent
    },
    {
        path: 'forgot-password',
        component: ForgotPasswordComponent
    },
    {
        path: 'reset-password/:token',
        component: ResetPasswordComponent
    },
    {
        path: 'impressum',
        component: ImpressumComponent
    },
    {
        path: 'datenschutz',
        component: DatenschutzComponent
    }
];
