import { Plugin } from 'ckeditor5/src/core';
import PlaceholderEditing from './placeholderEditing';
import PlaceholderUI from './placeholderUI';

export default class Placeholder extends Plugin {
	public static get pluginName() {
		return 'Placeholder' as const;
	}

	public static get requires() {
		return [ PlaceholderEditing, PlaceholderUI ] as const;
	}
}
