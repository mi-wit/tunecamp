import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of } from 'rxjs';
import { environment } from 'src/environment';
import { RecommendedSong } from '../models/recommended-song';
import { SearchedSong, SearchedSongResponse, Tracks } from '../models/searched-song';
import { Song } from '../models/Song';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  firstPickedSong: SearchedSong | null = null;
  pickedSongs: SearchedSong[] = [];

  constructor(private http: HttpClient) { }

  getRecommendations(inputSongs: Song[]): Observable<SearchedSong[]> {
    return this.http.post<any>(`${environment.config.api.url}/api/recommend`, inputSongs)
    .pipe(map(response => {
      return response.body.tracks;
    }));
  }

  getSearch(term: string): Observable<Tracks> {    
    return this.http.get<SearchedSongResponse>(`${environment.config.api.url}/api/search?q=${term}`)
    .pipe(
      map((result: SearchedSongResponse) => {
        if (result.statusCode === 200) {
          return result.body.tracks;
        } else {
          let empty: Tracks = {
            href: "",
            items: [],
            limit: 0,
            next: '',
            offset: 0,
            previous: '',
            total: 0
          };
          return empty;
        }
      }),
      );

  }
}
