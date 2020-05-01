import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MyStoreService } from "../../../services/mystore.service";
import { FormGroup, FormBuilder, FormControl } from "@angular/forms";
import { BaseChartDirective, Color, Label } from "ng2-charts";
import { ChartOptions, ChartDataSets } from "chart.js";
import * as pluginAnnotations from "chartjs-plugin-annotation";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";

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
  minValue: any;
  maxValue: any;
  average: any;

  public lineChartData: ChartDataSets[] = [
    { data: [], label: "Temperature" },
    // { data: [15, 15, 15, 15], label: "Min" },
    // { data: [29, 29, 29, 29], label: "Max" },
    // { data: [30, 30, 30, 30], label: "Max" },
  ];
  public lineChartLabels: Label[] = [];

  public lineChartOptions: ChartOptions & { annotation: any } = {
    responsive: true,
    scales: {
      // We use this empty structure as a placeholder for dynamic theming.
      xAxes: [{}],
      yAxes: [
        {
          id: "y-axis-0",
          position: "left",
        },
        {
          id: "y-axis-1",
          position: "right",
          gridLines: {
            color: "rgba(255,0,0,0.3)",
          },
          ticks: {
            fontColor: "red",
          },
        },
      ],
    },
    annotation: {
      annotations: [
        // {
        //   type: "line",
        //   mode: "vertical",
        //   scaleID: "x-axis-0",
        //   value: "March",
        //   borderColor: "orange",
        //   borderWidth: 2,
        //   label: {
        //     enabled: true,
        //     fontColor: "orange",
        //     content: "LineAnno"
        //   }
        // }
      ],
    },
  };
  public lineChartColors: Color[] = [
    {
      // grey
      backgroundColor: "rgba(0,255,0,0.2)",
      borderColor: "rgba(0,255,0,1)",
      pointBackgroundColor: "rgba(148,159,177,1)",
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "rgba(148,159,177,0.8)",
    },
    // {
    //   backgroundColor: "rgba(0,0,255,0.2)",
    //   borderColor: "rgba(0,0,255,1)",
    //   pointBackgroundColor: "",
    //   pointBorderColor: "",
    //   pointHoverBackgroundColor: "",
    //   pointHoverBorderColor: "",
    //   pointStyle: "",
    // },
    // {
    //   backgroundColor: "rgba(255,255,255,0)",
    //   borderColor: "rgba(255,0,0,1)",
    //   pointBackgroundColor: "",
    //   pointBorderColor: "",
    //   pointHoverBackgroundColor: "",
    //   pointHoverBorderColor: "",
    // },
    // {
    //   backgroundColor: "rgba(255,0,0,0.2)",
    //   borderColor: "rgba(255,0,0,1)",
    //   pointBackgroundColor: "",
    //   pointBorderColor: "",
    //   pointHoverBackgroundColor: "",
    //   pointHoverBorderColor: "",
    // }
  ];
  public lineChartLegend = true;
  public lineChartType = "line";
  public lineChartPlugins = [pluginAnnotations];

  @ViewChild(BaseChartDirective) chart: BaseChartDirective;

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
        this.data[`graph`].map((x) =>
          this.lineChartLabels.push(x[`measured_at`])
        );
        console.log(" : data ==> ", this.lineChartLabels);
        const tempdata = [];
        const newdata1 = this.data[`graph`].map((x) => {
          tempdata.push(x[`celsius`]);
          this.lineChartData[0][`data`].push(x[`celsius`]);
        });
        console.log(" : data ==> ", this.lineChartData[0][`data`]);

        console.log(tempdata);
        this.minValue = Math.min(...tempdata);
        this.maxValue = Math.max(...tempdata);

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

  back() {
    this.router.navigate(["/store/overview/" + this.store_id]);
  }
}
