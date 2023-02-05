import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environment';
import { Song } from '../models/Song';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  getRecommendations(inputSongs: Song[]): Observable<Song[]> {
    return this.http.post<Song[]>(`${environment.config.api.url}/api/recommend`, inputSongs);
  }
}
