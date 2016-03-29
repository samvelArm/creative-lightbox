(function($) {
	$(document).ready(function() {
		var myLightbox = new CreativeLightbox({
			carouselMode: 'vertical'
		});
		$('li').on('click', function(event) {
			event.preventDefault();
			/* Act on the event */
			var imagesToShow = [];
			var target = event.target;
			var startingIndex = 0;
			$('li>img').each(function(index, el) {
				if (el===target) {
					startingIndex = index;
				}
				var currentImage = {
					thumbnail : $(el).attr('src'),
					path : $(el).attr('data-path'),
					caption : $(el).attr('data-caption')
				}
				imagesToShow.push(currentImage);
			});
			myLightbox.open(imagesToShow, startingIndex);
		});
		console.log(myLightbox);
	});
})(creativeSolutionsjQuery);