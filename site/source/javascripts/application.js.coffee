$(document).ready ->
  $container = $('#features .list')
  $container.imagesLoaded ->
    $container.masonry
      itemSelector: '.col-md-4'
