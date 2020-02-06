///////////////////////////////////////////////////////////////////////////////
// CONFIGURATION
///////////////////////////////////////////////////////////////////////////////
var config = {
		//
		// Number of items that can be added to
		// outputQueue before outputTimer becomes
		// non-interruptable.
		//
		outputWaitItems: 10,

		//
		// Number of milliseconds during which
		// outputTimer can be interrupted and
		// reset by the arrival of a new item.
		//
		outputWaitMs: 2000,
}

///////////////////////////////////////////////////////////////////////////////
// INTERNAL-USE VARIABLES
///////////////////////////////////////////////////////////////////////////////

//
// Array of items to be sent when the
// timer expires. In queue (FIFO) order.
//
var outputQueue = [];

//
// Timeout handle controlling when the
// output queue can be transmitted.
//
var outputTimer = null;

///////////////////////////////////////////////////////////////////////////////
// METHODS
///////////////////////////////////////////////////////////////////////////////

/**
 * Call send on each of the scheduled items.
 */
function sendAllScheduled() {

		var arr,
			i;

		clearTimeout( outputTimer );

		arr = outputQueue.splice( 0, outputQueue.length );

		for ( i = 0; i < arr.length; i++ ) {
				//
				// All data will be lost if
				// send() fails. It is not
				// added back to QUEUE.
				//
				send( arr[ i ][ 0 ], arr[ i ][ 1 ] );
		}
}

/**
 * Schedule the request to be sent later.
 *
 * @param {string} url destination of the HTTP POST request
 * @param {string} body body of the HTTP POST request
 */
function schedule( url, body ) {

	outputQueue.push( [ url, body ] );

	if ( outputQueue.length >= outputWaitItems ) {
			//
			// >= because we may have been
			// disabled and accumulated an
			// unknown number of items in
			// the queue.
			// /
			sendAllScheduled();
	} else {
			//
			// Arrival of a new item
			// interrupts the timer and
			// resets the countdown.
			//
			clearTimeout( outputTimer );
			outputTimer = setTimeout( sendAllScheduled, outputWaitMs );
	}
}

/**
 * Send an HTTP POST request with the given url and body.
 *
 * @param {string} url destination of the HTTP POST request
 * @param {string} body body of the HTTP POST request
 */
function send( url, body ) {

        // This function needs to be provided.
        PERFORM_HTTP_POST( url, body );

        //
        // Device radio was awakened
        // by calling integrationHTTPPOST,
        // so we might as well flush.
        //
        sendAllScheduled();
}
