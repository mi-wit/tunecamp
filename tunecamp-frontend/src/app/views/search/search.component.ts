import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { catchError, debounceTime, distinctUntilChanged, map, Observable, of, skip, startWith, switchMap, takeUntil } from 'rxjs';
import { SearchedSong, Tracks } from 'src/app/models/searched-song';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {
  @Output()
  songPicked: EventEmitter<SearchedSong> = new EventEmitter();

  
  searchField = new FormControl('');
  filteredOptions: Observable<SearchedSong[]> | undefined;
  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.filteredOptions = this.searchField.valueChanges.pipe(
      autocomplete(500, ((searchTerm: any) => this.apiService.getSearch(searchTerm))),
      map((tracks: Tracks) => tracks.items));
  }

  onTrackPick(song: SearchedSong): void {
    this.songPicked.emit(song);    
  }
}

const autocomplete = (time: number, selector: any) => (source$: any) =>
  source$.pipe(
    debounceTime(time),
    distinctUntilChanged(),
    switchMap((...args: any[]) => 
      selector(...args)
        .pipe(
            takeUntil(
                source$
                    .pipe(
                        skip(1)
                    )
            )
        )
    )
  )