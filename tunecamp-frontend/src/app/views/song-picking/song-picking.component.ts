import { Component, OnInit } from '@angular/core';
import { SearchedSong } from 'src/app/models/searched-song';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-song-picking',
  templateUrl: './song-picking.component.html',
  styleUrls: ['./song-picking.component.scss']
})
export class SongPickingComponent implements OnInit{

  pickedSongs: SearchedSong[] = [];
  constructor(private apiService: ApiService) {}

  ngOnInit() {
    if (this.apiService.firstPickedSong) {
      this.pickedSongs.push(this.apiService.firstPickedSong);
    }
  }

  songPicked(song: SearchedSong): void {
    this.pickedSongs.push(song);
  }
}
