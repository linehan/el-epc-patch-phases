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

///////////////////////////////////////////////////////////////////////////////
// METHODS
///////////////////////////////////////////////////////////////////////////////

/**
 * Set stream configuration.
 * @param {Object} someStreamConfig stream configuration to incorporate.
 */
function configure( someStreamConfig ) {
	var stream;

	if ( someStreamConfig ) {
		for ( stream in someStreamConfig ) {
			if ( !( stream in streamConfig ) ) {
				// Existing values are NOT overwritten.
				streamConfig[ stream ] = someStreamConfig[ stream ];
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

	// Set the other meta fields.
	data.meta.stream = stream;
	data.meta.id = GET_UUID_V4();

	// Schedule the event for transmission.
	SCHEDULE( streamConfig[ stream ].intake_url || config.intakeUrl, data );
}



