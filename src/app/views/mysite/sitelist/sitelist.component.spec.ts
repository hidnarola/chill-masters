import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { SitelistComponent } from "./sitelist.component";

describe("SitelistComponent", () => {
  let component: SitelistComponent;
  let fixture: ComponentFixture<SitelistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SitelistComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SitelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
