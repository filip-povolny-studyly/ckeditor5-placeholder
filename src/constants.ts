export const PLUGIN_NAME = 'Placeholder';
export const UI_NAME = 'placeholderButton';
export const COMMAND_NAME = 'placeholder';
export const SCHEMA_ITEM_NAME = 'placeholder';
export const CONFIG_KEY = 'placeholderPlugin';
export const CONFIG_DEFAULT_TEXT = 'Placeholder';
export const EVENT_CLICK_NAME = 'placeholder';
export const CLASS_NAME = 'input-placeholder';
export const CLASS_NAME_CONTAINER = `${ CLASS_NAME }-container`;

const TYPE_PATTERN = 'input|math|text|select';
const SIZE_PATTERN = 'xs|sm|md|lg|xl';
const ID_PATTERN = '\\d+';
export const CLASS_NAME_TYPE_REGEXP = new RegExp(
	`${ CLASS_NAME }-type-(${ TYPE_PATTERN })`
);
export const CLASS_NAME_SIZE_REGEXP = new RegExp(
	`${ CLASS_NAME }-size-(${ SIZE_PATTERN })`
);
export const CLASS_NAME_ID_REGEXP = new RegExp(
	`${ CLASS_NAME }-id-(${ ID_PATTERN })`
);
export const PLACEHOLDER_REGEXP = new RegExp(
	`{{(?<type>${ TYPE_PATTERN })(?:-(?<size>${ SIZE_PATTERN }))?-(?<id>${ ID_PATTERN })}}`
);
export const PLACEHOLDERS_REGEXP = new RegExp( PLACEHOLDER_REGEXP, 'g' );
