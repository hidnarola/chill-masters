import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { InstallationDetailComponent } from "./installation-detail.component";

describe("InstallationDetailComponent", () => {
  let component: InstallationDetailComponent;
  let fixture: ComponentFixture<InstallationDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InstallationDetailComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstallationDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
