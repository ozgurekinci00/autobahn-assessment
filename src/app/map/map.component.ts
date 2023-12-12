import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { DataService } from '../services/data.service';
import { GoogleMapsModule } from '@angular/google-maps';
import { MapInfoWindow, MapMarker } from '@angular/google-maps';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule, GoogleMapsModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
})
export class MapComponent {
  state: any;
  subscription: Subscription;

  @ViewChild(MapInfoWindow) infoWindow!: MapInfoWindow;

  constructor(public dataService: DataService) {
    this.subscription = this.dataService.state$.subscribe((state) => {
      this.state = state;
    });
  }

  openInfoWindow(marker: MapMarker) {
    this.infoWindow.open(marker);
    this.dataService.updateState({
      infoWindowContent: this.state.selectedRow.description.join(' '),
    });
  }
}
