import * as eta from 'eta';

export default () => {
  eta.configure({
    cache: false,
    tags: ['/*%', '%*/'],
    varName: "rdo",
    views: 'templates',
  })
}