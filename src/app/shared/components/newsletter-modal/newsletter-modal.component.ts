import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { NewsletterService } from '../../../homepage/newsletter/services/newsletter.service';

@Component({
  selector: 'app-newsletter-modal',
  templateUrl: './newsletter-modal.component.html',
  styleUrls: ['./newsletter-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsletterModalComponent {
  @Output() closeModal = new EventEmitter<void>();
  
  isDisabled: boolean = false;
  isEmailAdded: boolean = false;

  constructor(
    private readonly newsletterService: NewsletterService,
    private readonly cd: ChangeDetectorRef,
  ) {}

  async addToNewsletter(event: Event, value: string) {
    event.preventDefault();
    this.isDisabled = true;
    this.cd.markForCheck();

    await this.newsletterService.addToNewsletter(value);
    this.isEmailAdded = true;
    this.cd.markForCheck();
    
    // Auto close modal after successful subscription
    setTimeout(() => {
      this.onClose();
    }, 2000);
  }

  onClose() {
    this.closeModal.emit();
  }

  onBackdropClick(event: Event) {
    // Close modal when clicking on backdrop
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }
} 