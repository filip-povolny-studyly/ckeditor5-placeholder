import { expect } from 'chai';
import { Placeholder as PlaceholderDll, icons } from '../src';
import Placeholder from '../src/placeholder';

import buttonIcon from './../theme/icons/button.svg';

describe( 'CKEditor5 Placeholder DLL', () => {
	it( 'exports Placeholder', () => {
		expect( PlaceholderDll ).to.equal( Placeholder );
	} );

	describe( 'icons', () => {
		it( 'exports the "ckeditor" icon', () => {
			expect( icons.buttonIcon ).to.equal( buttonIcon );
		} );
	} );
} );
