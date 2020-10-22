import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  HostListener,
} from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from "@angular/forms";
import { MySiteService } from "../../../services/mysite.service";
import { ToastrService } from "ngx-toastr";
import { NgxSpinnerService } from "ngx-spinner";
import { interval, Subscription } from "rxjs";
import * as Highcharts from "highcharts";
import StockModule from "highcharts/modules/stock";
StockModule(Highcharts);
import * as moment from "moment";
import exporting from "highcharts/modules/exporting";
exporting(Highcharts);
import HC_exportData from "highcharts/modules/export-data";
HC_exportData(Highcharts);
import _Highcharts from "highcharts/modules/offline-exporting";
_Highcharts(Highcharts);
import _ from "lodash";

@Component({
  selector: "app-site-overview",
  templateUrl: "./site-overview.component.html",
  styleUrls: ["./site-overview.component.css"],
})
export class SiteOverviewComponent implements OnInit, AfterViewInit, OnDestroy {
  // @HostListener("window:resize", ["$event"])
  form: FormGroup;
  site: any = [];
  permission: any;
  id: number;
  page: any;
  pagination: any;
  previous: any;
  next: any;
  selectedSitename: any;
  selectedSite = "";
  data: any = [];
  displayPage: boolean = true;
  subscription: Subscription;
  intervalId: number;
  initialAPICall = false;
  privious: string = null;
  current: string = null;
  priviousId: string = null;
  currentId: string = null;
  totalRow: any = [];
  finalData: any = [];
  divId: string = null;

  // chart
  formGraph: FormGroup;
  filterForm: FormGroup;
  isFormSubmitted = false;
  error: any = { isError: false, errorMessage: "" };
  isValidDate: any;
  site_id: any;
  installation_id: any;
  dateTime = new Date();
  dataGraph: any;
  site_name = "";
  installation_name = "";
  minRate: any;
  maxRate: any;
  average: any;
  graphDataLength: any = [];
  title = "highchart";
  convertedData: any = [];
  elevationData = [];
  toolTipData: any = [];
  chartCallback;
  Highcharts = Highcharts;
  updateFlag = false;
  screenWidth: number;
  divideBy: number;
  currentWidth: number;
  openGraph = false;
  annotationLineChart = {
    credits: false,
    exporting: {
      enabled: true,
    },
    chart: {
      zoomType: "x",
      type: "spline",
    },
    title: {
      text: "",
    },
    legend: {
      enabled: false,
    },
    xAxis: {
      type: "datetime",
      dateTimeLabelFormats: {
        month: "%e",
      },
      title: {
        text: "Time",
      },
    },
    yAxis: {
      min: this.minRate,
      max: this.maxRate,
      // tickInterval: 2,
      title: {
        text: "Temperature (°C)",
      },
      plotBands: [
        {
          from: -150,
          to: "",
          color: "#b3d9ff",
        },
        {
          from: "",
          to: 150,
          color: "#ffcccc",
        },
      ],
    },
    tooltip: {
      formatter: function () {
        return (
          "<b>" +
          " date: </b>" +
          moment(new Date(this.x)).format("YYYY-MM-DD HH:mm") +
          "<br> <b>Temperature: </b>" +
          this.y +
          "°C"
        );
      },
    },
    plotOptions: {
      series: {
        marker: {
          enabled: false,
        },
      },
    },
    fallbackToExportServer: false,
    colors: ["#00e673", "#00b359", "#008040", "#00331a", "#000"],
    series: [],
    responsive: {
      rules: [
        {
          condition: {
            // maxWidth: 500,
          },
          chartOptions: {
            plotOptions: {
              series: {
                marker: {
                  radius: 2.5,
                },
              },
            },
          },
        },
      ],
    },
  };

  constructor(
    private route: ActivatedRoute,
    private service: MySiteService,
    public fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {
    this.form = this.fb.group({
      site_name: new FormControl(""),
    });

    this.formGraph = this.fb.group({
      content: new FormControl(""),
      currenttemperature: new FormControl(""),
      currentbattery: new FormControl(""),
    });

    this.filterForm = this.fb.group({
      start_date: new FormControl("", Validators.required),
      end_date: new FormControl("", Validators.required),
    });
    this.screenWidth = window.innerWidth;
    this.currentWidth = this.screenWidth;
    if (this.screenWidth > 1338) {
      this.divideBy = 5;
    } else if (this.screenWidth > 1094 && this.screenWidth < 1339) {
      this.divideBy = 4;
    } else if (this.screenWidth < 1095 && this.screenWidth > 850) {
      this.divideBy = 3;
    } else if (this.screenWidth < 851 && this.screenWidth > 568) {
      this.divideBy = 2;
    } else {
      this.divideBy = 1;
    }
  }

  ngOnInit(): void {
    this.spinner.show();
    this.page = 1;
    this.sitelist();
    this.route.paramMap.subscribe((params: Params) => {
      this.id = params.get("id");
      if (this.id != null) {
        this.displaydata(this.page);
      } else {
        console.log("in else");
        setTimeout(() => {
          if (this.site.length > 0) {
            this.router.navigate([`/site/overview/` + this.site[0][`id`]]);
            this.displayPage = true;
          } else {
            this.displayPage = false;
          }
          this.spinner.hide();
        }, 1500);
      }
    });
  }

  displayGraph(site_id, installation_id) {
    this.spinner.show();
    const dateFrom = new Date(moment().subtract(6, "d").format("YYYY-MM-DD"));
    this.filterForm.controls[`start_date`].setValue(dateFrom);
    this.filterForm.controls[`end_date`].setValue(this.dateTime);

    this.spinner.hide();
    if (this.filterForm.valid) {
      const obj = {
        site_id: parseInt(site_id, 10),
        installation_id: parseInt(installation_id, 10),
        start_date: moment(this.filterForm.get("start_date").value)
          .utc()
          .set({ second: 0 })
          .format(),
        end_date: moment(this.filterForm.get("end_date").value)
          .utc()
          .set({ second: 0 })
          .format(),
      };

      this.service.installationDetail(obj).subscribe(
        (res) => {
          this.spinner.hide();
          this.dataGraph = res;
          console.log(this.dataGraph);
          this.minRate = this.dataGraph.minimum;
          this.maxRate = this.dataGraph.maximum;
          this.average = this.dataGraph.average;
          this.formGraph.controls[`content`].setValue(
            res[`installation_content`]
          );
          this.formGraph.controls[`currenttemperature`].setValue(
            res[`current_temperature`] + "°C"
          );
          if (res[`current_battery`] != null) {
            this.formGraph.controls[`currentbattery`].setValue(
              res[`current_battery`] + "%"
            );
          }
          this.permission = res[`permission`];
          this.graphDataLength = this.dataGraph[`graph`].length;

          this.site_name = res[`site_name`];
          this.installation_name = res[`installation_name`];
          this.annotationLineChart.yAxis.plotBands[0].to = this.dataGraph.storage_range_min;
          this.annotationLineChart.yAxis.plotBands[1].from = this.dataGraph.storage_range_max;
          this.annotationLineChart.title.text =
            this.site_name + " : " + this.installation_name;
          this.annotationLineChart.yAxis.max = this.maxRate + 0.5;
          this.annotationLineChart.yAxis.min = this.minRate - 0.5;

          if (res[`maximum`] < this.dataGraph.storage_range_max) {
            this.annotationLineChart.yAxis.max =
              this.dataGraph.storage_range_max + 0.5;
          }

          if (res[`minimum`] > this.dataGraph.storage_range_min) {
            this.annotationLineChart.yAxis.min =
              this.dataGraph.storage_range_min - 0.5;
          }

          this.annotationLineChart.series = this.dataGraph[`graph`];
          this.updateFlag = true;
        },
        (err) => {
          console.log(" : err ==> ", err);
          this.spinner.hide();
          if (err.error[`detail`]) {
            this.toastr.error(err.error[`detail`], "Error!", {
              timeOut: 3000,
            });
          } else if (err.error[`error`]) {
            this.toastr.error(err.error[`error`], "Error!", {
              timeOut: 3000,
            });
          }
        }
      );
    }
  }

  hideShow(i, id, siteId) {
    this.divId = "row" + i;
    this.currentId = id;
    this.site_id = siteId;
    this.installation_id = id;

    if (document.getElementById(this.divId).style.visibility === "hidden") {
      if (this.privious !== null) {
        document.getElementById(this.privious).style.visibility = "hidden";
        document.getElementById(this.privious).style.display = "none";
      }
      this.displayGraph(siteId, id);
      document.getElementById(this.divId).style.visibility = "visible";
      document.getElementById(this.divId).style.display = "block";
      this.privious = this.divId;
      this.priviousId = id;
      this.openGraph = true;
    } else if (this.currentId === this.priviousId) {
      document.getElementById(this.divId).style.visibility = "hidden";
      document.getElementById(this.divId).style.display = "none";
      this.privious = null;
      this.openGraph = false;
    } else {
      this.priviousId = id;
      this.displayGraph(siteId, id);
    }
  }

  sitelist() {
    this.service.mysite_list().subscribe(
      (res) => {
        const site = res;
        const siteList = [];
        if (site.length > 0) {
          for (const item of site) {
            siteList.push(item.site);
          }
          this.site = _.uniqBy(siteList, "site_name");
        } else {
          this.spinner.hide();
        }
      },
      (err) => {
        if (err.error[`detail`]) {
          this.toastr.error(err.error[`detail`], "Error!", {
            timeOut: 3000,
          });
        } else if (err.error[`error`]) {
          this.toastr.error(err.error[`error`], "Error!", {
            timeOut: 3000,
          });
        }
      }
    );
  }

  displaydata(page) {
    console.log(" : page ==> ", page);
    if (this.id) {
      console.log(" : this.id ==> ", this.id);
      if (!this.initialAPICall) {
        this.spinner.show();
      }
      const obj = {
        site_id: this.id,
        delete_status: false,
      };
      this.service.overviewList(obj, page).subscribe(
        (res) => {
          this.data = res[`installation_data`];
          const division = this.data.length / this.divideBy;
          let row;
          if (Number(division) === division && division % 1 !== 0) {
            row = Math.floor(division) + 1;
          } else {
            row = Math.floor(division);
          }
          for (let index = 0; index < row; index++) {
            console.log(" : index ==> ", index);
            this.totalRow.push(index);
          }
          let i,
            j,
            temparray,
            chunk = this.divideBy;
          console.log(" : chunk ==> ", chunk);
          this.finalData = [];
          for (i = 0, j = this.data.length; i < j; i += chunk) {
            temparray = this.data.slice(i, i + chunk);
            const obj = {};
            obj["row" + i] = temparray;
            this.finalData.push(obj);
            console.log(" : obj ==> ", this.finalData);
          }

          // console.log(" : this.totalRow ==> ", this.totalRow);
          //   const result = new Array(Math.ceil(this.data.length / 5))
          //     .fill()
          //     .map((_) => this.data.splice(0, 5));
          this.permission = res[`permission`];
          this.previous = res[`pagination`][`previous`];
          this.next = res[`pagination`][`next`];
          setTimeout(() => {
            this.selectedSitename = this.site.find((x) => x.id == this.id);
            this.selectedSite = this.selectedSitename[`site_name`];
          }, 500);
          if (!this.initialAPICall) {
            this.spinner.hide();
          }
          this.initialAPICall = true;
        },
        (err) => {
          console.log(err);
          this.spinner.hide();
          if (err.error[`detail`]) {
            this.toastr.error(err.error[`detail`], "Error!", {
              timeOut: 3000,
            });
          } else if (err.error[`error`]) {
            this.toastr.error(err.error[`error`], "Error!", {
              timeOut: 3000,
            });
          }
        }
      );
    }
  }

  onclick() {
    this.router.navigate(["/site/add_installation"], {
      queryParams: { site_id: this.id },
    });
  }

  getCode(e) {
    // this.spinner.show();
    this.router.navigate([`/site/overview/` + e.value.id]);
    setTimeout(() => {
      this.displaydata(this.page);
    }, 1000);
  }

  nextPage(url, id) {
    const obj = {
      site_id: parseInt(id),
      delete_status: false,
    };
    this.service.overviewListByPage(url, obj).subscribe(
      (res) => {
        this.data = res[`installation_data`];
        const division = this.data.length / this.divideBy;
        let row;
        if (Number(division) === division && division % 1 !== 0) {
          row = Math.floor(division) + 1;
        } else {
          row = Math.floor(division);
        }
        for (let index = 0; index < row; index++) {
          console.log(" : index ==> ", index);
          this.totalRow.push(index);
        }
        let i,
          j,
          temparray,
          chunk = this.divideBy;
        console.log(" : chunk ==> ", chunk);
        this.finalData = [];
        for (i = 0, j = this.data.length; i < j; i += chunk) {
          temparray = this.data.slice(i, i + chunk);
          const obj = {};
          obj["row" + i] = temparray;
          this.finalData.push(obj);
          console.log(" : obj ==> ", this.finalData);
        }

        this.previous = res[`pagination`][`previous`];
        this.next = res[`pagination`][`next`];
      },
      (err) => {
        console.log(" : err ==> ", err);
        if (err.error[`detail`]) {
          this.toastr.error(err.error[`detail`], "Error!", {
            timeOut: 3000,
          });
        } else if (err.error[`error`]) {
          this.toastr.error(err.error[`error`], "Error!", {
            timeOut: 3000,
          });
        }
      }
    );
  }

  previousPage(url, id) {
    const obj = {
      site_id: parseInt(id),
      delete_status: false,
    };
    this.service.overviewListByPage(url, obj).subscribe(
      (res) => {
        this.data = res[`installation_data`];
        const division = this.data.length / this.divideBy;
        let row;
        if (Number(division) === division && division % 1 !== 0) {
          row = Math.floor(division) + 1;
        } else {
          row = Math.floor(division);
        }
        for (let index = 0; index < row; index++) {
          console.log(" : index ==> ", index);
          this.totalRow.push(index);
        }
        let i,
          j,
          temparray,
          chunk = this.divideBy;
        console.log(" : chunk ==> ", chunk);
        this.finalData = [];
        for (i = 0, j = this.data.length; i < j; i += chunk) {
          temparray = this.data.slice(i, i + chunk);
          const obj = {};
          obj["row" + i] = temparray;
          this.finalData.push(obj);
          console.log(" : obj ==> ", this.finalData);
        }
        this.previous = res[`pagination`][`previous`];
        this.next = res[`pagination`][`next`];
      },
      (err) => {
        console.log(" : err ==> ", err);
        if (err.error[`detail`]) {
          this.toastr.error(err.error[`detail`], "Error!", {
            timeOut: 3000,
          });
        } else if (err.error[`error`]) {
          this.toastr.error(err.error[`error`], "Error!", {
            timeOut: 3000,
          });
        }
      }
    );
  }

  onSubmit(valid) {
    this.isFormSubmitted = true;
    if (valid) {
      const StartDate = moment(this.filterForm.get("start_date").value);
      const EndDate = moment(this.filterForm.get("end_date").value);

      // this.isValidDate = this.validateDates(StartDate, EndDate);

      this.spinner.show();
      const obj = {
        site_id: parseInt(this.site_id, 10),
        installation_id: parseInt(this.installation_id, 10),
        start_date: moment(this.filterForm.get("start_date").value)
          .utc()
          .set({ second: 0 })
          .format(),
        end_date: moment(this.filterForm.get("end_date").value)
          .utc()
          .set({ second: 0 })
          .format(),
      };

      this.service.installationDetail(obj).subscribe(
        (res) => {
          this.spinner.hide();

          this.dataGraph = res;
          this.minRate = this.dataGraph.minimum;
          this.maxRate = this.dataGraph.maximum;
          this.average = this.dataGraph.average;
          this.formGraph.controls[`content`].setValue(
            res[`installation_content`]
          );
          this.formGraph.controls[`currenttemperature`].setValue(
            res[`current_temperature`] + "°C"
          );
          if (res[`current_battery`] != null) {
            this.formGraph.controls[`currentbattery`].setValue(
              res[`current_battery`] + "%"
            );
          }
          this.permission = res[`permission`];
          this.graphDataLength = this.dataGraph[`graph`].length;
          this.site_name = res[`site_name`];
          this.installation_name = res[`installation_name`];
          this.annotationLineChart.yAxis.plotBands[0].to = this.dataGraph.storage_range_min;
          this.annotationLineChart.yAxis.plotBands[1].from = this.dataGraph.storage_range_max;
          this.annotationLineChart.title.text =
            this.site_name + " : " + this.installation_name;

          this.annotationLineChart.yAxis.max = this.maxRate + 0.5;
          this.annotationLineChart.yAxis.min = this.minRate - 0.5;

          if (res[`maximum`] <= this.dataGraph.storage_range_max) {
            this.annotationLineChart.yAxis.max =
              this.dataGraph.storage_range_max + 0.5;
          }

          if (res[`minimum`] >= this.dataGraph.storage_range_min) {
            this.annotationLineChart.yAxis.min =
              this.dataGraph.storage_range_min - 0.5;
          }
          this.annotationLineChart.series = this.dataGraph[`graph`];
          this.updateFlag = true;
        },
        (err) => {
          console.log(" : err ==> ", err);
          this.spinner.hide();
          if (err.error[`detail`]) {
            this.toastr.error(err.error[`detail`], "Error!", {
              timeOut: 3000,
            });
          } else if (err.error[`error`]) {
            this.toastr.error(err.error[`error`], "Error!", {
              timeOut: 3000,
            });
          }
        }
      );
    }
  }
  onResize(event) {
    this.screenWidth = event.target.innerWidth;
    let inNumberWidth;
    setTimeout(() => {
      if (this.openGraph === true) {
        const divId = document.getElementById("highchart").children[0].id;
        const divWidth = document.getElementById(divId).style.width;
        inNumberWidth = parseInt(divWidth.substring(0, divWidth.length - 2));
      } else {
        inNumberWidth = 0;
      }

      console.log(" : inNumberWidth ==> ", inNumberWidth);
      if (inNumberWidth !== 1366) {
        this.currentWidth = this.screenWidth;
        if (this.screenWidth > 1338) {
          this.divideBy = 5;
        } else if (this.screenWidth > 1094 && this.screenWidth < 1339) {
          this.divideBy = 4;
        } else if (this.screenWidth < 1095 && this.screenWidth > 850) {
          this.divideBy = 3;
        } else if (this.screenWidth < 851 && this.screenWidth > 568) {
          this.divideBy = 2;
        } else {
          this.divideBy = 1;
        }
        const division = this.data.length / this.divideBy;
        let row;
        if (Number(division) === division && division % 1 !== 0) {
          row = Math.floor(division) + 1;
        } else {
          row = Math.floor(division);
        }
        for (let index = 0; index < row; index++) {
          console.log(" : index ==> ", index);
          this.totalRow.push(index);
        }
        let i,
          j,
          temparray,
          chunk = this.divideBy;
        console.log(" : chunk ==> ", chunk);
        this.finalData = [];
        for (i = 0, j = this.data.length; i < j; i += chunk) {
          temparray = this.data.slice(i, i + chunk);
          const obj = {};
          obj["row" + i] = temparray;
          this.finalData.push(obj);
          console.log(" : obj ==> ", this.finalData);
        }
      }
    }, 200);
  }

  validateDates() {
    let sDate;
    let eDate;
    if (
      (this.filterForm.get("end_date").value != null,
      this.filterForm.get("start_date").value != null)
    ) {
      eDate = moment(this.filterForm.get("end_date").value);
      sDate = moment(this.filterForm.get("start_date").value);
      if (eDate < sDate) {
        this.filterForm.controls["end_date"].setErrors({ isInValid: true });
      } else {
        this.filterForm.controls["end_date"].updateValueAndValidity();
      }
    }
  }
  close() {
    document.getElementById(this.divId).style.visibility = "hidden";
    document.getElementById(this.divId).style.display = "none";
    this.privious = null;
    this.openGraph = false;
  }
  restore() {
    this.router.navigate([`site/restore_installation/` + this.id]);
  }

  ngAfterViewInit() {
    const source = interval(10000);
    this.subscription = source.subscribe(() => {
      if (this.openGraph === false) {
        this.displaydata(this.page);
      }
    });
  }

  ngOnDestroy() {
    // console.log(" : hii ==> ");
    this.subscription && this.subscription.unsubscribe();
  }
}
