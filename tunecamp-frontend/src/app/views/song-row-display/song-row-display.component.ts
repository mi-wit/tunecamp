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

  @Output()
  musicButtonClicked: EventEmitter<SearchedSong> = new EventEmitter();
  @Input()
  showPlaybackButton: boolean = false;

  @Input()
  previewTime: number = 100;
  @Input()
  showPreviewSpinner: boolean = false;
  @Output()
  stopPlaybackClicked: EventEmitter<SearchedSong> = new EventEmitter();

  removeButtonClick(song: SearchedSong): void {
    this.removeSongClicked.emit(song);
  }

  playbackButtonClicked(song: SearchedSong): void {
    this.musicButtonClicked.emit(song);
  }

  stopPlaybackButtonClicked(song: SearchedSong): void {
    this.stopPlaybackClicked.emit(song);
  }
}
