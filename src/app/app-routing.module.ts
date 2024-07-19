import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { GuideComponent } from './homepage/pages/guide/guide.component';
import { ControllerCompponent } from './homepage/pages/controllers/controllers.component';
import { IntroductionComponent } from './homepage/pages/introduction/introduction.component';
import { ServicesComponent } from './homepage/pages/services/services.component';
import { ModelsComponent } from './homepage/pages/models/models.component';
import { ComponentsComponent } from './homepage/pages/components/components.component';
import { DecoratorsComponent } from './homepage/pages/decorators/decorators.component';
import { MiddlewaresComponent } from './homepage/pages/middlewares/middlewares.component';
import { ShieldsComponent } from './homepage/pages/shields/shields.component';

const routes: Routes = [
  {
    path: '',
    component: HomepageComponent,
    children: [
      {
        path: '',
        component: IntroductionComponent,
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
        path: 'services',
        component: ServicesComponent,
        data: { title: 'Services' },
      },
      {
        path: 'models',
        component: ModelsComponent,
        data: { title: 'Models' },
      },
      {
        path: 'components',
        component: ComponentsComponent,
        data: { title: 'Components' },
      },
      {
        path: 'decorators',
        component: DecoratorsComponent,
        data: { title: 'Decorators' },
      },
      {
        path: 'middlewares',
        component: MiddlewaresComponent,
        data: { title: 'Middlewares' },
      },
      {
        path: 'shields',
        component: ShieldsComponent,
        data: { title: 'Shields' },
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
        path: 'support',
        // component: SupportComponent,
        data: { title: 'Support' },
      },
      {
        path: 'techniques',
        loadChildren: () =>
          import('./homepage/pages/techniques/techniques.module').then(
            (m) => m.TechniquesModule,
          ),
      },
      {
        path: 'security',
        loadChildren: () =>
          import('./homepage/pages/security/security.module').then(
            (m) => m.SecurityModule,
          ),
      },
      {
        path: 'graphql',
        loadChildren: () =>
          import('./homepage/pages/graphql/graphql.module').then(
            (m) => m.GraphqlModule,
          ),
      },
      {
        path: 'websockets',
        loadChildren: () =>
          import('./homepage/pages/websockets/websockets.module').then(
            (m) => m.WebsocketsModule,
          ),
      },
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
      {
        path: 'cli',
        loadChildren: () =>
          import('./homepage/pages/cli/cli.module').then((m) => m.CliModule),
      },
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
