import type {
	Config,
	ConfigType as MarkdocConfig,
	MaybePromise,
	NodeType,
	Schema,
} from '@markdoc/markdoc';
import _Markdoc from '@markdoc/markdoc';
import type { AstroInstance } from 'astro';
import { heading } from './heading-ids.js';

export type Render = AstroInstance['default'] | URL | string;

export type AstroMarkdocConfig<C extends Record<string, any> = Record<string, any>> = Omit<
	MarkdocConfig,
	'tags' | 'nodes'
> &
	Partial<{
		tags: Record<string, Schema<Config, Render>>;
		nodes: Partial<Record<NodeType, Schema<Config, Render>>>;
		ctx: C;
		extends: MaybePromise<ResolvedAstroMarkdocConfig>[];
	}>;

export type ResolvedAstroMarkdocConfig = Omit<AstroMarkdocConfig, 'extends'>;

export const Markdoc = _Markdoc;
export const nodes = { ...Markdoc.nodes, heading };

export function defineMarkdocConfig(config: AstroMarkdocConfig): AstroMarkdocConfig {
	return config;
}
