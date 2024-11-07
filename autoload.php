<?php

spl_autoload_register(function (string $class_name): void {
    // Map the namespace to the corresponding folder
    $namespace_mapping = [
        'WpAi\\AgentWp' => 'server/',
    ];

    foreach ($namespace_mapping as $namespace => $directory) {
        if (
            strpos($class_name, $namespace = trim($namespace, '\\')) !== 0
            || (! $directory = realpath(__DIR__.DIRECTORY_SEPARATOR.trim($directory, DIRECTORY_SEPARATOR)))
        ) {
            continue; // Class name doesn't match or the directory doesn't exist
        }

        // Require the file
        $class_file = $directory.str_replace([$namespace, '\\'], ['', DIRECTORY_SEPARATOR], $class_name).'.php';
        if (file_exists($class_file)) {
            require_once $class_file;
        }
    }
});
