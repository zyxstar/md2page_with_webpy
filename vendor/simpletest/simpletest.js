function equal(actual, expected, message) {
    var msg = {
        actual: actual,
        expected: expected,
        message: !message ? '' : JSON.stringify(message)
    };

    console.log((_.isEqual(actual, expected) ? 'okay: ' : 'failed: ') +
      JSON.stringify(msg));
}

function ok(result, message) {
    var msg = {
        message: !message ? '' : JSON.stringify(message)
    };
    console.log((result ? 'okay: ' : 'failed: ') + JSON.stringify(msg));
}

// function asyncTest(testName, expected, callback){

// }