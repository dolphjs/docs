import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, lastValueFrom } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class NewsletterService {
  constructor(private readonly httpClient: HttpClient) {}

  addToNewsletter(email: string): Promise<any> {
    const newsletterUrl = 'https://dolph-server.onrender.com/newsletter';
    return lastValueFrom(
      this.httpClient
        .post(newsletterUrl, { email, source: 'docs' })
        .pipe(catchError(() => EMPTY)),
    );
  }
}
