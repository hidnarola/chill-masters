import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RestoreFridgeComponent } from './restore-fridge.component';

describe('RestoreFridgeComponent', () => {
  let component: RestoreFridgeComponent;
  let fixture: ComponentFixture<RestoreFridgeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RestoreFridgeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RestoreFridgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
