import { Injectable } from "@angular/core";
import { Observable, BehaviorSubject } from "rxjs";
import { Router } from "@angular/router";
import * as env from "../../environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class MyStoreService {
  private url = env.environment.API_URL;

  constructor(public router: Router, private http: HttpClient) {}

  mystore_list(): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}` + "api/user/store/", {
      headers: new HttpHeaders({
        Authorization: "Token " + localStorage.getItem("token"),
      }),
    });
  }

  store_users(id): Observable<any[]> {
    const obj = {
      store_id: id,
    };
    return this.http.post<any[]>(`${this.url}` + "api/user/store/", obj, {
      headers: new HttpHeaders({
        Authorization: "Token " + localStorage.getItem("token"),
      }),
    });
  }

  changePemission(data): Observable<any[]> {
    return this.http.put<any[]>(`${this.url}` + "api/user/store/", data, {
      headers: new HttpHeaders({
        Authorization: "Token " + localStorage.getItem("token"),
      }),
    });
  }

  changeAlert(data): Observable<any[]> {
    return this.http.put<any[]>(
      `${this.url}` + "useraccount/update/alert/",
      data,
      {
        headers: new HttpHeaders({
          Authorization: "Token " + localStorage.getItem("token"),
        }),
      }
    );
  }

  filteruser(username): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.url}` + "useraccount/profile/?search=" + username,
      {
        headers: new HttpHeaders({
          Authorization: "Token " + localStorage.getItem("token"),
        }),
      }
    );
  }

  addUser(data): Observable<any[]> {
    return this.http.post<any[]>(`${this.url}` + "api/adduser/", data, {
      headers: new HttpHeaders({
        Authorization: "Token " + localStorage.getItem("token"),
      }),
    });
  }

  addFridge(data): Observable<any[]> {
    return this.http.post<any[]>(`${this.url}` + "api/fridge/", data, {
      headers: new HttpHeaders({
        Authorization: "Token " + localStorage.getItem("token"),
      }),
    });
  }

  overviewList(data, page): Observable<any[]> {
    return this.http.post<any[]>(
      `${this.url}` + "api/store/fridge/?page_size=10&page=" + page,
      data,
      {
        headers: new HttpHeaders({
          Authorization: "Token " + localStorage.getItem("token"),
        }),
      }
    );
  }

  overviewListByPage(url, data): Observable<any[]> {
    return this.http.post<any[]>(`${url}`, data, {
      headers: new HttpHeaders({
        Authorization: "Token " + localStorage.getItem("token"),
      }),
    });
  }

  deletedFridgeList(data, page): Observable<any[]> {
    return this.http.post<any[]>(
      `${this.url}` + "api/store/fridge/?page_size=10&page=" + page,
      data,
      {
        headers: new HttpHeaders({
          Authorization: "Token " + localStorage.getItem("token"),
        }),
      }
    );
  }

  deletedFridgeListByPage(url, data): Observable<any[]> {
    return this.http.post<any[]>(`${url}`, data, {
      headers: new HttpHeaders({
        Authorization: "Token " + localStorage.getItem("token"),
      }),
    });
  }

  fridgeDetail(data): Observable<any[]> {
    return this.http.post<any[]>(`${this.url}` + "api/fridge/graph/", data, {
      headers: new HttpHeaders({
        Authorization: "Token " + localStorage.getItem("token"),
      }),
    });
  }

  getFreidgeById(data): Observable<any[]> {
    return this.http.post<any[]>(
      `${this.url}` + "api/fridge/particular/",
      data,
      {
        headers: new HttpHeaders({
          Authorization: "Token " + localStorage.getItem("token"),
        }),
      }
    );
  }

  updatefridge(data): Observable<any[]> {
    return this.http.put<any[]>(`${this.url}` + "api/fridge/", data, {
      headers: new HttpHeaders({
        Authorization: "Token " + localStorage.getItem("token"),
      }),
    });
  }

  sensorList(id): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.url}` + "api/device/sensor/" + id + "/",
      {
        headers: new HttpHeaders({
          Authorization: "Token " + localStorage.getItem("token"),
        }),
      }
    );
  }

  addSensor(data): Observable<any[]> {
    return this.http.post<any[]>(`${this.url}` + "api/sensor/", data, {
      headers: new HttpHeaders({
        Authorization: "Token " + localStorage.getItem("token"),
      }),
    });
  }

  ckeckSensor(name): Observable<any[]> {
    // /api/sensor/?id=&&sensor_id=F13-30000013
    return this.http.get<any[]>(
      `${this.url}` + "api/sensor/?sensor_id=" + name,
      {
        headers: new HttpHeaders({
          Authorization: "Token " + localStorage.getItem("token"),
        }),
      }
    );
  }

  getSensor(data): Observable<any[]> {
    return this.http.post<any[]>(`${this.url}` + "api/get/sensor/", data, {
      headers: new HttpHeaders({
        Authorization: "Token " + localStorage.getItem("token"),
      }),
    });
  }

  updateSensor(data): Observable<any[]> {
    return this.http.put<any[]>(`${this.url}` + "api/sensor/", data, {
      headers: new HttpHeaders({
        Authorization: "Token " + localStorage.getItem("token"),
      }),
    });
  }

  deleteFridge(data): Observable<any[]> {
    return this.http.patch<any[]>(`${this.url}` + "api/fridge/", data, {
      headers: new HttpHeaders({
        Authorization: "Token " + localStorage.getItem("token"),
      }),
    });
  }

  CreateSensor(data): Observable<any[]> {
    return this.http.post<any[]>(`${this.url}` + "api/device/sensor/", data, {
      headers: new HttpHeaders({
        Authorization: "Token " + localStorage.getItem("token"),
      }),
    });
  }

  deleteSensor(data): Observable<any[]> {
    return this.http.patch<any[]>(`${this.url}` + "api/sensor/", data, {
      headers: new HttpHeaders({
        Authorization: "Token " + localStorage.getItem("token"),
      }),
    });
  }
}
