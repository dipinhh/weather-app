import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { WeatherService } from './weather.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { PlotBand } from '@progress/kendo-angular-charts';
@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss']
})
export class WeatherComponent implements OnInit {
  public hidden: any = { visible: false };
  public tempPlotBands: PlotBand[] = [{
      from: 30, to: 45, color: '#e62325', opacity: 1
  }, {
      from: 15, to: 30, color: '#ffc000', opacity: 1
  }, {
      from: 0, to: 15, color: '#37b400', opacity: 1
  }, {
      from: -10, to: 0, color: '#5392ff', opacity: 1
  }];
  public humPlotBands: PlotBand[] = [{
      from: 0, to: 33, color: '#ccc', opacity: .6
  }, {
      from: 33, to: 66, color: '#ccc', opacity: .3
  }];
  public mmhgPlotBands: PlotBand[] = [{
      from: 715, to: 752, color: '#ccc', opacity: .6
  }, {
      from: 752, to: 772, color: '#ccc', opacity: .3
  }];
  public temp: any[] = [[25, 22]];
  public hum: any[] = [[45, 60]];
  public mmhg: any[] = [[750, 762]];

  cityName = new FormControl();
  searchHistory: any[] = [];
  searchStatus: boolean = false;
  showChart: boolean = false;
  constructor(private weatherService: WeatherService, private firestore: AngularFirestore) { 
  }
  ngOnInit(): void {
  }
  getWeatherDetails() {
    this.weatherService.getWeatherData(this.cityName.value).subscribe((res: any) => { 
      this.firestore.collection('searchData').add(res);
       });
  }

  onSearchClick() {
    this.searchStatus = false;
    this.showChart = true;
this.getWeatherDetails();
this.firestore.collection('searchData').valueChanges().subscribe(res => {
  this.searchHistory = res.filter((ele:any) => (ele?.city?.name).toLowerCase() === this.cityName.value.toLowerCase());  
  this.temp = [[this.searchHistory[0]?.list[0]?.main?.temp_max, this.searchHistory[0]?.list[0]?.main?.temp_min]];
  this.hum = [[this.searchHistory[0]?.list[0]?.main?.humidity, this.searchHistory[0]?.list[0]?.main?.humidity]];
  this.mmhg = [[this.searchHistory[0]?.list[0]?.main?.pressure, this.searchHistory[0]?.list[0]?.main?.pressure]]
});
  }

  viewSearchHistory() {
    this.searchStatus = true;
   this.firestore.collection('searchData').valueChanges().subscribe(res => {
    this.searchHistory = res;  
   });
  }
}
