import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { RestoreInstallationComponent } from "./restore-installation.component";

describe("RestoreInstallationComponent", () => {
  let component: RestoreInstallationComponent;
  let fixture: ComponentFixture<RestoreInstallationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RestoreInstallationComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RestoreInstallationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
