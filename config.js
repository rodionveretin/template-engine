import * as eta from 'eta';

eta.configure({
  cache: false,
  tags: ['/*%', '%*/'],
  varName: "rdo",
  views: 'templates',
})