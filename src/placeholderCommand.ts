import { Command } from 'ckeditor5/src/core';
import { PLACEHOLDERS_REGEXP, SCHEMA_ITEM_NAME } from './constants';
import { createInputPlaceholder } from './utils';

export default class PlaceholderCommand extends Command {
	/**
	 * @description execute the command to insert input placeholders
	 * @param {string} [template] template string with {{input-XY}} placeholders
	 */
	public override execute( template: string ): void {
		if ( template === undefined ) {
			throw Error(
				'Argument "template" is required in inputPlaceholderCommand.'
			);
		}

		const model = this.editor.model;

		model.change( writer => {
			const inputPlaceholderMatches = Array.from(
				template.matchAll( PLACEHOLDERS_REGEXP )
			);

			let text = template;
			inputPlaceholderMatches.forEach( match => {
				const [ textBefore, textAfter ] = text.split( match[ 0 ], 2 );
				// insert text before the input placeholder
				if ( textBefore ) {
					model.insertContent( writer.createText( textBefore ) );
				}

				// insert input placeholder element

				model.insertContent( createInputPlaceholder( writer, match.groups ) );

				// update the remaining text
				text = textAfter;
			} );

			// insert the text after the last input placeholder
			if ( text ) {
				model.insertContent( writer.createText( text ) );
			}
		} );

		this.editor.editing.view.focus();
	}

	public override refresh(): void {
		const model = this.editor.model;
		const selection = model.document.selection;
		const isAllowed = model.schema.checkChild(
			selection.focus?.parent as any,
			SCHEMA_ITEM_NAME
		);
		this.isEnabled = isAllowed;
	}
}
