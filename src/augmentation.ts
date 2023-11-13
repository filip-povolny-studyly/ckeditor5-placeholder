import type { Placeholder } from './index';

declare module '@ckeditor/ckeditor5-core' {
	interface PluginsMap {
		[ Placeholder.pluginName ]: Placeholder;
	}
}
