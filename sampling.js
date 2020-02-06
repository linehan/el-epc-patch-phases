///////////////////////////////////////////////////////////////////////////////
// METHODS
///////////////////////////////////////////////////////////////////////////////

/**
 * Compute a boolean function on a random identifier.
 *
 * @param {string} token string of random hexadecimal digits
 * @param {Object} logic sampling logic from stream configuration
 * @return {boolean}
 */
function inSample( token, logic ) {
	if ( !logic ) {
		// True by default
		return true;
	}

	// Note only 32 bits of randomness is used.
	token = parseInt( token.slice( 0, 8 ), 16 );
	return ( token % logic.one_in_every ) === 0;
}

