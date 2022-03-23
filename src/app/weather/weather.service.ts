import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  constructor(private http: HttpClient) { }

  getWeatherData(cityName: string): Observable<any> {
    const apiKey = 'f416a8ac1d002a427be1fb2f71fa884b'
    return this.http.get<any>(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}`).pipe(
    );
  }
}
