import { Component, inject } from '@angular/core';
import {VgCoreModule, VgApiService} from '@videogular/ngx-videogular/core';
import {VgControlsModule} from '@videogular/ngx-videogular/controls';
import {VgOverlayPlayModule} from '@videogular/ngx-videogular/overlay-play';
import {VgBufferingModule} from '@videogular/ngx-videogular/buffering';
import { ActivatedRoute, RouterLink, RouterModule } from '@angular/router';
import { MovieService } from '../services/movie.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-videoplayer',
  imports: [
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
  ],
  templateUrl: './videoplayer.component.html',
  styleUrl: './videoplayer.component.scss'
})
export class VideoplayerComponent {
  preload: string = 'auto';
  api: VgApiService = new VgApiService;
  movieService: MovieService = inject(MovieService);
  videoSrc: string = '';
  router: Router = inject(Router);

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.videoSrc = this.movieService.movieSrc;
    if (!this.videoSrc) {
      this.router.navigate(['movie-dashboard']);
    }
  }

  onPlayerReady(source: VgApiService) {
    this.api = source;
    this.api.getDefaultMedia().subscriptions.loadedMetadata.subscribe(
      this.autoplay.bind(this)
    )
  }

  autoplay() {
    this.api.play();
  }

}
