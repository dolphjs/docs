import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewEncapsulation,
} from '@angular/core';
import { BasePageComponent } from './pages/page/page.component';
import { Subscription, fromEvent } from 'rxjs';
import { debounceTime, filter } from 'rxjs/operators';
import { NavigationEnd, Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomepageComponent implements OnInit, OnDestroy, AfterViewInit {
  isSidebarOpened = true;
  previousWidth: number;
  contentRef: HTMLElement;
  isMarkupReady: boolean;

  private scrollSubscription: Subscription;
  private readonly scrollDebounceTime = 100;

  constructor(
    private readonly cd: ChangeDetectorRef,
    private readonly router: Router,
    private readonly elementRef: ElementRef,
    private readonly renderer: Renderer2,
  ) {}

  ngOnInit(): void {
    this.router.events
      .pipe(filter((ev) => ev instanceof NavigationEnd))
      .subscribe(() => {
        if (window.innerWidth > 768) {
          return false;
        }
        this.isSidebarOpened = false;
        this.cd.detectChanges();
      });

    this.scrollSubscription = fromEvent(window, 'scroll')
      .pipe(debounceTime(this.scrollDebounceTime))
      .subscribe((_) => {
        this.checkViewportBoundaries();
      });
  }

  ngAfterViewInit() {
    this.checkWindowWidth(window.innerWidth);
    this.loadDocSearchScript();
  }

  ngOnDestroy() {
    if (!this.scrollSubscription) {
      return;
    }
    this.scrollSubscription.unsubscribe();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.checkWindowWidth(event.target.innerWidth);
  }

  toggleSidebar() {
    this.isSidebarOpened = !this.isSidebarOpened;
  }

  checkWindowWidth(innerWidth?: number) {
    innerWidth = innerWidth ? innerWidth : window.innerWidth;
    if (this.previousWidth !== innerWidth && innerWidth <= 768) {
      this.previousWidth = innerWidth;
      this.isSidebarOpened = false;
      this.cd.detectChanges();
    }
  }

  checkViewportBoundaries() {
    const nativeElement: HTMLElement = this.elementRef.nativeElement;
    const footerRef: HTMLElement = nativeElement.querySelector('app-footer');
    const newsletterRef: HTMLElement = nativeElement.querySelector(
      '.newsletter-wrapper',
    );
    const carbonRef = nativeElement.querySelector('#carbonads');
    const sponsorsWrapper = nativeElement.querySelector('.sponsors-wrapper');
    if (!footerRef || !carbonRef) {
      return;
    }
    // if (window.innerWidth < 768) {
    //   this.renderer.removeStyle(carbonRef, 'position');
    //   this.renderer.removeStyle(carbonRef, 'bottom');
    //   return;
    // }

    // if (carbonRef) {
    //   sponsorsWrapper.classList.add('sponsors-carbon');
    // }

    const isPositionFixed =
      window.pageYOffset + window.innerHeight <
      newsletterRef.offsetTop -
        footerRef.offsetHeight +
        newsletterRef.offsetHeight;

    if (!isPositionFixed) {
      this.renderer.setStyle(carbonRef, 'position', 'absolute');
      this.renderer.setStyle(carbonRef, 'bottom', '350px');
    } else {
      this.renderer.removeStyle(carbonRef, 'position');
      this.renderer.removeStyle(carbonRef, 'bottom');
    }
  }

  onRouteActivate(component: BasePageComponent) {
    if (!component) {
      return;
    }
    const nativeElement = component.nativeElement;
    if (!nativeElement) {
      return;
    }
    this.contentRef = nativeElement.querySelector('.content');
    if (this.contentRef && !this.contentRef.querySelector('.carbon-wrapper')) {
      // const scriptTag = this.createCarbonScriptTag();
      const carbonWrapper = document.createElement('div');
      carbonWrapper.classList.add('carbon-wrapper');
      // carbonWrapper.prepend(scriptTag);

      this.contentRef.prepend(carbonWrapper);
    }
    this.cd.markForCheck();
  }

  // createCarbonScriptTag(): HTMLScriptElement {
  //   const scriptTag = document.createElement('script');
  //   scriptTag.type = 'text/javascript';
  //   scriptTag.src =
  //     '//cdn.carbonads.com/carbon.js?serve=CK7I653M&placement=dolphjsio';
  //   scriptTag.id = '_carbonads_js';
  //   return scriptTag;
  // }

  private loadDocSearchScript() {
    if (document.querySelector('script[src*="docsearch"]')) {
      this.initializeDocSearch();
      return;
    }

    const scriptTag = document.createElement('script');
    scriptTag.type = 'text/javascript';
    scriptTag.src = 'https://cdn.jsdelivr.net/npm/@docsearch/js@3';
    scriptTag.async = true;
    scriptTag.onload = () => {
      this.initializeDocSearch();
    };
    scriptTag.onerror = () => {
      console.error('Failed to load DocSearch script');
    };
    
    document.head.appendChild(scriptTag);
  }

  private initializeDocSearch() {
    // Wait for the search container to be available
    const searchContainer = document.querySelector('#search');
    if (!searchContainer) {
      console.warn('Search container not found, retrying...');
      setTimeout(() => this.initializeDocSearch(), 100);
      return;
    }

    console.log('Search container found:', searchContainer);
    console.log('Environment:', environment);

    // Check if docsearch is available
    if (!(window as any).docsearch) {
      console.error('DocSearch library not loaded');
      return;
    }

    try {
      (window as any).docsearch({
        apiKey: environment.algoliaApiKey,
        indexName: environment.indexName,
        container: '#search',
        appId: environment.appId,
        debug: !environment.production,
        searchParameters: {
          facetFilters: [],
        },
        placeholder: 'Search documentation...',
        maxResultsPerGroup: 7,
        translations: {
          button: {
            buttonText: 'Search',
            buttonAriaLabel: 'Search',
          },
          modal: {
            searchBox: {
              resetButtonTitle: 'Clear the query',
              resetButtonAriaLabel: 'Clear the query',
              cancelButtonText: 'Cancel',
              cancelButtonAriaLabel: 'Cancel',
            },
            startScreen: {
              recentSearchesTitle: 'Recent',
              noRecentSearchesText: 'No recent searches',
              saveRecentSearchButtonTitle: 'Save this search',
              removeRecentSearchButtonTitle: 'Remove this search from history',
              favoriteSearchesTitle: 'Favorite',
              removeFavoriteSearchButtonTitle: 'Remove this search from favorites',
            },
            errorScreen: {
              titleText: 'Unable to fetch results',
              helpText: 'You might want to check your network connection.',
            },
            footer: {
              selectText: 'to select',
              selectKeyAriaLabel: 'Enter key',
              navigateText: 'to navigate',
              navigateUpKeyAriaLabel: 'Arrow up',
              navigateDownKeyAriaLabel: 'Arrow down',
              closeText: 'to close',
              closeKeyAriaLabel: 'Escape key',
              searchByText: 'Search by',
            },
            noResultsScreen: {
              noResultsText: 'No results for',
              suggestedQueryText: 'Try searching for',
              reportMissingResultsText: 'Believe this query should return results?',
              reportMissingResultsLinkText: 'Let us know.',
            },
          },
        },
      });
      console.log('DocSearch initialized successfully');
    } catch (error) {
      console.error('Error initializing DocSearch:', error);
    }
  }

  createDocSearchScriptTag(): HTMLScriptElement {
    // This method is no longer used but keeping for compatibility
    const scriptTag = document.createElement('script');
    scriptTag.type = 'text/javascript';
    scriptTag.src = 'https://cdn.jsdelivr.net/npm/@docsearch/js@3';
    scriptTag.async = true;
    scriptTag.onload = () => {
      (window as any).docsearch({
        apiKey: environment.algoliaApiKey,
        indexName: 'dolphjs',
        container: '#search',
        appId: '4F394QQS8G',
        debug: true,
      });
    };
    return scriptTag;
  }
}
