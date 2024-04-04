# For the Devs

## Plugin

This WordPress plugin is split into a `client` and `server`.

### Client

The client contains all the frontend assets built with **React** using **Typescript** and bundled with **Vite**.

### Server

The server contains the backend PHP. It consists of a "Provier Registry" which is just a collection of service provider classes that hook into WordPress.

All providers must have a `register()` method that contains the WordPress Hooks necessary to run the providers service. They must implement `Registrable` and be registered in the plugin entrypoint `agent-wp.php` under register. They all have the `Main` plugin as a dependency which contains common configuration and methods.

## Adding React Entrypoints

To add a React app somewhere in WordPress you must:

- Create a class that extends `ReactClient` under `server/Page`
  - Specify under the `register()` method where it should be hooked.
- Create an companion React page under `client/Page`
  - make sure the root ID has the same corresponding slug.
  - Register this entrypoint with vite in `vite.config.ts`
- As always, makes sure the Provider class is registered under `agent-wp.php`

#### HasPage Trait

Adding this trait to your ReactClient class will create a new page where your React app will be rendered.

#### HasMenu Trait

This creates a menu item for your page.

## Styles: Tailwind / shad/cn

The components and styling use Tailwind with shad/cn components. To avoid conflicts, all Tailwind classes have been scoped under any ID starting with "agent-wp", which corresponds to how we create the root IDs in the React entrypoints. This should allow us to avoid collisions.
