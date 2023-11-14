import type { Placeholder } from './index';
import type PlaceholderConfig from './placeholderConfig';

declare module '@ckeditor/ckeditor5-core' {
	interface PluginsMap {
		[ Placeholder.pluginName ]: Placeholder;
	}
}

declare module '@ckeditor/ckeditor5-core/src/editor/editorconfig' {
	interface EditorConfig {
		placeholderPlugin?: PlaceholderConfig;
	}
}
