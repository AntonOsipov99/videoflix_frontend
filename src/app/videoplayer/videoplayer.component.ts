import { Component, inject, OnInit } from '@angular/core';
import { VgCoreModule, VgApiService } from '@videogular/ngx-videogular/core';
import { VgControlsModule } from '@videogular/ngx-videogular/controls';
import { VgOverlayPlayModule } from '@videogular/ngx-videogular/overlay-play';
import { VgBufferingModule } from '@videogular/ngx-videogular/buffering';
import { MovieService } from '../services/movie.service';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { ToastrModule } from 'ngx-toastr';
import Hls from 'hls.js';

@Component({
  selector: 'app-videoplayer',
  imports: [
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
    CommonModule,
    ToastrModule,
    RouterLink
  ],
  templateUrl: './videoplayer.component.html',
  styleUrl: './videoplayer.component.scss'
})
export class VideoplayerComponent implements OnInit {
  private _currentQuality: string = 'auto';
  availableQualities: string[] = ['1080p', '720p', '360p', '120p'];
  qualityMenuVisible: boolean = false;
  api!: VgApiService;
  hls: Hls | null = null;
  initialQuality: string | null = null;

  constructor(
    public movieService: MovieService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    if (!this.movieService.movieSrc) {
      this.router.navigate(['movie-dashboard']);
      return;
    }
    this.loadAvailableQualities();
    this.loadSavedQuality();
    this.initializePlayer();
  }

  loadAvailableQualities() {
    if (!this.movieService.currentMovie?.available_resolutions) return;
    const resolutions = [...this.movieService.currentMovie.available_resolutions];
    resolutions.sort((a, b) => parseInt(b.replace('p', '')) - parseInt(a.replace('p', '')));
    this.availableQualities = resolutions;
  }

  loadSavedQuality() {
    const savedQuality = localStorage.getItem('preferredQuality');
    if (savedQuality && this.availableQualities.includes(savedQuality)) {
      this._currentQuality = savedQuality;
    } else {
      this.autoSelectQuality();
    }
  }

  initializePlayer() {
    if (this.isHlsUrl(this.movieService.movieSrc)) {
      this.setupHlsPlayer();
    } else if (this._currentQuality !== 'auto') {
      this.initialQuality = this._currentQuality;
    }
  }

  onPlayerReady(api: VgApiService) {
    this.api = api;
    if (this.isHlsUrl(this.movieService.movieSrc) && Hls.isSupported()) {
      const videoElement = document.getElementById('singleVideo') as HTMLVideoElement;
      if (videoElement) {
        const hls = new Hls();
        hls.loadSource(this.movieService.movieSrc);
        hls.attachMedia(videoElement);
      }
    }
    if (this._currentQuality !== 'auto') {
      this.changeQuality(this._currentQuality, false);
    }
    this.api.getDefaultMedia().subscriptions.canPlay.subscribe(() => {
      this.api.play();
    });
  }

  isHlsUrl(url: string): boolean {
    return url.includes('.m3u8');
  }

  get currentQuality(): string {
    return this._currentQuality;
  }

  formatQualityForDisplay(quality: string): string {
    return quality === 'auto' ? 'Auto' : quality;
  }

  toggleQualityMenu() {
    this.qualityMenuVisible = !this.qualityMenuVisible;
  }

  autoSelectQuality() {
    const height = window.innerHeight;
    if (height >= 1080 && this.availableQualities.includes('1080p')) {
      this._currentQuality = '1080p';
    } else if (height >= 720 && this.availableQualities.includes('720p')) {
      this._currentQuality = '720p';
    } else if (height >= 360 && this.availableQualities.includes('360p')) {
      this._currentQuality = '360p';
    } else {
      this._currentQuality = '120p';
    }
    localStorage.setItem('preferredQuality', this._currentQuality);
  }

  seekTime(seconds: number): void {
    if (!this.api) return;
    const media = this.api.getDefaultMedia();
    if (!media) return;
    const currentTime = this.api.currentTime;
    const duration = this.api.duration;
    let newTime = currentTime + seconds;
    if (newTime < 0) {
      newTime = 0;
    } else if (newTime > duration) {
      newTime = duration;
    }
    this.api.currentTime = newTime;
    const direction = seconds > 0 ? 'forward' : 'backward';
    const absoluteSeconds = Math.abs(seconds);
    this.toastr.info(`Skipped ${direction} ${absoluteSeconds} seconds`);
  }

  private isPlaying(): boolean {
    if (!this.api) return false;
    const media = this.api.getDefaultMedia();
    return media ? media.state === 'playing' : false;
  }

  changeQuality(quality: string, showToast: boolean = true) {
    if (quality === this._currentQuality) {
      this.qualityMenuVisible = false;
      return;
    }
    const wasPlaying = this.isPlaying();
    const currentTime = this.api?.currentTime || 0;
    this.api?.pause();
    this._currentQuality = quality;
    localStorage.setItem('preferredQuality', quality);
    if (this.isHlsUrl(this.movieService.movieSrc)) {
      this.applyHlsQuality(quality, wasPlaying, currentTime);
    } else {
      this.changeDirectMp4Quality(quality, currentTime, wasPlaying);
    }
    if (showToast) {
      this.toastr.info(`Video quality changed to ${this.formatQualityForDisplay(quality)}`);
    }
    this.qualityMenuVisible = false;
  }

  applyHlsQuality(quality: string, resumePlayback: boolean = false, currentTime: number = 0) {
    if (!this.hls) return; 
    const savedTime = currentTime;
    const shouldResume = resumePlayback;
    if (quality === 'auto') {
      this.setHlsLevelAndLoad(-1, currentTime, shouldResume, savedTime);
    } else {
      const height = parseInt(quality.replace('p', ''));
      const levelIndex = this.hls.levels.findIndex((level: any) => 
        level.height === height);  
      if (levelIndex !== -1) {
        this.setHlsLevelAndLoad(levelIndex, currentTime, shouldResume, savedTime);
      }
    }
  }

  private setHlsLevelAndLoad(level: number, currentTime: number, shouldResume: boolean, savedTime: number): void {
    this.hls!.currentLevel = level;
    this.hls!.startLoad(Math.floor(currentTime));
    this.hls!.once(Hls.Events.FRAG_LOADED, () => {
      this.resumeVideoIfNeeded(shouldResume, savedTime);
    });
  }

  private resumeVideoIfNeeded(resumePlayback: boolean, currentTime: number): void {
    if (this.api) {
      this.api.currentTime = currentTime;
      if (resumePlayback) {
        this.api.play();
      }
    }
  }

  changeDirectMp4Quality(quality: string, currentTime: number, resumePlayback: boolean = false) {
    const currentSource = this.movieService.movieSrc;
    let newSource = currentSource;
    if (quality !== 'auto') {
      newSource = this.getQualitySpecificUrl(currentSource, quality);
    }
    this.updateVideoSource(newSource, currentTime, resumePlayback);
  }

  getQualitySpecificUrl(masterUrl: string, quality: string): string {
    if (masterUrl.includes('master.m3u8')) {
      return masterUrl.replace('master.m3u8', `${quality}/playlist.m3u8`);
    }
    const urlParts = masterUrl.split('/');
    const filename = urlParts.pop() || '';
    const baseUrl = urlParts.join('/');
    if (!this.movieService.currentMovie?.id) return masterUrl;
    const id = this.movieService.currentMovie.id;
    const filenameParts = filename.split('.');
    const extension = filenameParts.pop() || 'mp4';
    const baseName = filenameParts.join('.');
    return `${baseUrl}/${id}/${baseName}_${quality}.${extension}`;
  }

  updateVideoSource(src: string, startTime: number = 0, resumePlayback: boolean = false) {
    this.movieService.movieSrc = src;
    setTimeout(() => {
      if (this.api) {
        this.api.getDefaultMedia().subscriptions.canPlay.subscribe(() => {
          this.api.currentTime = startTime;
          if (resumePlayback) {
            this.api.play();
          }
        });
        this.api.pause();
        this.api.getDefaultMedia().currentTime = 0;
      }
    }, 0);
  }

  setupHlsPlayer() {
    if (!this.isHlsUrl(this.movieService.movieSrc)) return;
    if (!Hls.isSupported()) return;
    setTimeout(() => {
      const videoElement = document.getElementById('singleVideo') as HTMLVideoElement;
      if (!videoElement) return;
      this.hls = new Hls({capLevelToPlayerSize: true, startLevel: -1, maxBufferLength: 30, maxMaxBufferLength: 60, fragLoadingTimeOut: 4000});
      this.hls.loadSource(this.movieService.movieSrc);
      this.hls.attachMedia(videoElement);
      this.setupHlsQualityListeners();
    }, 0);
  }

  setupHlsQualityListeners() {
    if (!this.hls) return;
    this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
      if (this._currentQuality !== 'auto' && this.hls) {
        this.applyHlsQuality(this._currentQuality);
      }
    });
  }
}