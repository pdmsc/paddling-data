import { Routes } from '@angular/router';
import { StravaAuthRedirectComponent } from '../components/strava-auth-redirect.component';
import { StravaDistanceComponent } from '../components/strava-distance.component';

export const routes: Routes = [
  { path: '', redirectTo: '/distance', pathMatch: 'full' },
  { path: 'auth/strava-redirect', component: StravaAuthRedirectComponent },
  { path: 'distance', component: StravaDistanceComponent }
];