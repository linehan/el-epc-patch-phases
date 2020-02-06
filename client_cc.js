///////////////////////////////////////////////////////////////////////////////
// CONFIGURATION
///////////////////////////////////////////////////////////////////////////////

var config = {
	//
	// This URL will be used to POST all events.
	//
	intakeUrl: moduleConfig.EventLoggingIntakeUrl,
}

///////////////////////////////////////////////////////////////////////////////
// INTERNAL-USE VARIABLES
///////////////////////////////////////////////////////////////////////////////

//
// Holds stream configuration JSON,
// indexed by stream name.
//
var streamConfig = {};

//
// Maps each stream name to an array
// (possibly empty) of stream names
// to which its events should be
// copied.
//
var streamCopyTo = {};

///////////////////////////////////////////////////////////////////////////////
// METHODS
///////////////////////////////////////////////////////////////////////////////

/**
 * Set stream configuration.
 * @param {Object} someStreamConfig stream configuration to incorporate.
 */
function configure( someStreamConfig ) {
	var stream,
        x,
        y;

	if ( someStreamConfig ) {
        //
        // Update streamConfig object
        //
		for ( stream in someStreamConfig ) {
			if ( !( stream in streamConfig ) ) {
				// Existing values are NOT overwritten.
				streamConfig[ stream ] = someStreamConfig[ stream ];
			}
		}

        //
        // Update streamCopyTo object
        //
        for ( x in config ) {
            streamCopyTo[ x ] = [];
            for ( y in streamConfig ) {
                if ( y.indexOf( x + '.' ) === 0 ) {
                    streamCopyTo[ x ].push( y );
                }
            }
        }
    }
}

/**
 * Produce an event according to the given stream's configuration.
 *
 * @param {string} stream name of the stream to send @object to
 * @param {Object} data data to send to @stream
 */
function produce( stream, data ) {

	if ( CLIENT_CANNOT_BE_TRACKED() ) {
		// If the client is DNT, send no events.
		return;
	}

	if ( !streamConfig[ stream ] ) {
		// Given stream has no stream configuration.
		return;
	}

	if ( !data ) {
		// Some events might not add any data.
		data = {};
	}

	if ( !data.meta ) {
		// Only set the timestamp on the first invocation.
		data.meta = {
			dt: GENERATE_ISO_8601_TIMESTAMP()
		};
	}

    for ( i = 0; i < streamCopyTo[ stream ].length; i++ ) {
        //
        // Invocation on a stream 'x'
        // shall result in invocation
        // on any stream 'x.*' (with
        // a copy of the event data).
        //
        // An event's copy shall have
        // timestamp equal to that of
        // the original.
        //
        // No information besides the
        // original event data and the
        // original timestamp shall pass
        // between stream 'x' and 'x.*'.
        //
        produce( streamCopyTo[ stream ][ i ], Object.assign( {}, data ) );
    }

	// Set the other meta fields.
	data.meta.stream = stream;
	data.meta.id = GET_UUID_V4();

	// Schedule the event for transmission.
	SCHEDULE( streamConfig[ stream ].intake_url || config.intakeUrl, data );
}



