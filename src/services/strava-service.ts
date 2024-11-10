import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, catchError, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { mergeMap, map } from 'rxjs/operators';
import { environment } from '../environments/environment';  // Adjust the path if needed


@Injectable({
  providedIn: 'root'
})
export class StravaService {
  private STRAVA_ACCESS_TOKEN_KEY = "strava_access_token";

  private readonly apiUrl = 'https://www.strava.com/api/v3/athlete/activities';
  private readonly clientId = environment.clientId;  // Replace with your Strava Client ID
  private readonly clientSecret = environment.clientSecret;  // Replace with your Strava Client Secret
  private readonly redirectUri = 'http://localhost:4200/auth/strava-redirect';

  constructor(private http: HttpClient) {}

  // Step 1: Redirect user to Strava OAuth page
  authorizeUser(): void {
    const url = `https://www.strava.com/oauth/authorize?client_id=${this.clientId}&response_type=code&redirect_uri=${this.redirectUri}&approval_prompt=force&scope=activity:read_all`;
    window.location.href = url;
  }

  // Step 2: Exchange authorization code for access token
  exchangeCodeForToken(code: string): Observable<any> {
    const url = 'https://www.strava.com/oauth/token';
    const body = {
      client_id: this.clientId,
      client_secret: this.clientSecret,
      code,
      grant_type: 'authorization_code'
    };

    return this.http.post(url, body).pipe(
      tap((response: any) => {
        // Store access token in localStorage
        localStorage.setItem(this.STRAVA_ACCESS_TOKEN_KEY, response.access_token);
      })
    );
  }

  getAllActivities(after: number, before: number, activityType: string): Observable<any[]> {
    const perPage = 100;
    let page = 1;
    let allActivities: any[] = [];

    // Recursive function to fetch paginated activities
    const fetchPage = (): Observable<any[]> => {
      const accessToken = localStorage.getItem(this.STRAVA_ACCESS_TOKEN_KEY);
      const headers = new HttpHeaders().set('Authorization', `Bearer ${accessToken}`);
      const params = new HttpParams()
        .set('page', page.toString())
        .set('per_page', perPage.toString())
        .set('after', after.toString())
        .set('before', before.toString())
        .set('per_page', '100');;

      return this.http.get<any[]>(this.apiUrl, {headers, params}).pipe(
        mergeMap((activities) => {
          if (activities.length > 0) {
            if (activityType) {
              // Filter on activity too
              activities = activities.filter(activity => activity.type === activityType);
            }
            
            allActivities = [...allActivities, ...activities];
            page += 1;
            return fetchPage();  // Recursive call for the next page
          } else {
            return of(allActivities);  // Return accumulated activities when done
          }
        }),
        catchError((error: HttpErrorResponse) => this.handleAuthError(error))
      );
    };

    return fetchPage();
  }

  private handleAuthError(error: HttpErrorResponse) {
    if (error.status === 401) {
      // Token has likely expired, remove it from storage and redirect
      localStorage.removeItem('strava_access_token');
      this.redirectToAuth();
    }
    return throwError(() => error);  // Re-throw the error after handling
  }

  private redirectToAuth(): void {
    const clientId = this.clientId;
    const redirectUri = encodeURIComponent(this.redirectUri);
    window.location.href = `https://www.strava.com/oauth/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=activity:read_all`;
  }

  // Calculate total distance for the set of activities
  calculateTotalDistance(activities: any[]): number {
    console.log(activities);
    const totalDistance = activities.reduce((sum, activity) => sum + activity.distance, 0);
    return totalDistance / 1000; // Convert meters to kilometers
  }
}
