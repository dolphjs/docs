import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuComponent implements OnInit {
  @Input()
  isSidebarOpened = true;
  readonly items = [
    {
      title: 'Introduction',
      isOpened: false,
      path: '/',
    },
    {
      title: 'Overview',
      isOpened: true,
      children: [
        { title: 'Guide', path: '/guide' },
        { title: 'Controllers', path: '/controllers' },
        { title: 'Services', path: '/services' },
        { title: 'Models', path: '/models' },
        { title: 'Components', path: '/components' },
        { title: 'Decorators', path: '/decorators' },
        { title: 'Middlewares', path: '/middlewares' },
        { title: 'Guards', path: '/guards' },
      ],
    },
    {
      title: 'Fundamentals',
      isOpened: false,
      children: [
        { title: 'Custom providers', path: '/fundamentals/custom-providers' },
        {
          title: 'Asynchronous providers',
          path: '/fundamentals/async-providers',
        },
        {
          title: 'Dynamic modules',
          path: '/fundamentals/dynamic-modules',
        },
        {
          title: 'Injection scopes',
          path: '/fundamentals/injection-scopes',
        },
        {
          title: 'Circular dependency',
          path: '/fundamentals/circular-dependency',
        },
        {
          title: 'Module reference',
          path: '/fundamentals/module-ref',
        },
        {
          title: 'Lazy-loading modules',
          path: '/fundamentals/lazy-loading-modules',
        },
        {
          title: 'Execution context',
          path: '/fundamentals/execution-context',
        },
        {
          title: 'Lifecycle events',
          path: '/fundamentals/lifecycle-events',
        },
        {
          title: 'Platform agnosticism',
          path: '/fundamentals/platform-agnosticism',
        },
        { title: 'Testing', path: '/fundamentals/testing' },
      ],
    },
    {
      title: 'Techniques',
      isOpened: false,
      children: [
        { title: 'Configuration', path: '/techniques/configuration' },
        { title: 'Database', path: '/techniques/database' },
        { title: 'Mongo', path: '/techniques/mongodb' },
        { title: 'Validation', path: '/techniques/validation' },
        { title: 'Caching', path: '/techniques/caching' },
        { title: 'Serialization', path: '/techniques/serialization' },
        { title: 'Versioning', path: '/techniques/versioning' },
        { title: 'Task scheduling', path: '/techniques/task-scheduling' },
        { title: 'Queues', path: '/techniques/queues' },
        { title: 'Logging', path: '/techniques/logger' },
        { title: 'Cookies', path: '/techniques/cookies' },
        { title: 'Events', path: '/techniques/events' },
        { title: 'Compression', path: '/techniques/compression' },
        { title: 'File upload', path: '/techniques/file-upload' },
        { title: 'Streaming files', path: '/techniques/streaming-files' },
        { title: 'HTTP module', path: '/techniques/http-module' },
        { title: 'Session', path: '/techniques/session' },
        { title: 'Model-View-Controller', path: '/techniques/mvc' },
        { title: 'Performance (Fastify)', path: '/techniques/performance' },
        { title: 'Server-Sent Events', path: '/techniques/server-sent-events' },
      ],
    },
    {
      title: 'Security',
      isOpened: false,
      children: [
        { title: 'Authentication', path: '/security/authentication' },
        { title: 'Authorization', path: '/security/authorization' },
        {
          title: 'Encryption and Hashing',
          path: '/security/encryption-and-hashing',
        },
        { title: 'Helmet', path: '/security/helmet' },
        { title: 'CORS', path: '/security/cors' },
        { title: 'CSRF Protection', path: '/security/csrf' },
        { title: 'Rate limiting', path: '/security/rate-limiting' },
      ],
    },
    {
      title: 'CLI',
      isOpened: false,
      children: [
        { title: 'Overview', path: '/cli/overview' },
        { title: 'Usage', path: '/cli/usages' },
        { title: 'Scripts', path: '/cli/scripts' },
      ],
    },
    {
      title: 'GraphQL',
      isOpened: false,
      children: [
        { title: 'Overview', path: '/graphql/overview' },
        // { title: 'Resolvers', path: '/graphql/resolvers' },
        // { title: 'Mutations', path: '/graphql/mutations' },
        // { title: 'Subscriptions', path: '/graphql/subscriptions' },
        // { title: 'Directives', path: '/graphql/directives' },
        // { title: 'Interfaces', path: '/graphql/interfaces' },
        // { title: 'Plugins', path: '/graphql/plugins' },
        // { title: 'CLI Plugin', path: '/graphql/cli-plugin' },
        // { title: 'Sharing models', path: '/graphql/sharing-models' },
      ],
    },
    {
      title: 'WebSockets',
      isOpened: false,
      children: [{ title: 'Socket IO', path: '/websockets/socketio' }],
    },
    {
      title: 'FAQ',
      isOpened: false,
      children: [
        {
          title: 'Examples',
          externalUrl: 'https://github.com/dolphjs/samples',
        },
      ],
    },
    // {
    // title: 'Official courses',
    // externalUrl: 'https://courses.dolphjs.com/',
    // },
    // {
    // title: 'Discover',
    // isOpened: false,
    // children: [{ title: 'Who is using Dolph?', path: '/discover/companies' }],
    // },
    {
      title: 'Support us',
      isOpened: false,
      path: '/support',
    },
  ];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) {}

  ngOnInit() {
    this.router.events
      .pipe(filter((ev) => ev instanceof NavigationEnd))
      .subscribe((event) => this.toggleCategory());

    this.toggleCategory();
  }

  toggleCategory() {
    const { firstChild } = this.route.snapshot;
    if (
      (firstChild.url && firstChild.url[1]) ||
      (firstChild.url &&
        firstChild.routeConfig &&
        firstChild.routeConfig.loadChildren)
    ) {
      const { path } = firstChild.url[0];
      const index = this.items.findIndex(
        ({ title }) => title.toLowerCase() === path,
      );
      if (index < 0) {
        return;
      }
      this.items[index].isOpened = true;
      this.items[1].isOpened = false;
    }
  }
}
