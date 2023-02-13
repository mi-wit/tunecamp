import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { SearchedSong } from 'src/app/models/searched-song';

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.scss'],
})
export class WelcomePageComponent {
  constructor(private router: Router) {
  }

  redirectToPicking(song: SearchedSong): void {
    this.router.navigate(['/song-picking']);
  }
}
