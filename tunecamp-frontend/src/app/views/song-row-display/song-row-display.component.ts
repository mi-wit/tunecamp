import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SearchedSong } from 'src/app/models/searched-song';

@Component({
  selector: 'app-song-row-display',
  templateUrl: './song-row-display.component.html',
  styleUrls: ['./song-row-display.component.scss']
})
export class SongRowDisplayComponent {
  @Input()
  song: SearchedSong | undefined;

  @Output()
  removeSongClicked: EventEmitter<SearchedSong> = new EventEmitter();
  @Input()
  showRemoveButton: boolean = false;

  removeButtonClick(song: SearchedSong): void {
    this.removeSongClicked.emit(song);
  }
}
