$(document).ready ->
  $container = $('#features > .container > .row')
  $container.masonry({ itemSelector: '.feature' })