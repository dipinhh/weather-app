import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { WeatherService } from './weather.service';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss']
})
export class WeatherComponent implements OnInit {
  cityName = new FormControl();
  constructor(private weatherService: WeatherService) { }

  ngOnInit(): void {
  }

  getWeatherDetails() {
    this.weatherService.getWeatherData(this.cityName.value).subscribe(res => {
    });
  }
  onSearchClick() {
this.getWeatherDetails();
  }
}
