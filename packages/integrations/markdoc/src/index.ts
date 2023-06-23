/* eslint-disable no-console */
import type { AstroIntegration, ContentEntryType, HookParameters } from 'astro';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { prependForwardSlash } from './utils.js';
import { bold, red, yellow } from 'kleur/colors';
import { normalizePath } from 'vite';
import { loadMarkdocConfig, type MarkdocConfigResult } from './load-config.js';
import { getContentEntryType } from './content-entry-type.js';

type SetupHookParams = HookParameters<'astro:config:setup'> & {
	// `contentEntryType` is not a public API
	// Add type defs here
	addContentEntryType: (contentEntryType: ContentEntryType) => void;
};

export default function markdocIntegration(legacyConfig?: any): AstroIntegration {
	if (legacyConfig) {
		console.log(
			`${red(
				bold('[Markdoc]')
			)} Passing Markdoc config from your \`astro.config\` is no longer supported. Configuration should be exported from a \`markdoc.config.mjs\` file. See the configuration docs for more: https://docs.astro.build/en/guides/integrations-guide/markdoc/#configuration`
		);
		process.exit(0);
	}
	let markdocConfigResult: MarkdocConfigResult | undefined;
	let markdocConfigResultId = '';
	return {
		name: '@astrojs/markdoc',
		hooks: {
			'astro:config:setup': async (params) => {
				const {
					config: astroConfig,
					updateConfig,
					addContentEntryType,
				} = params as SetupHookParams;

				markdocConfigResult = await loadMarkdocConfig(astroConfig);
				if (markdocConfigResult) {
					markdocConfigResultId = normalizePath(fileURLToPath(markdocConfigResult.fileUrl));
				}

				addContentEntryType(await getContentEntryType({ markdocConfigResult, astroConfig }));

				updateConfig({
					vite: {
						vite: {
							ssr: {
								external: ['@astrojs/markdoc/prism', '@astrojs/markdoc/shiki'],
							},
						},
					},
				});
			},
			'astro:server:setup': async ({ server }) => {
				server.watcher.on('all', (event, entry) => {
					if (prependForwardSlash(pathToFileURL(entry).pathname) === markdocConfigResultId) {
						console.log(
							yellow(
								`${bold('[Markdoc]')} Restart the dev server for config changes to take effect.`
							)
						);
					}
				});
			},
		},
	};
}
