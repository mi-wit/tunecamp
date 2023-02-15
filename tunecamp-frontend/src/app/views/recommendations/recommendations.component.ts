import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { fromEvent, Observable } from 'rxjs';
import { RecommendedSong } from 'src/app/models/recommended-song';
import { SearchedSong } from 'src/app/models/searched-song';
import { ApiService } from 'src/app/services/api.service';
import { Song } from '../../models/Song';


@Component({
  selector: 'app-recommendations',
  templateUrl: './recommendations.component.html',
  styleUrls: ['./recommendations.component.scss']
})
export class RecommendationsComponent implements OnInit, AfterViewInit {

  recommendations: Observable<SearchedSong[]> | null = null;
  loading: boolean = true;
  audio: HTMLAudioElement;
  previewTime: number = 100;
  playedSong: SearchedSong | null = null
  isPreviewPlaying: boolean = false;

  constructor(private apiService: ApiService, private router: Router) {
    this.audio = new Audio();
  }
  
  ngOnInit(): void {
    const inputSongs = this.apiService.pickedSongs;
    if (inputSongs.length <= 0) {
      this.router.navigate(['/song-picking']);
      this.loading = true;
    }

    const trimmedSongs: Song[] = inputSongs.map((song: SearchedSong) => {
      return {
        id: song.id,
        name: song.name,
        year: new Date(song.album.release_date).getFullYear()
      };
    });

    if (trimmedSongs.length > 0) {
      this.recommendations = this.apiService.getRecommendations(trimmedSongs);
    }
  }

  ngAfterViewInit(): void {
    fromEvent(this.audio, 'timeupdate').subscribe({
      next: (event: Event) => {
        this.previewTime = 100 - (this.audio.currentTime * 100 / this.audio.duration);
      }
    });
  }

  redirectToSongPicking(): void {
    if (this.audio) {
      this.audio.pause();
      this.isPreviewPlaying = false;
    }
    this.router.navigate(['/song-picking']);
  }

  playTrackSample(song: SearchedSong): void {
    if (song.preview_url) {
      this.playedSong = song;

      this.audio.src = song.preview_url;
      this.audio.load();
      this.audio.play(); 
      this.isPreviewPlaying = true;
    }
  }

  stopPlayback(song: SearchedSong): void {
    if (this.audio) {
      this.audio.pause();
      this.isPreviewPlaying = false;
    }
  }

}
