import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Song } from './models/Song';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  inputSongs = [
    { 'name': 'Everything In Its Right Place', 'year': 2000 },
    { 'name': 'Smells Like Teen Spirit', 'year': 1991 },
    { 'name': 'Optimistic', 'year': 2000 },
    { 'name': 'Karma Police', 'year': 1997 },
    { 'name': 'No Surprises', 'year': 1997 },
    { 'name': 'Song that does not exist', 'year': 1800 },
    { 'name': 'You Will Never Work In Television Again', 'year': 2022 },
    { 'name': 'We Don\'t Know What Tomorrow Brings', 'year': 2022 },
  ];
  recommendations = [];
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  constructor(private api: ApiService) {}
  
  ngOnInit(): void {
    this.api.getRecommendations(this.inputSongs)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (recommendations: any) => {this.recommendations = recommendations},
        error: (e) => console.error(e)
      });
  }
  
  
  ngOnDestroy(): void
  {
      // Unsubscribe from all subscriptions
      this._unsubscribeAll.next(null);
      this._unsubscribeAll.complete();
  }
}
