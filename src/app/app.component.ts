import { Component, OnInit, NgModule, OnDestroy } from "@angular/core";
import { Router, NavigationEnd, ActivatedRoute } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { filter, map } from "rxjs/operators";
import { Subscription } from "rxjs";

@Component({
  // tslint:disable-next-line
  selector: "body",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private titleService: Title
  ) {}

  ngOnInit() {
    this.router.events.subscribe(evt => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        const rt = this.getChild(this.activatedRoute);

        rt.data.subscribe(data => {
          console.log(data);
          this.titleService.setTitle(data.title);
        });
      });
  }

  getChild(activatedRoute: ActivatedRoute) {
    if (activatedRoute.firstChild) {
      return this.getChild(activatedRoute.firstChild);
    } else {
      return activatedRoute;
    }
  }
}
