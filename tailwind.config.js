const c = (name) => `rgb(var(--${name}) / <alpha-value>)`;
export default { content: ['./index.html','./src/**/*.{ts,tsx}'],
 theme: { extend: { colors: { paper: c('bg'), surface: c('surface'), forest: c('text'), slate2: c('muted'), teal: c('accent'), ink: c('ink'), amber2: c('amber'), coral: c('coral') } } } };
