import { Plugin } from 'ckeditor5/src/core';
import { ClickObserver } from 'ckeditor5/src/engine';
import { ButtonView } from 'ckeditor5/src/ui';
import type { Emitter } from 'ckeditor5/src/utils';
import buttonIcon from '../theme/icons/button.svg';
import {
	COMMAND_NAME,
	EVENT_CLICK_NAME,
	SCHEMA_ITEM_NAME,
	UI_NAME
} from './constants';
import { getNextId } from './utils';

/**
 * Button to insert input placeholder.
 *
 * Currently not used, input placeholders are inserted by calling placeholder command from outside.
 */
export default class PlaceholderUI extends Plugin {
	public init(): void {
		const editor = this.editor;
		const t = editor.t;

		editor.ui.componentFactory.add( UI_NAME, locale => {
			const view = new ButtonView( locale );

			view.set( {
				label: t( 'Add placeholder' ),
				icon: buttonIcon,
				tooltip: true
			} );

			view.on( 'execute', () => {
				// get the next input placehodler ID from the editor data
				const id = getNextId( editor.data.get() );

				editor.execute( COMMAND_NAME, `{{input-${ id }}}` );
			} );

			return view;
		} );

		const view = editor.editing.view;
		view.addObserver( ClickObserver );
		const viewDocument = view.document as unknown as Emitter;
		this.listenTo( viewDocument, 'click', ( _event, data ) => {
			const modelElement = editor.editing.mapper.toModelElement(
				data.target.parent
			);
			if ( modelElement && modelElement.name === SCHEMA_ITEM_NAME ) {
				editor.model.document.fire(
					EVENT_CLICK_NAME,
					modelElement.getAttribute( 'id' )
				);
			}
		} );
	}
}
