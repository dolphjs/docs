import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SocialWrapperComponent } from './common/social-wrapper/social-wrapper.component';
import { HomepageComponent } from './homepage/homepage.component';
import { MenuComponent } from './homepage/menu/menu.component';
import { MenuItemComponent } from './homepage/menu/menu-item/menu-item.component';
import { FooterComponent } from './homepage/footer/footer.component';
import { NewsletterComponent } from './homepage/newsletter/newsletter.component';
import { SharedModule } from './shared/shared.module';
import { HeaderComponent } from './homepage/header/header.component';
import { ControllerCompponent } from './homepage/pages/controllers/controllers.component';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    SharedModule,
  ],
  declarations: [
    AppComponent,
    HomepageComponent,
    HeaderComponent,
    MenuComponent,
    MenuItemComponent,
    FooterComponent,
    NewsletterComponent,
    SocialWrapperComponent,
    ControllerCompponent
  ],
  bootstrap: [AppComponent],
  providers: [],
})
export class AppModule {}
