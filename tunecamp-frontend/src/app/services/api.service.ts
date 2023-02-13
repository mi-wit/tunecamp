import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { environment } from 'src/environment';
import { SearchedSong, SearchedSongResponse, Tracks } from '../models/searched-song';
import { Song } from '../models/Song';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  // searchTerm$ = new BehaviorSubject<string>('');

  constructor(private http: HttpClient) { }

  getRecommendations(inputSongs: Song[]): Observable<Song[]> {
    return this.http.post<Song[]>(`${environment.config.api.url}/api/recommend`, inputSongs);
  }

  getSearch(term: string): Observable<Tracks> {
    return this.http.get<SearchedSongResponse>(`${environment.config.api.url}/api/search?q=${term}`)
    .pipe(map((result: SearchedSongResponse) => {
      console.log(result);
      
      return result.body.tracks;
    }));

  }
}
