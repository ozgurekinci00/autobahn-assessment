import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { GoogleMapsModule } from '@angular/google-maps';
import { OverviewComponent } from './overview/overview.component';
import { MatPaginatorModule } from '@angular/material/paginator';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, GoogleMapsModule, OverviewComponent, MatPaginatorModule ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'autobahn-assessment';
  center: google.maps.LatLngLiteral = {lat: 51.678418, lng: 7.809007};
  zoom = 15;
}
