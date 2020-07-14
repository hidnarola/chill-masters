import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { AddInstallationComponent } from "./add-installation.component";

describe("AddInstallationComponent", () => {
  let component: AddInstallationComponent;
  let fixture: ComponentFixture<AddInstallationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddInstallationComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddInstallationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
