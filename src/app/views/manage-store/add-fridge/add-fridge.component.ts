import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MyStoreService } from "../../../services/mystore.service";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  FormArray,
} from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { NgxSpinnerService } from "ngx-spinner";
import _ from "lodash";
import { NgIf } from "@angular/common";

@Component({
  selector: "app-add-fridge",
  templateUrl: "./add-fridge.component.html",
  styleUrls: ["./add-fridge.component.css"],
})
export class AddFridgeComponent implements OnInit {
  form: FormGroup;
  myForm: FormGroup;
  createSensorForm: FormGroup;
  sensor_data: FormArray;
  value = false;
  submitted = false;
  public isFormSubmitted;
  public isCreateSensorFormSubmitted;
  store_id: any;
  fridge_id: any;
  storeList: any = [{ label: "Select Location", value: "" }];
  sensorsList: any = [{ label: "Select Sensor", value: "" }];
  originalSensorsList: any = [];
  currentSensor: number = null;
  updatedSensor: any = [];
  getSensorsById: any = [];
  editMode = false;
  PageTitle = "Add New Fridge";
  display: boolean = false;

  selectedStorenmae: any;

  constructor(
    private route: ActivatedRoute,
    private service: MyStoreService,
    public fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {
    this.route.queryParamMap.subscribe((params) => {
      this.store_id = params.get("store_id");
      this.fridge_id = params.get("fridge_id");
    });
  }

  ngOnInit(): void {
    this.storelist();
    this.sensorList();
    this.form = this.fb.group({
      store: new FormControl("", [
        Validators.required,
        this.noWhitespaceValidator,
      ]),
      fridge_name: new FormControl("", [
        Validators.required,
        this.noWhitespaceValidator,
      ]),
      fridge_content: new FormControl("", [
        Validators.required,
        this.noWhitespaceValidator,
      ]),
      fridge_description: new FormControl("", [
        Validators.required,
        this.noWhitespaceValidator,
      ]),
      storage_range_min: new FormControl("", Validators.required),
      storage_range_max: new FormControl("", Validators.required),
      created_by: new FormControl(""),
    });

    this.myForm = this.fb.group({
      sensor_data: this.fb.array([this.createItem()]),
    });

    this.createSensorForm = this.fb.group({
      device_id: new FormControl("", [
        Validators.required,
        this.noWhitespaceValidator,
      ]),
    });

    if (this.store_id != null && this.fridge_id != null) {
      this.spinner.show();
      this.editMode = true;
      this.PageTitle = "Edit Fridge";
      const obj = {
        store_id: parseInt(this.store_id, 10),
        fridge_id: parseInt(this.fridge_id, 10),
      };
      this.service.getFreidgeById(obj).subscribe(
        (res) => {
          this.form.controls[`store`].setValue(res[`fridge_data`][`store`]);
          this.form.controls[`fridge_name`].setValue(
            res[`fridge_data`][`fridge_name`]
          );
          this.form.controls[`fridge_content`].setValue(
            res[`fridge_data`][`fridge_content`]
          );
          this.form.controls[`fridge_description`].setValue(
            res[`fridge_data`][`fridge_description`]
          );
          this.form.controls[`storage_range_min`].setValue(
            res[`fridge_data`][`storage_range_min`]
          );
          this.form.controls[`storage_range_max`].setValue(
            res[`fridge_data`][`storage_range_max`]
          );
          this.form.controls[`created_by`].setValue(
            res[`fridge_data`][`created_by`]
          );
          this.getSensor();
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
    } else {
      this.form.controls[`store`].setValue(parseInt(this.store_id, 10));
    }
  }

  get f() {
    return this.myForm.controls.sensor_data["controls"];
  }

  getSensor() {
    const sensorObj = {
      fridge_id: this.fridge_id,
      store_id: this.store_id,
    };

    this.service.getSensor(sensorObj).subscribe(
      (res) => {
        console.log(" : res ==> ", res);
        this.getSensorsById = res[`sensor_fridge_data`];
        for (
          let index = 0;
          this.myForm.controls[`sensor_data`][`controls`].length <
          this.getSensorsById.length;
          index++
        ) {
          this.sensor_data = this.myForm.get("sensor_data") as FormArray;
          this.sensor_data.push(this.createItem());
        }
        this.getSensorsById.forEach((element, index) => {
          console.log(" : element ==> ", element);
          this.myForm.controls[`sensor_data`]["controls"][index].controls[
            `id`
          ].setValue(element.id);
          this.myForm.controls[`sensor_data`]["controls"][index].controls[
            `temperature_sensor`
          ].setValue(element.temperature_sensor.device_id);
          if (element.installed_at != null) {
            this.myForm.controls[`sensor_data`]["controls"][index].controls[
              `installed_at`
            ].setValue(new Date(element.installed_at));
          }
          if (element.removed_at != null) {
            this.myForm.controls[`sensor_data`]["controls"][index].controls[
              `removed_at`
            ].setValue(new Date(element.removed_at));
          }
        });
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

  createItem() {
    return this.fb.group({
      id: [null],
      temperature_sensor: ["", Validators.required],
      installed_at: [null],
      removed_at: [null],
    });
  }

  addItem() {
    // this.submitted = false;
    this.sensor_data = this.myForm.get("sensor_data") as FormArray;
    this.sensor_data.push(this.createItem());
  }

  remove_sensor(index: number) {
    console.log(" : index ==> ", index);
    this.spinner.show();
    this.sensor_data = this.myForm.get("sensor_data") as FormArray;
    console.log(" :  this.sensor_data.value ==> ", this.sensor_data.value);
    console.log(
      " : this.sensor_data.value[index][`id`] != null ==> ",
      this.sensor_data.value[index][`id`] != null
    );
    if (this.sensor_data.value[index][`id`] != null) {
      const deleteObj = {
        sensor_fridge_id: this.sensor_data.value[index][`id`],
        store: parseInt(this.store_id, 10),
      };

      console.log(" : deleteObj ==> ", deleteObj);
      this.service.deleteSensor(deleteObj).subscribe(
        (res) => {
          console.log(" : res ==> ", res);
          console.log(this.sensor_data);

          this.sensor_data.removeAt(index);
          this.spinner.hide();
        },
        (err) => {
          console.log(" : err ==> ", err);
          this.spinner.hide();
        }
      );
    } else {
      this.sensor_data.removeAt(index);
      this.spinner.hide();
    }
    return false;
  }

  deleteFridge() {
    this.spinner.show();
    const deleteObj = {
      fridge_id: parseInt(this.fridge_id, 10),
      store_id: parseInt(this.store_id, 10),
      delete_status: true,
    };

    this.service.deleteFridge(deleteObj).subscribe(
      (res) => {
        console.log(" : res ==> ", res);
        this.toastr.success("Fridge Deleted Sucessfully", "Success!", {
          timeOut: 3000,
        });
        this.router.navigate(["store/overview/" + this.store_id]);
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

  storelist() {
    this.service.mystore_list().subscribe(
      (res) => {
        const store = res;
        this.storeList = [];
        if (store.length > 0) {
          for (const item of store) {
            this.storeList.push({
              label: item.store.store_name,
              value: item.store.id,
            });
          }
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

  changeSensor(e, i) {
    let inserted_id = "";
    if (this.editMode === true) {
      const temp_data = this.getSensorsById.find(
        (el) => el.temperature_sensor[`device_id`] == e.value
      );

      if (temp_data != undefined) {
        inserted_id = temp_data[`id`];
      } else {
        inserted_id = "";
      }
    }
    this.service.ckeckSensor(inserted_id, e.value).subscribe(
      (res) => {
        console.log(
          " : res, res[`exist`] === true ==> ",
          res,
          res[`exist`] === true
        );
        if (res[`exist`] === true) {
          this.myForm.controls.sensor_data["controls"][
            i
          ].controls.temperature_sensor.setErrors({ isExist: true });
          this.myForm.updateValueAndValidity();
        }
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

  // checkSensor(e, i) {
  //   console.log(" : e.value, i ==> ", e, i);
  //   this.service.ckeckSensor(e).subscribe(
  //     res => {
  //       if (res[`exist`] === true) {
  //         this.myForm.controls.sensor_data["controls"][
  //           i
  //         ].controls.temperature_sensor.setErrors({ isExist: true });
  //         this.myForm.updateValueAndValidity();
  //       }
  //     },
  //     err => {
  //       console.log(" : err ==> ", err);
  //       this.spinner.hide();
  //       if (err.error[`detail`]) {
  //         this.toastr.error(err.error[`detail`], "Error!", {
  //           timeOut: 3000
  //         });
  //       } else if (err.error[`error`]) {
  //         this.toastr.error(err.error[`error`], "Error!", {
  //           timeOut: 3000
  //         });
  //       }
  //     }
  //   );
  // }

  sensorList() {
    const req_data = {
      fridge_id: parseInt(this.fridge_id, 10),
      store_id: parseInt(this.store_id, 10),
    };
    this.service.sensorList(this.store_id).subscribe(
      (res) => {
        const sensor = res;
        this.sensorsList = [];
        if (sensor.length > 0) {
          for (const item of sensor) {
            this.sensorsList.push({
              label: item.device_id,
              value: item.device_id,
              selected: false,
            });
          }
          this.originalSensorsList = [...this.sensorsList];
          console.log(" : this.sensorList ==> ", this.sensorsList);
        }
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

  // Remove white spaces
  noWhitespaceValidator(control: FormControl) {
    if (
      typeof (control.value || "") === "string" ||
      (control.value || "") instanceof String
    ) {
      const isWhitespace = (control.value || "").trim().length === 0;
      const isValid = !isWhitespace;
      return isValid ? null : { whitespace: true };
    }
  }

  validateSensorsList() {
    const sList = this.myForm.controls["sensor_data"].value;
    const sensorIndexes = sList.map((v) => v.temperature_sensor);
    const isD = sensorIndexes.some((v, i) => sensorIndexes.indexOf(v) !== i);
    console.log({ sList, sensorIndexes, isD });
    return isD;
  }

  showDialog() {
    this.display = true;
  }

  closeDialog() {
    this.display = false;
    this.isCreateSensorFormSubmitted = false;
  }

  createSensor(valid) {
    console.log(' : "hi" ==> ', "hi");
    this.isCreateSensorFormSubmitted = true;
    if (valid) {
      const createSensorObj = {
        ...this.createSensorForm.value,
        store: this.store_id,
        deleted_at: null,
      };
      console.log(" : this.createSensorForm ==> ", createSensorObj);

      this.service.CreateSensor(createSensorObj).subscribe(
        (res) => {
          console.log(" : res ==> ", res);
          if (res[`detail`]) {
            this.toastr.success("Sensor Created Sucessfully.", "Success!", {
              timeOut: 3000,
            });
            this.createSensorForm.reset();
            this.isCreateSensorFormSubmitted = false;
            this.display = false;
            this.sensorList();
            this.spinner.hide();
          }
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

  onSubmit(formValid, myFormvalid) {
    this.isFormSubmitted = true;
    this.submitted = true;
    if (formValid && myFormvalid) {
      if (this.validateSensorsList()) {
        this.toastr.show("Duplicate Sensor", "Alert");
        return;
      }
      this.spinner.show();
      if (this.store_id != null && this.fridge_id != null) {
        const updatedData = {
          ...this.form.value,
          id: parseInt(this.fridge_id, 10),
          store: parseInt(this.store_id, 10),
        };
        const UpdateSensors = {
          ...this.myForm.value,
          fridge: this.fridge_id,
          store: parseInt(this.store_id, 10),
        };

        this.service.updatefridge(updatedData).subscribe(
          (res) => {
            if (res[`success`]) {
              this.service.updateSensor(UpdateSensors).subscribe(
                (result) => {
                  console.log(" : res ==> ");
                  if (result[`detail`]) {
                    this.toastr.success(
                      "Fridge Updated Sucessfully",
                      "Success!",
                      {
                        timeOut: 3000,
                      }
                    );
                    this.form.reset();
                    this.myForm.reset();
                    this.router.navigate(["store/fridge_detail"], {
                      queryParams: {
                        store_id: this.store_id,
                        fridge_id: this.fridge_id,
                      },
                    });
                    this.spinner.hide();
                  }
                },
                (err) => {
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
      } else {
        this.service.addFridge(this.form.value).subscribe(
          (res) => {
            console.log(" : res ==> ", res);
            if (res[`fridge_id`]) {
              const id = res[`fridge_id`];
              const sensor_obj = {
                ...this.myForm.value,
                fridge: id,
                store: parseInt(this.store_id, 10),
              };
              this.service.addSensor(sensor_obj).subscribe(
                (result) => {
                  console.log(" : res ==> ", result);
                  if (result[`detail`]) {
                    this.toastr.success(
                      "Fridge Added Sucessfully.",
                      "Success!",
                      {
                        timeOut: 3000,
                      }
                    );
                    this.form.reset();
                    this.myForm.reset();
                    this.router.navigate(["store/overview/" + this.store_id]);
                    this.spinner.hide();
                  }
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
          },
          (err) => {
            console.log(" : err ==> ", err.error);
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
  }

  onBack() {
    console.log(" : this.editMode ==> ", this.editMode);
    if (this.editMode === false) {
      this.router.navigate(["store/overview/" + this.store_id]);
    } else {
      this.router.navigate(["store/fridge_detail"], {
        queryParams: {
          store_id: this.store_id,
          fridge_id: this.fridge_id,
        },
      });
    }
  }
}
