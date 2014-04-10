<?php
if ($_SERVER['REQUEST_METHOD'] == 'POST') {

	// Parse JSON Request
		$inputJSON = file_get_contents('php://input');
		$_POST = json_decode( $inputJSON, TRUE ); //convert JSON into array
	
    $username = $_POST["username"];
    $password = $_POST["password"];

    /* Code for when the db service is working
    require 'vendor/autoload.php';

    $client = new GuzzleHttp\Client();

    // Send request to DB Component
    $response = $client->get('http://guzzlephp.org');

    // Check if it succeeded
    if ($res->getStatusCode() === 200) {
        $body = $res->getBody();
        $body = json_decode($body);
        // Check returned UN and PW if its the same
        if ($body['data']['username'] === $username &&
            $body['data']['password'] === $password) {
            // If it is then return success
            $response = array(
                'code' => 200,
                'data' => [
                    'success' => true
                ],
                'debug' => []
            );

            echo json_encode($response, JSON_PRETTY_PRINT);
        } else {
            // If credentials are wrong then return failure with code 403
            $response = array(
                'code' => 403,
                'data' => [
                    'success' => false
                ],
                'debug' => []
            );

            echo json_encode($response, JSON_PRETTY_PRINT);
        }
    }

    */
    // Stub until the DB code is up
    $USER_DB = [
        'aston' => 'password',
        'renee' => 'sherm'
    ];

    if (isset($USER_DB[$username]) &&
        $USER_DB[$username] === $password
    ) {
        // If it is then return success
        $response = array(
            'code' => 200,
            'data' => [
                'success' => true
            ],
            'debug' => []
        );

        echo json_encode($response, JSON_PRETTY_PRINT);
    } else {
        // If credentials are wrong then return failure with code 403
        $response = array(
            'code' => 403,
            'data' => [
                'success' => false
            ],
            'debug' => []
        );

        echo json_encode($response, JSON_PRETTY_PRINT);
    }
} else {
    $response = array(
        'code' => 400,
        'data' => new stdClass,
        'debug' => array(
            'data' => new stdClass,
            'message' => 'This service only accepts a POST Request.'
        )
    );

    echo json_encode($response, JSON_PRETTY_PRINT);
}
