<?php

function config(string $name, $default = null)
{
    return $_ENV[$name] ?? $default;
}
