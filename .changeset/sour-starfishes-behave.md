---
'@astrojs/markdoc': minor
---

Update the Markdoc config object for rendering Astro components as tags or nodes. Rather than importing components directly, Astro includes a new `component()` function to specify your component path. This unlocks using Astro components from npm packages and `.ts` files.

### Migration

Update all component imports to use the `component()` function like so:

```diff
// markdoc.config.mjs

import {
  defineMarkdocConfig,
+ component,
} from '@astrojs/markdoc/config';
- import Aside from './src/components/Aside.astro';

export default defineMarkdocConfig({
	tags: {
		aside: {
-     render: Aside,
+     render: component('./src/components/Aside.astro'),
			attributes: {
				type: { type: String },
				title: { type: String },
      }
    }
  }
});
```
