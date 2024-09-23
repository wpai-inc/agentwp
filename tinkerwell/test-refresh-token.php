<?php
/**
 * Run in tinkerwell: File > Open File
 * Connect tinkerwell to the wordpress docker container
 * Run the code
 */
$user_id = 1; // Replace with the actual user ID
$user = get_user_by('id', $user_id);
if ($user) {
    wp_set_current_user($user_id);
    wp_set_auth_cookie($user_id);
    do_action('wp_login', $user->user_login, $user);
    echo 'Logged in successfully as '.$user->user_login;
} else {
    echo 'User not found';
}

// Simulate a REST API request
$request = new WP_REST_Request('GET', '/agentwp/v1/refresh_token');

// Dispatch the request
$response = rest_do_request($request);

// Check if the request was successful
if ($response->is_error()) {
    echo 'Error: '.$response->get_error_message()."\n";
} else {
    // Get the response data
    $data = $response->get_data();

    // Output the response
    echo "Response:\n";
    print_r($data);
}
