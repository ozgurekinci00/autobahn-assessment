import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { GoogleMapsModule,  GoogleMap, MapMarker, MapMarkerClusterer } from '@angular/google-maps';
import { OverviewComponent } from './overview/overview.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, GoogleMapsModule, OverviewComponent ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'autobahn-assessment';
  center: google.maps.LatLngLiteral = {lat: 51.678418, lng: 7.809007};
  zoom = 15;
}
