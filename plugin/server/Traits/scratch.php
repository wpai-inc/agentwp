
<?php
new Assets(string $manifestPath, string $baseUri, string $algorithm = "sha256");

        if (\wp_get_environment_type() !== 'production') {
            wp_enqueue_script('dev-server-script', 'http://localhost:5173//@vite/client', [], null, true);
            wp_enqueue_script($this->slug(), 'http://localhost:5173/'.$this->clientPage(), ['dev-server-script'], null, true);
        } else {
            $manifest_path = $this->main->buildManifestPath();
            if (file_exists($manifest_path)) {
                $manifest = json_decode(file_get_contents($manifest_path), true);
                $key = $this->clientPage();
                $config = $manifest[$key] ?? [];

                if (empty($config)) {
                    throw new \Exception("No config found for $key");
                }

                if (isset($config['file'])) {
                    $jsPath = $config['file'];
                    wp_enqueue_script($this->slug(), $this->main->asset($jsPath), [], null, true);
                }

                if (isset($config['css'])) {
                    $cssPaths = $config['css'];
                    foreach ($cssPaths as $css) {
                        wp_enqueue_style($this->slug(), $this->main->asset($css), [], null, 'all');
                    }
                }
            }
        }
        if (file_exists($script_asset_path)) {
            $script_asset = include $script_asset_path;
            $script_dependencies = $script_asset['dependencies'] ?? [];

            if (in_array('wp-media-utils', $script_dependencies, true)) {
                wp_enqueue_media();
            }

            if (in_array('wp-react-refresh-runtime', $script_asset['dependencies'], true)
                && ! constant('SCRIPT_DEBUG')
            ) {
                wp_die(esc_html('SCRIPT_DEBUG should be true. You use `hot` mode, it requires `wp-react-refresh-runtime` which available only when SCRIPT_DEBUG is enabled.'));
            }

            wp_enqueue_script(
                "codewpai-$name",
                $this->main->url("build/$name.js"),
                $script_dependencies,
                $script_asset['version'],
                true
            );

            $style_dependencies = [];

            if (in_array('wp-components', $script_dependencies, true)) {
                $style_dependencies[] = 'wp-components';
            }

            wp_enqueue_style(
                "codewpai-$name",
                plugins_url("build/$name.css", $this->plugin_file),
                $style_dependencies,
                $script_asset['version'],
                'all'
            );
        }
