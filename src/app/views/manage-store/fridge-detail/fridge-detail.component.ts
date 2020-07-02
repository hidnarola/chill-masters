import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MyStoreService } from "../../../services/mystore.service";
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from "@angular/forms";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
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
// import * as exportingData from "highcharts/modules/export-data";
@Component({
  selector: "app-fridge-detail",
  templateUrl: "./fridge-detail.component.html",
  styleUrls: ["./fridge-detail.component.css"],
})
export class FridgeDetailComponent implements OnInit {
  form: FormGroup;
  filterForm: FormGroup;
  isFormSubmitted = false;
  error: any = { isError: false, errorMessage: "" };
  isValidDate: any;
  store_id: any;
  fridge_id: any;
  dateTime = new Date();
  data: any;
  store_name = "";
  fridge_name = "";
  permission: any;
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
            maxWidth: 500,
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
    private Activatedroute: ActivatedRoute,
    private router: Router,
    public fb: FormBuilder,
    private service: MyStoreService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {
    this.Activatedroute.queryParamMap.subscribe((params) => {
      this.store_id = params.get("store_id");
      this.fridge_id = params.get("fridge_id");
    });

    this.form = this.fb.group({
      content: new FormControl(""),
      currenttemperature: new FormControl(""),
      currentbattery: new FormControl(""),
    });

    this.filterForm = this.fb.group({
      start_date: new FormControl("", Validators.required),
      end_date: new FormControl("", Validators.required),
    });
  }

  ngOnInit(): void {
    this.spinner.show();
    const dateFrom = new Date(moment().subtract(6, "d").format("YYYY-MM-DD"));
    this.filterForm.controls[`start_date`].setValue(dateFrom);
    this.filterForm.controls[`end_date`].setValue(this.dateTime);

    this.spinner.hide();
    if (this.filterForm.valid) {
      const obj = {
        store_id: parseInt(this.store_id, 10),
        fridge_id: parseInt(this.fridge_id, 10),
        start_date: moment(this.filterForm.get("start_date").value)
          .utc()
          .set({ second: 0 })
          .format(),
        end_date: moment(this.filterForm.get("end_date").value)
          .utc()
          .set({ second: 0 })
          .format(),
      };

      this.service.fridgeDetail(obj).subscribe(
        (res) => {
          this.spinner.hide();
          this.data = res;
          console.log(this.data);
          this.minRate = this.data.minimum;
          this.maxRate = this.data.maximum;
          this.average = this.data.average;
          this.form.controls[`content`].setValue(res[`fridge_content`]);
          this.form.controls[`currenttemperature`].setValue(
            res[`current_temperature`] + "°C"
          );
          if (res[`current_battery`] != null) {
            this.form.controls[`currentbattery`].setValue(
              res[`current_battery`] + "%"
            );
          }
          this.permission = res[`permission`];
          this.graphDataLength = this.data[`graph`].length;

          this.store_name = res[`store_name`];
          this.fridge_name = res[`fridge_name`];
          this.annotationLineChart.yAxis.plotBands[0].to = this.data.storage_range_min;
          this.annotationLineChart.yAxis.plotBands[1].from = this.data.storage_range_max;
          this.annotationLineChart.title.text =
            this.store_name + " : Fridge " + this.fridge_name;
          this.annotationLineChart.yAxis.max = this.maxRate + 0.5;
          this.annotationLineChart.yAxis.min = this.minRate - 0.5;

          if (res[`maximum`] < this.data.storage_range_max) {
            this.annotationLineChart.yAxis.max =
              this.data.storage_range_max + 0.5;
          }

          if (res[`minimum`] > this.data.storage_range_min) {
            this.annotationLineChart.yAxis.min =
              this.data.storage_range_min - 0.5;
          }

          this.annotationLineChart.series = this.data[`graph`];
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

  onSubmit(valid) {
    this.isFormSubmitted = true;
    if (valid) {
      const StartDate = moment(this.filterForm.get("start_date").value);
      const EndDate = moment(this.filterForm.get("end_date").value);

      // this.isValidDate = this.validateDates(StartDate, EndDate);

      this.spinner.show();
      const obj = {
        store_id: parseInt(this.store_id, 10),
        fridge_id: parseInt(this.fridge_id, 10),
        start_date: moment(this.filterForm.get("start_date").value)
          .utc()
          .set({ second: 0 })
          .format(),
        end_date: moment(this.filterForm.get("end_date").value)
          .utc()
          .set({ second: 0 })
          .format(),
      };

      this.service.fridgeDetail(obj).subscribe(
        (res) => {
          this.spinner.hide();

          this.data = res;
          this.minRate = this.data.minimum;
          this.maxRate = this.data.maximum;
          this.average = this.data.average;
          this.form.controls[`content`].setValue(res[`fridge_content`]);
          this.form.controls[`currenttemperature`].setValue(
            res[`current_temperature`] + "°C"
          );
          if (res[`current_battery`] != null) {
            this.form.controls[`currentbattery`].setValue(
              res[`current_battery`] + "%"
            );
          }
          this.permission = res[`permission`];
          this.graphDataLength = this.data[`graph`].length;
          this.store_name = res[`store_name`];
          this.fridge_name = res[`fridge_name`];
          this.annotationLineChart.yAxis.plotBands[0].to = this.data.storage_range_min;
          this.annotationLineChart.yAxis.plotBands[1].from = this.data.storage_range_max;
          this.annotationLineChart.title.text =
            this.store_name + " : Fridge " + this.fridge_name;

          this.annotationLineChart.yAxis.max = this.maxRate + 0.5;
          this.annotationLineChart.yAxis.min = this.minRate - 0.5;

          if (res[`maximum`] <= this.data.storage_range_max) {
            this.annotationLineChart.yAxis.max =
              this.data.storage_range_max + 0.5;
          }

          if (res[`minimum`] >= this.data.storage_range_min) {
            this.annotationLineChart.yAxis.min =
              this.data.storage_range_min - 0.5;
          }
          this.annotationLineChart.series = this.data[`graph`];
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

  back() {
    this.router.navigate(["/store/overview/" + this.store_id]);
  }
}
