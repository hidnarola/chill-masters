import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MyStoreService } from "../../../services/mystore.service";
import { FormGroup, FormBuilder, FormControl } from "@angular/forms";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import * as Highcharts from "highcharts";
import StockModule from "highcharts/modules/stock";
StockModule(Highcharts);
import * as moment from "moment";
import { tz } from "moment-timezone";

@Component({
  selector: "app-fridge-detail",
  templateUrl: "./fridge-detail.component.html",
  styleUrls: ["./fridge-detail.component.css"],
})
export class FridgeDetailComponent implements OnInit {
  form: FormGroup;
  store_id: any;
  fridge_id: any;
  data: any;
  store_name = "";
  fridge_name = "";
  permission: any;
  minRate: any;
  maxRate: any;
  average: any;
  title = "highchart";
  convertedData: any = [];
  elevationData = [];
  toolTipData: any = [];
  chartCallback;
  Highcharts = Highcharts;
  updateFlag = false;

  annotationLineChart = {
    useHighStocks: true,
    chart: {
      type: "area",
      zoomType: "x",
      panning: true,
      panKey: "shift",
      scrollablePlotArea: {
        minWidth: 600,
      },
    },

    caption: {
      text: "",
    },

    title: {
      text: "Temperature",
    },
    exporting: {
      enabled: true,
    },
    credits: {
      enabled: false,
    },
    xAxis: {
      type: "datetime",
    },
    yAxis: {
      title: "Temperature",
      plotLines: [
        {
          value: null,
          color: "green",
          dashStyle: "shortdash",
          width: 2,
          label: {
            text: "Last minimum temperature",
          },
        },
        {
          value: null,
          color: "red",
          dashStyle: "shortdash",
          width: 2,
          label: {
            text: "Last minimum temperature",
          },
        },
      ],
    },
    tooltip: {
      formatter: function () {
        return (
          "<b>" +
          " date: </b>" +
          moment(new Date(this.x)).format("DD-MM-YYYY HH:mm") +
          "<br> <b>Temperature : </b>" +
          this.y +
          "°C"
        );
      },
    },

    legend: {
      enabled: false,
    },

    series: [
      {
        accessibility: {
          keyboardNavigation: {
            enabled: false,
          },
        },
        data: [],
        lineColor: Highcharts.getOptions().colors[1],
        color: Highcharts.getOptions().colors[2],
        fillOpacity: 0.5,
        name: "Temperature",
        marker: {
          enabled: false,
        },
        threshold: null,
      },
    ],
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
  }

  ngOnInit(): void {
    this.spinner.show();
    const obj = {
      store_id: parseInt(this.store_id, 10),
      fridge_id: parseInt(this.fridge_id, 10),
    };

    this.service.fridgeDetail(obj).subscribe(
      (res) => {
        console.log(" : res ==> ", res);
        this.data = res;
        this.store_name = res[`store_name`];
        this.fridge_name = res[`fridge_name`];
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
        this.data[`graph`].map((x) => {
          const obj = [x[`measured_at`], parseFloat(x[`celsius`])];
          const obj1 = x[`measured_at`];
          this.elevationData.push(obj);
        });

        for (let index = 0; index < this.elevationData.length; index++) {
          const dateStr = JSON.stringify(this.elevationData[index][0]);
          const splitStr = dateStr.split(",");
          const date = splitStr[0];
          const splitDate = splitStr[0].split('"');
          console.log(" : ==> ", Date.parse(splitDate[1]));
          const obj = [Date.parse(splitDate[1]), this.elevationData[index][1]];
          this.convertedData.push(obj);
        }
        setTimeout(() => {
          this.lineChartCalling();
        }, 1000);
        // console.log(" : data ==> ", this.lineChartLabels);
        const tempdata = [];
        const newdata1yax = this.data[`graph`].map((x) => {
          tempdata.push(x[`celsius`]);
        });
        console.log(tempdata);
        this.minRate = Math.min(...tempdata);
        this.maxRate = Math.max(...tempdata);

        let total = 0;
        for (let i = 0; i < tempdata.length; i++) {
          total += parseFloat(tempdata[i]);
        }
        this.average = (total / tempdata.length).toFixed(2);
        this.spinner.hide();
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

  lineChartCalling() {
    console.log("converte", this.convertedData);
    const data = (this.annotationLineChart.series[0].data = this.convertedData);
    this.annotationLineChart.yAxis.plotLines[0].value = this.minRate;
    this.annotationLineChart.yAxis.plotLines[1].value = this.maxRate;
    this.updateFlag = true;
  }

  back() {
    this.router.navigate(["/store/overview/" + this.store_id]);
  }
}
