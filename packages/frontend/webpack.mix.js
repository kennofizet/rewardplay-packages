const mix = require('laravel-mix');

mix.js('src/index.js', 'dist')
   .setPublicPath('dist')
   .options({
     processCssUrls: false
   });

if (mix.inProduction()) {
  mix.version();
}

