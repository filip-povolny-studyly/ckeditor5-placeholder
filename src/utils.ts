import type { Element, Writer } from 'ckeditor5/src/engine';
import { SCHEMA_ITEM_NAME, PLACEHOLDERS_REGEXP } from './constants';

/**
 * @description get input placeholder IDs in format {{input-XY}} from the given text
 * @param {string} text text with input placeholders
 * @returns {Array<number>} list of input placeholder
 */
export function getIds( text: string ): Array<number> {
	return Array.from( text.matchAll( PLACEHOLDERS_REGEXP ) ).map(
		( { groups } ) => Number.parseInt( groups!.id )
	);
}

/**
 * @description find the largest placeholder ID from the editor data and return it, increased by 1
 * @param {string} text rich text
 * @returns {number} next placeholder ID to be used in the new input placeholder
 */
export function getNextId( text: string ): number {
	const ids = getIds( text );

	if ( ids.length === 0 ) {
		return 1;
	}
	return arrayMax( ids ) + 1;
}

/**
 * @description get the maximum value from an unempty array of numbers
 * @param {Array<number>} array array of numbers
 * @returns {number} maximum value from the array of numbers
 */
export function arrayMax( array: Array<number> ): number {
	return array.reduce( ( prev, curr ) => Math.max( prev, curr ) );
}

/**
 * @description create model element for input placeholder
 * @param {Writer} writer upcast writer
 * @param {PlaceholderParams} attrs input placeholder attributes
 * @returns {Element} model element
 */
export function createInputPlaceholder(
	writer: Writer,
	attrs: { [ key: string]: string | undefined } | undefined
): Element {
	const { type, size, id } = attrs ?? {};
	return writer.createElement( SCHEMA_ITEM_NAME, {
		...( type && type !== 'input' && { type } ),
		...( size && { size } ),
		...( id && { id: Number.parseInt( id ) } )
	} );
}
