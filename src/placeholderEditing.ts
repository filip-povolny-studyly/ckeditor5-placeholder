import { Plugin } from 'ckeditor5/src/core';
import type {
	DowncastWriter,
	Element,
	ViewContainerElement,
	ViewUIElement
} from 'ckeditor5/src/engine';
import {
	Widget,
	toWidget,
	viewToModelPositionOutsideModelElement
} from 'ckeditor5/src/widget';

import {
	CLASS_NAME,
	CLASS_NAME_CONTAINER,
	CLASS_NAME_ID_REGEXP,
	CLASS_NAME_SIZE_REGEXP,
	CLASS_NAME_TYPE_REGEXP,
	COMMAND_NAME,
	PLACEHOLDER_REGEXP,
	SCHEMA_ITEM_NAME
} from './constants';
import PlaceholderCommand from './placeholderCommand';
import { createInputPlaceholder } from './utils';

export default class PlaceholderEditing extends Plugin {
	public static get requires() {
		return [ Widget ] as const;
	}

	public init(): void {
		this._defineSchema();
		this._defineConverters();

		const editor = this.editor;

		editor.commands.add(
			COMMAND_NAME,
			new PlaceholderCommand( this.editor )
		);

		editor.editing.mapper.on(
			'viewToModelPosition',
			viewToModelPositionOutsideModelElement(
				editor.model,
				viewElement => viewElement.hasClass( CLASS_NAME_CONTAINER )
			)
		);
	}

	private _defineSchema() {
		const schema = this.editor.model.schema;

		schema.register( SCHEMA_ITEM_NAME, {
			inheritAllFrom: '$inlineObject',
			allowAttributes: [ 'type', 'size', 'id' ]
		} );
	}

	private _defineConverters() {
		const conversion = this.editor.conversion;

		conversion.for( 'upcast' ).elementToElement( {
			view: {
				name: 'span',
				classes: CLASS_NAME_CONTAINER
			},
			model: ( viewElement, { writer } ) => {
				const data = ( viewElement.getChild( 0 ) as Text | undefined )?.data;
				// if there is no (text) data, do not convert
				if ( !data ) {
					return null;
				}
				const attrs = data.match( PLACEHOLDER_REGEXP )?.groups;
				return createInputPlaceholder( writer, attrs );
			}
		} );

		conversion.for( 'upcast' ).elementToElement( {
			view: {
				name: 'span',
				classes: CLASS_NAME
			},
			model: ( viewElement, { writer } ) => {
				const className = viewElement.getAttribute( 'class' )!;
				const attrs = {
					type: className.match( CLASS_NAME_TYPE_REGEXP )?.[ 1 ],
					size: className.match( CLASS_NAME_SIZE_REGEXP )?.[ 1 ],
					id: className.match( CLASS_NAME_ID_REGEXP )?.[ 1 ]
				};
				return createInputPlaceholder( writer, attrs );
			}
		} );

		conversion.for( 'dataDowncast' ).elementToElement( {
			model: SCHEMA_ITEM_NAME,
			view: ( modelElement, { writer } ) => {
				const containerElement = this._createContainerElement( writer );
				writer.insert(
					writer.createPositionAt( containerElement, 0 ),
					writer.createText( this._getText( modelElement ) )
				);
				return containerElement;
			}
		} );

		conversion.for( 'editingDowncast' ).elementToElement( {
			model: SCHEMA_ITEM_NAME,
			view: ( modelElement, { writer } ) => {
				const containerElement = this._createContainerElement( writer );
				writer.insert(
					writer.createPositionAt( containerElement, 0 ),
					this._createUIElement( modelElement, writer )
				);
				return toWidget( containerElement, writer );
			}
		} );
	}

	/**
	 * @description create an input placeholder container HTML element
	 * @param {DowncastWriter} writer downcast writer to create the HTML element
	 * @returns {ViewContainerElement} input placeholder container HTML element
	 */
	private _createContainerElement(
		writer: DowncastWriter
	): ViewContainerElement {
		return writer.createContainerElement( 'span', {
			class: CLASS_NAME_CONTAINER
		} );
	}

	/**
	 * @description create an input placeholder HTML UI element
	 * @param {Element} modelElement model element
	 * @param {DowncastWriter} writer downcast writer to create the HTML element
	 * @returns {ViewUIElement} input placeholder HTML element
	 */
	private _createUIElement(
		modelElement: Element,
		writer: DowncastWriter
	): ViewUIElement {
		const { t } = this.editor.locale;
		const attrs = new Map( modelElement.getAttributes() );
		const classNames = Array.from( attrs ).map(
			( [ key, value ] ) => `input-placeholder-${ key }-${ value }`
		);
		return writer.createUIElement(
			'span',
			{
				class: [ CLASS_NAME, ...classNames ].join( ' ' ),
				// this must be set to be able to properly put cursor behind the widget
				style: 'user-select: none'
			},
			function( domDocument ) {
				const domElement = this.toDomElement( domDocument );
				domElement.innerText = t( 'Solution' );
				return domElement;
			}
		);
	}

	/**
	 * @description create a text for input placeholder
	 * @param {Element} modelElement model element
	 * @returns {string} text for input placeholder
	 */
	private _getText( modelElement: Element ): string {
		const attrs = new Map( modelElement.getAttributes() );
		const type = attrs.get( 'type' );
		const size = attrs.get( 'size' );
		const id = attrs.get( 'id' );
		return `{{${ type ?? 'input' }${ size !== undefined ? `-${ size }` : '' }${
			id !== undefined ? `-${ id }` : ''
		}}}`;
	}
}
