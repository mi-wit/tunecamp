import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { RecommendedSong } from 'src/app/models/recommended-song';
import { SearchedSong } from 'src/app/models/searched-song';
import { ApiService } from 'src/app/services/api.service';
import { Song } from '../../models/Song';


@Component({
  selector: 'app-recommendations',
  templateUrl: './recommendations.component.html',
  styleUrls: ['./recommendations.component.scss']
})
export class RecommendationsComponent implements OnInit{

  recommendations: Observable<RecommendedSong[]> | null = null;
  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    const inputSongs = this.apiService.pickedSongs;
    if (inputSongs.length <= 0) {
      this.router.navigate(['/song-picking']);
    }

    const trimmedSongs: Song[] = inputSongs.map((song: SearchedSong) => {
      return {
        name: song.name,
        year: new Date(song.album.release_date).getFullYear()
      };
    });

    this.recommendations = this.apiService.getRecommendations(trimmedSongs);

  }
}
