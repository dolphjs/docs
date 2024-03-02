import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { GuideComponent } from './homepage/pages/guide/guide.component';
import { ControllerCompponent } from './homepage/pages/controllers/controllers.component';

const routes: Routes = [
  {
    path: '',
    component: HomepageComponent,
    children: [
      {
        path: '',
        // component: IntroductionComponent,
      },
      {
        path: 'guide',
        component: GuideComponent,
        data: { title: 'Guide' },
      },
      {
        path: 'controllers',
        component: ControllerCompponent,
        data: { title: 'Controllers' },
      },
      {
        path: 'components',
        redirectTo: 'providers',
      },
      {
        path: 'providers',
        // component: ComponentsComponent,
        data: { title: 'Providers' },
      },
      {
        path: 'modules',
        // component: ModulesComponent,
        data: { title: 'Modules' },
      },
      {
        path: 'middleware',
        // component: MiddlewaresComponent,
        data: { title: 'Middleware' },
      },
      {
        path: 'pipes',
        // component: PipesComponent,
        data: { title: 'Pipes' },
      },
      {
        path: 'guards',
        // component: GuardsComponent,
        data: { title: 'Guards' },
      },
      {
        path: 'exception-filters',
        // component: ExceptionFiltersComponent,
        data: { title: 'Exception filters' },
      },
      {
        path: 'interceptors',
        // component: InterceptorsComponent,
        data: { title: 'Interceptors' },
      },
      {
        path: 'custom-decorators',
        // component: CustomDecoratorsComponent,
        data: { title: 'Custom decorators' },
      },
      {
        path: 'standalone-applications',
        // component: ApplicationContextComponent,
        data: { title: 'Standalone applications' },
      },
      {
        path: 'application-context',
        redirectTo: 'standalone-applications',
      },
      {
        path: 'discover/companies',
        // component: WhoUsesComponent,
        data: { title: 'Discover - Who is using Nest?' },
      },
      {
        path: 'migration-guide',
        // component: MigrationComponent,
        data: { title: 'Migration guide - FAQ' },
      },
      {
        path: 'support',
        // component: SupportComponent,
        data: { title: 'Support' },
      },
      {
        path: 'consulting',
        // component: EnterpriseComponent,
        resolve: {
          url: 'externalUrlRedirectResolver',
        },
        // canActivate: [RedirectGuard],
        data: {
          externalUrl: 'https://enterprise.nestjs.com',
        },
      },
      {
        path: 'enterprise',
        redirectTo: 'consulting',
      },
      {
        path: 'enterprise',
        // component: EnterpriseComponent,
        data: { title: 'Official Support' },
      },
      // {
      //   path: 'fundamentals',
      //   loadChildren: () =>
      //     import('./homepage/pages/fundamentals/fundamentals.module').then(
      //       (m) => m.FundamentalsModule,
      //     ),
      // },
      // {
      //   path: 'techniques',
      //   loadChildren: () =>
      //     import('./homepage/pages/techniques/techniques.module').then(
      //       (m) => m.TechniquesModule,
      //     ),
      // },
      // {
      //   path: 'security',
      //   loadChildren: () =>
      //     import('./homepage/pages/security/security.module').then(
      //       (m) => m.SecurityModule,
      //     ),
      // },
      // {
      //   path: 'graphql',
      //   loadChildren: () =>
      //     import('./homepage/pages/graphql/graphql.module').then(
      //       (m) => m.GraphqlModule,
      //     ),
      // },
      // {
      //   path: 'websockets',
      //   loadChildren: () =>
      //     import('./homepage/pages/websockets/websockets.module').then(
      //       (m) => m.WebsocketsModule,
      //     ),
      // },
      // {
      //   path: 'microservices',
      //   loadChildren: () =>
      //     import('./homepage/pages/microservices/microservices.module').then(
      //       (m) => m.MicroservicesModule,
      //     ),
      // },
      // {
      //   path: 'recipes',
      //   loadChildren: () =>
      //     import('./homepage/pages/recipes/recipes.module').then(
      //       (m) => m.RecipesModule,
      //     ),
      // },
      // {
      //   path: 'faq',
      //   loadChildren: () =>
      //     import('./homepage/pages/faq/faq.module').then((m) => m.FaqModule),
      // },
      // {
      //   path: 'cli',
      //   loadChildren: () =>
      //     import('./homepage/pages/cli/cli.module').then((m) => m.CliModule),
      // },
      // {
      //   path: 'openapi',
      //   loadChildren: () =>
      //     import('./homepage/pages/openapi/openapi.module').then(
      //       (m) => m.OpenApiModule,
      //     ),
      // },
      // {
      //   path: 'devtools',
      //   loadChildren: () =>
      //     import('./homepage/pages/devtools/devtools.module').then(
      //       (m) => m.DevtoolsModule,
      //     ),
      // },
    ],
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      // enableTracing: !environment.production,
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled',
      preloadingStrategy: PreloadAllModules,
    }),
  ],
  providers: [],
  exports: [RouterModule],
})
export class AppRoutingModule {}
