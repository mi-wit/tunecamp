import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SongPickingComponent } from './song-picking.component';

describe('SongPickingComponent', () => {
  let component: SongPickingComponent;
  let fixture: ComponentFixture<SongPickingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SongPickingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SongPickingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
