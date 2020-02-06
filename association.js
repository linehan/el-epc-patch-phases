///////////////////////////////////////////////////////////////////////////////
// INTERNAL VARIABLES
///////////////////////////////////////////////////////////////////////////////

//
// Identifier used to associate events in a pageview.
// @type {string}
//
var cachedPageviewID: null;

//
// Identifier used to associate events in a session.
// @type {string}
//
var cachedSessionID: null;

///////////////////////////////////////////////////////////////////////////////
// METHODS
///////////////////////////////////////////////////////////////////////////////

function pageviewID() {

	if ( !cachedPageviewID ) {
		cachedPageviewID = GENERATE_ID();
	}

	return cachedPageviewID;
}

function sessionID( refresh ) {

	if ( !cachedSessionID ) {
		// Attempt to fetch stored ID.
		cachedSessionID = GET_STORED_VALUE( 'sid' );

		if ( !cachedSessionID ) {
			// Generate new ID and write to storage.
			cachedSessionID = GENERATE_ID();
			SET_STORED_VALUE( 'sid', cachedSessionID );
		}
	}

	return cachedSessionID;
}

// TODO: Consider making this into a branch of sessionID() with a bool.
function beginNewSession() {

	// Unset and remove ID from storage.
	cachedSessionID = null;
	SET_STORED_VALUE( 'sid', null );

	// New session => new pageview.
	cachedPageviewID = null;
}

