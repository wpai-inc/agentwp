# AgentWP Plugin

## Usage

### Plugin Organization

This WordPress plugin is split into a `client` and `server`. The client is all the frontend Javascript that will run in the browser. Server is all the backend PHP for WordPress. These can be considered `frontend` / `backend` if you prefer.

#### Client

The client contains all the frontend assets built with **React** using **Typescript** and bundled with **Vite**. Running `pnpm run dev/build` will create a `./build` for dev and production assets.

#### Server

The server contains the backend PHP. It consists of a "Provier Registry" which is just a collection of service provider classes that hook into WordPress.

All providers must have a `register()` method that contains the WordPress Hooks necessary to run the provider's service. They must implement `Registrable` and be registered in the plugin entrypoint `agentwp.php` under the register method. They all have the `Main` plugin as a dependency which contains common configuration and methods. This is how we bootstrap the plugin and hook all of our code into WordPress's hook system (every provider class has a register method where it hooks itself).

### Build

To build the plugin for publishing on WordPress.org, run `pnpm run build-plugin`. This will build all files and remove source code files that shouldn't be published.

## Adding React Clients / Entrypoints

The plugin is meant to be powered by React apps that are injected into the WordPress experience. Because of this, we've made some utilities and conventions to quickly do this.

To add a React app somewhere in WordPress you must:

- Create a class that extends `ReactClient` under `server/Page`
  - Specify under the `registrations()` method where it should be hooked.
  - `$this->appRoot()` will contain the root HTML to bootstrap the React app.
- Create a companion React page/entrypoint under `client/Page`
  - make sure the root ID has the same corresponding slug.
  - Register this entrypoint with vite in `vite.config.ts`
- As always, make sure the Provider class is registered under `agentwp.php` to activate it.

#### HasPage Trait

Adding this trait to your ReactClient class will create a new page where your React app will be rendered. It also scopes the assets to this particular page instead of globally.

#### HasMenu Trait

This creates a menu item for your page.

## Frontend

The components and styling use [Tailwind](https://tailwindcss.com) with [shad/cn components](https://ui.shadcn.com). To avoid conflicts, all Tailwind classes have been scoped under any ID starting with `#agentwp`, which corresponds to how we create the root IDs in the React entrypoints. This should allow us to avoid collisions.

To add a shad/cn component, use `npx shadcn-ui@latest add [component]`

## Icons

[Available icons](https://marella.me/material-design-icons/demo/svg/)
