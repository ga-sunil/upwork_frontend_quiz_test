import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class HomeService {
  urls: any = {
    getData: '/posts'
  };

  constructor(private _http: HttpClient) { }

  loadData(): Observable<any> {
    return this._http.get(environment.api + this.urls.getData, {});
  }

  addPost(data: object): Observable<any> {
    return this._http.post(environment.api + this.urls.getData, data);
  }
}
