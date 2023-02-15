import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { WelcomePageComponent } from './views/welcome-page/welcome-page.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { SearchComponent } from './views/search/search.component'; 
import {MatFormFieldModule} from '@angular/material/form-field'; 
import {MatInputModule} from '@angular/material/input'; 
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner'; 
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SongPickingComponent } from './views/song-picking/song-picking.component';
import { RouterModule } from '@angular/router';
import { SongRowDisplayComponent } from './views/song-row-display/song-row-display.component';
import { RecommendationsComponent } from './views/recommendations/recommendations.component';
import {MatIconModule} from '@angular/material/icon'; 

@NgModule({
  declarations: [
    AppComponent,
    WelcomePageComponent,
    SearchComponent,
    SongPickingComponent,
    SongRowDisplayComponent,
    RecommendationsComponent
  ],
  imports: [
    RouterModule.forRoot([
      {path: 'welcome-page', component: WelcomePageComponent},
      {path: 'song-picking', component: SongPickingComponent},
      {path: 'recommendations', component: RecommendationsComponent},
      {path: '', redirectTo: 'welcome-page', pathMatch: 'full'},
      {path: '**', redirectTo: 'welcome-page', pathMatch: 'full'},
    ]),
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatSlideToggleModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
