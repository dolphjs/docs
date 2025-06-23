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
import { IntroductionComponent } from './homepage/pages/introduction/introduction.component';
import { ServicesComponent } from './homepage/pages/services/services.component';
import { ModelsComponent } from './homepage/pages/models/models.component';
import { ComponentsComponent } from './homepage/pages/components/components.component';
import { MiddlewaresComponent } from './homepage/pages/middlewares/middlewares.component';
import { DecoratorsComponent } from './homepage/pages/decorators/decorators.component';
import { GuideComponent } from './homepage/pages/guide/guide.component';
import { ShieldsComponent } from './homepage/pages/shields/shields.component';
import { PipesComponent } from './homepage/pages/pipes/pipes.component';
import { FrameworkOverviewComponent } from './homepage/pages/framework-overview/framework-overview.component';
import { CoreArchitectureComponent } from './homepage/pages/core-architecture/core-architecture.component';
import { UtilitiesComponent } from './homepage/pages/utilities/utilities.component';
import { PackagesComponent } from './homepage/pages/packages/packages.component';
import { ExceptionsComponent } from './homepage/pages/exceptions/exceptions.component';

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
    ControllerCompponent,
    IntroductionComponent,
    ServicesComponent,
    ModelsComponent,
    ComponentsComponent,
    MiddlewaresComponent,
    DecoratorsComponent,
    GuideComponent,
    ShieldsComponent,
    PipesComponent,
    FrameworkOverviewComponent,
    CoreArchitectureComponent,
    UtilitiesComponent,
    PackagesComponent,
    ExceptionsComponent,
  ],
  bootstrap: [AppComponent],
  providers: [],
})
export class AppModule {}
