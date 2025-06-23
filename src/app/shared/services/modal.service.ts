import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private showNewsletterModalSubject = new BehaviorSubject<boolean>(false);
  public showNewsletterModal$ = this.showNewsletterModalSubject.asObservable();

  private readonly NEWSLETTER_MODAL_KEY = 'dolphjs-newsletter-modal-shown';

  constructor() {
    this.checkFirstTimeVisitor();
  }

  private checkFirstTimeVisitor(): void {
    // Check if the modal has been shown before
    const hasBeenShown = localStorage.getItem(this.NEWSLETTER_MODAL_KEY);
    
    if (!hasBeenShown) {
      // Show modal after a delay to allow the page to load
      setTimeout(() => {
        this.showNewsletterModal();
      }, 2000); // 2 second delay
    }
  }

  showNewsletterModal(): void {
    this.showNewsletterModalSubject.next(true);
  }

  hideNewsletterModal(): void {
    this.showNewsletterModalSubject.next(false);
    // Mark that the modal has been shown
    localStorage.setItem(this.NEWSLETTER_MODAL_KEY, 'true');
  }

  // Method to manually reset the modal (for testing or admin purposes)
  resetModalState(): void {
    localStorage.removeItem(this.NEWSLETTER_MODAL_KEY);
  }
} 