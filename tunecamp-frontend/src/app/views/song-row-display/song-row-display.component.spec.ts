import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SongRowDisplayComponent } from './song-row-display.component';

describe('SongRowDisplayComponent', () => {
  let component: SongRowDisplayComponent;
  let fixture: ComponentFixture<SongRowDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SongRowDisplayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SongRowDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
