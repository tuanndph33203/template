# Potal MNA

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.3.5.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## Structure

```
src/
├── app/
│   ├── core/
│   │   ├── layout/
│   │   │   ├── header/
│   │   │   └── footer/
│   │   ├── interceptors/
│   │   │   ├── auth.interceptor.ts
│   │   │   └── error.interceptor.ts
│   │   ├── guards/
│   │   │   └── auth.guard.ts
│   │   ├── services/
│   │   │   ├── http.service.ts
│   │   │   ├── storage.service.ts
│   │   │   └── seo.service.ts
│   │   ├── constants/
│   │   │   ├── api-endpoints.constant.ts
│   │   │   └── environment.constant.ts
│   │   ├── models/
│   │   │   ├── movie.model.ts
│   │   │   ├── user.model.ts
│   │   │   └── api-response.model.ts
│   │   └── utils/
│   │       ├── format-date.util.ts
│   │       ├── slugify.util.ts
│   │       └── pagination.util.ts
│   │
│   ├── feature/
│   │   ├── home/
│   │   │   ├── service/
│   │   │   ├── components/
│   │   │   ├── home.component.ts
│   │   │   ├── home.component.html
│   │   │   └── home.component.scss
│   │   ├── movie-detail/
│   │   ├── watch/
│   │   ├── category/
│   │   └── profile/
│   │
│   ├── share/
│   │   ├── ui/
│   │   │   ├── button/
│   │   │   ├── card/
│   │   │   └── rating/
│   │   ├── pipes/
│   │   │   ├── safe-html.pipe.ts
│   │   │   ├── truncate.pipe.ts
│   │   ├── directives/
│   │   │   └── lazy-load.directive.ts
│   │   └── services/
│   │       └── toast.service.ts
│   │
│   ├── app.routes.ts
│   ├── app.config.ts
│   ├── app.config.server.ts
│   ├── app.component.ts
│   ├── app.component.html
│   └── app.scss
│
├── assets/
│   ├── images/
│   ├── icons/
│   └── styles/
│       ├── _variables.scss
│       └── _mixins.scss
│
└── environments/
    ├── environment.ts
    ├── environment.dev.ts
    └── environment.prod.ts

```
