# For the Devs

## Plugin

This WordPress plugin is split into a `client` and `server`.

### Client

The client contains all the frontend assets built with **React** using **Typescript** and bundled with **Vite**.

### Server

The server contains the backend PHP. It consists of a "Provier Registry" which is just a collection of service provider classes that hook into WordPress.

All providers must have a `register()` method that contains the WordPress Hooks necessary to run the providers service. They must implement `Registrable` and be registered in the plugin entrypoint `agent-wp.php` under register. They all have the `Main` plugin as a dependency which contains common configuration and methods.

#### HasPage Trait

Adding the `HasPage` trait to a provider will allow you to create a new WordPress plugin page who's content maps to a corresponding React page contained in `client/Page`. This allows easy embedding of React apps into WordPress pages.
