import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FridgeDetailComponent } from './fridge-detail.component';

describe('FridgeDetailComponent', () => {
  let component: FridgeDetailComponent;
  let fixture: ComponentFixture<FridgeDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FridgeDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FridgeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
