import { Component, Input } from '@angular/core';
import { SearchedSong } from 'src/app/models/searched-song';

@Component({
  selector: 'app-song-row-display',
  templateUrl: './song-row-display.component.html',
  styleUrls: ['./song-row-display.component.scss']
})
export class SongRowDisplayComponent {
  @Input()
  song: SearchedSong | undefined;
}
