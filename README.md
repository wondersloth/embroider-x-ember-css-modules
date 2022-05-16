# embroider-x-ember-css-modules

## Problem
When an **embroider** app using `ember-css-modules` depends on a `v1` /  _classic_ addon using `ember-css-modules`, the generated scoped classnames in the css file don't match the classnames injected in the templates.

### Investigation

- Only happens when doing an embroider app build with a v1 / classic addon using ecm.
- In `generate-scoped-name`  the paths used lack the `moduleName`.

## Classic (Working)
**Steps to Reproduce**
```bash
$ cd packages/some-addon
$ yarn build;
$ cd ../sample-app;
$ EMBROIDER=false DEBUG=ember-css-modules:* JOBS=0 node ./node_modules/.bin/ember build  
```

**OUTPUT**
```bash      
ember-css-modules:addon included in sample-app +0ms
ember-css-modules:addon included in some-addon +2s
ember-css-modules:output-styles-preprocessor concatenating module stylesheets: { inputFiles: [ '**/*.css' ], outputFile: 'some-addon.css', allowNone: true, sourceMapConfig: undefined } +0ms
ember-css-modules:output-styles-preprocessor concatenating module stylesheets: { inputFiles: [ '**/*.css' ], outputFile: '/assets/sample-app.css', allowNone: true, sourceMapConfig: undefined } +108ms
ember-css-modules:generate-scoped-name scoped class .greeting-container => ._greeting-container_i4dy9v (/some-addon/components/greeting.css) +0ms
ember-css-modules:generate-scoped-name scoped class .greeting-message => ._greeting-message_i4dy9v (/some-addon/components/greeting.css) +1ms
ember-css-modules:generate-scoped-name scoped class .addon-container => ._addon-container_18zxja (/some-addon/components/layout.css) +3ms
ember-css-modules:output-styles-preprocessor implicit dependencies: [] +9s
ember-css-modules:output-styles-preprocessor sorted dependencies [] +1ms
ember-css-modules:generate-scoped-name scoped class .salutation-container => ._salutation-container_148er7 (/sample-app/components/salutation.css) +1s
ember-css-modules:generate-scoped-name scoped class .salutation-message => ._salutation-message_148er7 (/sample-app/components/salutation.css) +0ms
ember-css-modules:generate-scoped-name scoped class .app-container => ._app-container_1u42fn (/sample-app/styles/application.css) +3ms
ember-css-modules:modules-preprocessor recording dependency from /var/folders/1p/grc2p_g11hz13gkj8413rqv00003jl/T/broccoli-49704yQHB67T9yf4h/out-269-module_source_funnel/sample-app/styles/application.css to /Users/medwards/Workspace/os/embroider-x-ember-css-modules/packages/some-addon/addon/components/layout.css +0ms
ember-css-modules:generate-scoped-name scoped class .addon-container => ._addon-container_18zxja (/some-addon/components/layout.css) +3ms
ember-css-modules:output-styles-preprocessor implicit dependencies: [] +3s
ember-css-modules:output-styles-preprocessor sorted dependencies [] +1ms
```

## Embroider (Broken)
**Steps to Reproduce**
```bash
$ cd packages/some-addon
$ yarn build;
$ cd ../sample-app;
$ EMBROIDER=false DEBUG=ember-css-modules:* JOBS=0 node ./node_modules/.bin/ember build
```

**OUTPUT**
Output from `ember-css-modules`
```
ember-css-modules:addon included in sample-app +0ms
ember-css-modules:addon included in some-addon +1s
ember-css-modules:output-styles-preprocessor concatenating module stylesheets: { inputFiles: [ '**/*.css' ], outputFile: 'some-addon.css', allowNone: true, sourceMapConfig: undefined } +0ms
ember-css-modules:output-styles-preprocessor concatenating module stylesheets: { inputFiles: [ '**/*.css' ], outputFile: '/assets/sample-app.css', allowNone: true, sourceMapConfig: undefined } +173ms
ember-css-modules:generate-scoped-name scoped class .greeting-container => ._greeting-container_1lfv76 (/components/greeting.css) +0ms
ember-css-modules:generate-scoped-name scoped class .greeting-message => ._greeting-message_1lfv76 (/components/greeting.css) +1ms
ember-css-modules:generate-scoped-name scoped class .addon-container => ._addon-container_1tmc29 (/components/layout.css) +3ms
ember-css-modules:output-styles-preprocessor implicit dependencies: [] +2s
ember-css-modules:output-styles-preprocessor sorted dependencies [] +1ms
ember-css-modules:generate-scoped-name scoped class .salutation-container => ._salutation-container_1p5xxd (/components/salutation.css) +7s
ember-css-modules:generate-scoped-name scoped class .salutation-message => ._salutation-message_1p5xxd (/components/salutation.css) +0ms
ember-css-modules:generate-scoped-name scoped class .app-container => ._app-container_1qsai7 (/styles/application.css) +4ms
ember-css-modules:modules-preprocessor recording dependency from /var/folders/1p/grc2p_g11hz13gkj8413rqv00003jl/T/broccoli-50180NUROXZ9lrujc/out-541-module_source_funnel/styles/application.css to /Users/medwards/Workspace/os/embroider-x-ember-css-modules/packages/some-addon/addon/components/layout.css +0ms
ember-css-modules:generate-scoped-name scoped class .addon-container => ._addon-container_18zxja (/some-addon/components/layout.css) +3ms
ember-css-modules:output-styles-preprocessor implicit dependencies: [] +4s
ember-css-modules:output-styles-preprocessor sorted dependencies [] +1ms
```

## Differences

In an embroider build the file paths don't contain the the `modulePrefix` between **classic** vs **embroider**:

```diff
-ember-css-modules:generate-scoped-name scoped class .salutation-container => ._salutation-container_148er7 (/sample-app/components/salutation.css) +1s
+ember-css-modules:generate-scoped-name scoped class .salutation-container => ._salutation-container_1p5xxd (/components/salutation.css) +7s
```


#### vendor.css

- Note the paths are incorrect.
- Note the hashes don't match.

**GOOD**
```css
/* styles for some-addon/components/greeting.css */
._greeting-container_i4dy9v {
  border: 1px dashed green;
}

._greeting-message_i4dy9v {
  color: green;
}

/* styles for some-addon/components/layout.css */
._addon-container_18zxja {
  border: 2px solid magenta !important;
}
```

**BAD**
```css
/* styles for components/greeting.css */
._greeting-container_1lfv76 {
  border: 1px dashed green;
}

._greeting-message_1lfv76 {
  color: green;
}

/* styles for components/layout.css */
._addon-container_1tmc29 {
  border: 2px solid magenta !important;
}
```
