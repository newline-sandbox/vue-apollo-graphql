# Vue 3 and GraphQL - GitHub Search

![GitHub GraphQL API Demo](https://www.dl.dropboxusercontent.com/s/hjojrb1bg324pdn/Screen%20Shot%202021-02-11%20at%202.17.35%20AM.png)

This GitHub search client was scaffolded via [Vue CLI](https://cli.vuejs.org/). Simply type a query into the search bar to retrieve a list of relevant repositories.

Using Vue 3's Composition API and the Vue Apollo (v4) library, a component's data requirements are defined alongside its lifecycle hook registrations and other functionality, all within a single `setup` method. With access to GitHub's GraphQL API, components can easily integrate with GitHub using flexible queries.

Visit the [master branch](https://github.com/newline-sandbox/vue-apollo-github) of this repository for the final version of this application.

## Project Setup

Install the dependencies.

```shell
$ npm install
```

Create a `.env` file in the root of the project directory. Add the `VUE_APP_GITHUB_ACCESS_TOKEN` environment variable to this file, and set it to a [GitHub access token](https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token).

(`.env`)

```
VUE_APP_GITHUB_ACCESS_TOKEN=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

## Running in Development Environment

Run the application for local development:

```shell
$ npm run serve
```

Navigate to [localhost:8080](http://localhost:8080). You should see your application running. The application hot-reloads on all file changes (state changes are preserved).

### Compilation and Minification for Production

Generate a build optimized for production:

```shell
$ npm run build
```

### Linting Files

Lint files to statically analyze code for potential errors:

```shell
$ npm run lint
```

### Customize Configuration

See [configuration reference](https://cli.vuejs.org/config/) for more information.
