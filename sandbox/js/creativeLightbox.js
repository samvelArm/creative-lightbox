(function ($) {
	window.CreativeLightbox = function (options) {
		this.outputDirectory = options.outputDirectory || document.body;
		this.transitionDelay = options.transitionDelay || 300;
		this.minTopValue = options.minTopValue || 60;
		this.minLeftValue = options.minLeftValue || 60;

		this.thumbnailWidth = options.thumbnailWidth || 150;
		this.thumbnailHeight = options.thumbnailHeight || 100;

		this.captionEnabled = options.captionEnabled || false;
		this.captionHeight = options.captionHeight || 100;

		this.currentImageIndex = 0;
		this.currentImageCount = 0;

		this.imageLoadingTimeout = options.imageLoadingTimeout || 3000;
		this.imageLoadStatusCheck = options.imageLoadStatusCheck || 30;

		this.carouselImagesMargin = options.carouselImagesMargin || 5;

		this.imageLoaded = false;
		this.mainImageCoverTimout = 700;
		this.mainImageCoverTimer = '';

		this.mapSize = options.mapSize || 10;
		this.mapIconsMaxVisible = options.mapIconsMaxVisible || 10;
		switch(options.carouselMode) {
			case 'map':
				this.carouselMode = 'map';
				break;
			case 'vertical':
				this.carouselMode = 'vertical';
				break;
			default :
				this.carouselMode = 'horizontal';
		}


		this.createIcon = function(iconClass) {
			var icon = document.createElement('div');
				icon.className = 'sprite round-icon hidden ' + iconClass;
			return icon;
		}.bind(this);

		this.create = function() {
			this.element = document.createElement('div');
			this.element.className = 'creative-lightbox hidden';

			this.closeIcon = this.createIcon('sprite-close-32 close-icon');
			this.expandIcon = this.createIcon('sprite-expand-26 expand-icon');
			this.playIcon = this.createIcon('sprite-play-32 play-icon');
			this.nextIcon = this.createIcon('sprite-right-circular-32 next-icon');
			this.prevIcon = this.createIcon('sprite-left-circular-32 prev-icon');

			this.mainArea = document.createElement('div');
			this.mainArea.className = 'main-area';

			this.mainAreaCover = document.createElement('div');
			this.mainAreaCover.className = 'main-area-cover cover';

			this.mainAreaContainer = document.createElement('div');
			this.mainAreaContainer.className = 'image-caption-area-container';

			this.mainImageWrapper = document.createElement('div');
			this.mainImageWrapper.className = 'lightbox-main-image-wrapper';

			this.mainImage = document.createElement('img');
			this.mainImage.className = 'lightbox-main-image';

			this.mainImageWrapper.appendChild(this.mainImage);

			this.mainCaptionWrapper = document.createElement('div');
			this.mainCaptionWrapper.className = 'lightbox-main-caption-wrapper';

			this.mainCaption = document.createElement('p');
			this.mainCaption.className = 'lightbox-main-caption';

			this.mainCaptionWrapper.appendChild(this.mainCaption);

			this.mainAreaContainer.appendChild(this.mainAreaCover);
			this.mainAreaContainer.appendChild(this.mainImageWrapper);
			this.mainAreaContainer.appendChild(this.mainCaptionWrapper);

			this.carouselWrapper = document.createElement('div');
			this.carouselWrapper.className = 'lightbox-carousel-wrapper';			

			this.carousel = document.createElement('ul');
			this.carousel.className = 'lightbox-carousel';

			this.carouselNextIcon = this.createIcon('sprite-fast-forward-32 carousel-next-icon');
			this.carouselPrevIcon = this.createIcon('sprite-rewind-32 carousel-prev-icon');

			this.carouselWrapper.appendChild(this.carousel);
			this.carouselWrapper.appendChild(this.carouselNextIcon);
			this.carouselWrapper.appendChild(this.carouselPrevIcon);

			this.mainLoadingLineWrapper = document.createElement('div');
			this.mainLoadingLineWrapper.className = 'main-loading-line-wrapper';
			this.mainLoadingLineIndicatior = document.createElement('div');
			this.mainLoadingLineIndicatior.className = 'main-loading-line-indicatior';

			this.mainLoadingLineWrapper.appendChild(this.mainLoadingLineIndicatior);

			this.mainLoader = this.getLoader('main-loading');

			this.mainAreaCover.appendChild(this.mainLoader);
			this.mainArea.appendChild(this.mainLoadingLineWrapper);
			this.mainArea.appendChild(this.mainAreaContainer);
			this.mainArea.appendChild(this.carouselWrapper);
			this.element.appendChild(this.mainArea);
			this.element.appendChild(this.nextIcon);
			this.element.appendChild(this.prevIcon);
			this.element.appendChild(this.closeIcon);
			this.element.appendChild(this.expandIcon);
			this.element.appendChild(this.playIcon);
			$(this.outputDirectory).append(this.element);
			this.attachEvents();
		}.bind(this);

		this.calculatePossitions = function () {
			var outputHeight = $(window).innerHeight(),
				outputWidth = $(window).innerWidth();
			// Possitioning window main icons
			var iconsY = (outputHeight*1-42)/2;
			this.nextIcon.style.top = iconsY + 'px';
			this.prevIcon.style.top = iconsY + 'px';			
			// Carousel
			if (this.carouselMode==='horizontal') {
				this.carouselWrapper.style.height = this.thumbnailHeight  + 2*this.carouselImagesMargin + 'px';	
				var carouselIconsY = ($(this.carouselWrapper).height() - 42)/2;
				this.carouselNextIcon.style.top = carouselIconsY + 'px';
				this.carouselPrevIcon.style.top = carouselIconsY + 'px';
				this.carousel.style.top = this.carouselImagesMargin + 'px';
				this.carousel.style.left = this.carouselImagesMargin + 'px';
			} else if (this.carouselMode==='map') {
				this.carouselWrapper.style.height = 0;
				this.carouselWrapper.style.zIndex = 1000;
				this.carouselNextIcon.className = 'hidden';
				this.carouselPrevIcon.className = 'hidden';
				this.carousel.style.top = '-50px';
				this.carousel.style.height = this.mapSize + this.carouselImagesMargin*2 + 'px';
			} else if (this.carouselMode==='vertical') {
				this.carouselWrapper.style.width = this.thumbnailWidth  + 2*this.carouselImagesMargin + 'px';	
				this.carouselWrapper.style.height = '100%';	
				var carouselIconsX = ($(this.carouselWrapper).width() - 42)/2;
				var carouselIconsY = ($(this.carouselWrapper).height() - 42)/2;
				this.carouselNextIcon.style.left = carouselIconsX + 'px';
				this.carouselPrevIcon.style.left = carouselIconsX + 'px';
				this.carouselPrevIcon.style.top = 10 + 'px';
				this.carouselNextIcon.style.bottom = 10 + 'px';
				this.carousel.style.top = this.carouselImagesMargin + 'px';
				this.carousel.style.left = this.carouselImagesMargin + 'px';
			}
			
			
			// 
			var mainAreaLeft = 0;
			var mainAreaWidth = 0;
			var mainAreaTop = 0;
			var mainAreaHeight = 0;

			var mainImageAreaWidth = 0;
			var mainImageAreaHeight = 0;

			// Main window size
			if (!this.imageLoaded) {
				mainAreaLeft = Math.max(outputWidth*0.1, this.minLeftValue);
				mainAreaWidth = outputWidth - 2*mainAreaLeft;
				mainAreaTop = Math.max(outputHeight*0.1, this.minTopValue);
				mainAreaHeight = outputHeight - 2*mainAreaTop;
			} else {
				var mainAreaMinLeft = Math.max(outputWidth*0.1, this.minLeftValue);
				var mainAreaMaxWidth = outputWidth - 2*mainAreaMinLeft;
				var mainAreaMinTop = Math.max(outputHeight*0.1, this.minTopValue);
				var mainAreaMaxHeight = outputHeight - 2*mainAreaMinTop;

				var mainImageAreaMaxHeight;
				var mainImageAreaMaxWidth;
				if (this.carouselMode==='vertical') {
					mainImageAreaMaxHeight = mainAreaMaxHeight;
					mainImageAreaMaxWidth = mainAreaMaxWidth - this.carouselWrapper.offsetWidth;
				} else {
					mainImageAreaMaxHeight = mainAreaMaxHeight - this.carouselWrapper.offsetHeight;
					mainImageAreaMaxWidth = mainAreaMaxWidth;
				}
				
				var imageActualHeight = this.mainImage.naturalHeight;
				var imageActualWidth = this.mainImage.naturalWidth;

				var imageActualRatio = imageActualHeight/imageActualWidth;
				var screenActualRatio = mainImageAreaMaxHeight/mainImageAreaMaxWidth;


				if (imageActualRatio>screenActualRatio) {
					if (imageActualHeight>mainImageAreaMaxHeight) {
						// Max Height
						mainImageAreaHeight = mainAreaMaxHeight*1;
						mainImageAreaWidth = mainImageAreaHeight/imageActualRatio;
					} else {
						// Image Heigth
						mainImageAreaHeight = imageActualHeight;
						mainImageAreaWidth = mainImageAreaHeight/imageActualRatio;
					}
				} else {
					//align by image width
					if (imageActualWidth>mainImageAreaMaxWidth) {
						// max Width
						mainImageAreaWidth = mainImageAreaMaxWidth;
						mainImageAreaHeight = mainImageAreaWidth*imageActualRatio;
					} else {
						// Image Width
						mainImageAreaWidth = imageActualWidth;
						mainImageAreaHeight = mainImageAreaWidth*imageActualRatio;
					}
				}
				
			}

			if (mainAreaHeight!==0 || mainAreaWidth!==0) {
				this.mainArea.style.left = mainAreaLeft + 'px';
				this.mainArea.style.width = mainAreaWidth + 'px';
				this.mainArea.style.top =  mainAreaTop + 'px';
				this.mainArea.style.height = mainAreaHeight + 'px';
			} else {
				if (this.carouselMode==='vertical') {
					mainAreaWidth = mainImageAreaWidth + this.thumbnailWidth  + 2*this.carouselImagesMargin;
					mainAreaHeight = mainImageAreaHeight;
				} else if (this.carouselMode==='horizontal') {
					mainAreaWidth = mainImageAreaWidth;
					mainAreaHeight = mainImageAreaHeight + this.thumbnailHeight  + 2*this.carouselImagesMargin ;
				} else if (this.carouselMode==='map') {
					mainAreaWidth = mainImageAreaWidth;
					mainAreaHeight = mainImageAreaHeight;
				}
				mainAreaLeft = (outputWidth - mainAreaWidth)/2;
				mainAreaTop = (outputHeight - mainAreaHeight)/2;
				this.mainArea.style.left = mainAreaLeft + 'px';
				this.mainArea.style.width = mainAreaWidth + 'px';
				this.mainArea.style.top =  mainAreaTop + 'px';
				this.mainArea.style.height = mainAreaHeight + 'px';

				this.mainImage.style.width = mainImageAreaWidth + 'px';
				this.mainImage.style.height = mainImageAreaHeight + 'px';
			}

			if (this.carouselMode === 'map') {
				var carouselAreaWidth = this.currentImageCount*(this.mapSize + this.carouselImagesMargin) + this.carouselImagesMargin;
				this.carousel.style.left = (mainAreaWidth - carouselAreaWidth)/2 + 'px';
			}

			// Correcting heights
			var loadingLineWrapperHeight = $(this.mainLoadingLineWrapper).height();
			
			
			this.mainAreaContainer.style.height = mainImageAreaHeight + 'px'; 
			this.mainAreaContainer.style.width = mainImageAreaWidth + 'px'; 
			
			this.mainImageWrapper.style.height = mainImageAreaHeight + 'px';
			this.mainImageWrapper.style.width = mainImageAreaWidth + 'px';

			this.mainLoader.style.top = (mainImageAreaHeight - 28)/2 + 'px';
			this.mainLoader.style.left = (mainImageAreaWidth - 28)/2 + 'px';
		}.bind(this);

		this.destroy = function () {			
		}.bind(this);

		this.getLoader = function(loaderClass) {
			var loader = document.createElement('div');
				loader.className = 'windows8 ' + loaderClass;
			function getBall (id) {
				var ball = document.createElement('div');
					ball.className = 'wBall';
					ball.id = 'wBall_' + id;
				var innerBall = document.createElement('div');
					innerBall.className = 'wInnerBall';
					ball.appendChild(innerBall);	
				return ball;
			}
			for (var i = 1; i <= 5; i++) {
				var ball = getBall(i);
					loader.appendChild(ball);
			}
			return loader;
		}

		// Open LightBox
		this.open = function(itemsArray, startingIndex) {
			this.currentImageIndex = startingIndex;
			this.renderCarousel(itemsArray);
			this.setMainImage();
			this.calculatePossitions();
			this.moveCarousel('', true);
			setTimeout(function(){
				$(this.element).removeClass('hidden');
				setTimeout(function(){
					$(this.element).find('.round-icon').removeClass('hidden');	
				}.bind(this), this.transitionDelay);
			
			}.bind(this), 300);
		}.bind(this);

		this.renderCarousel = function (imagesArray) {
			$(this.carousel).find('li').remove();
			this.currentImageCount = imagesArray.length;
			for (var i = 0; i < this.currentImageCount; i++) {
				var li = document.createElement('li');
					li.setAttribute('data-thumbnail', imagesArray[i].thumbnail);
					li.setAttribute('data-path', imagesArray[i].path);
					li.setAttribute('data-caption', imagesArray[i].caption);
					li.setAttribute('data-index', i);

					if (this.carouselMode==='horizontal') {
						li.style.width = this.thumbnailWidth + 'px';
						li.style.height = this.thumbnailHeight + 'px';
						li.style.left = i*(this.thumbnailWidth+this.carouselImagesMargin) + 'px';

						var carouselImageCover = document.createElement('div');
							carouselImageCover.className = 'lightbox-carousel-image-cover cover';
						var loader = this.getLoader('loader');
							loader.style.top = (this.thumbnailHeight - 28)/2 + 'px';
							loader.style.left = (this.thumbnailWidth - 28)/2 + 'px';
							carouselImageCover.appendChild(loader);
						var carouselThumbnail = document.createElement('img');
							li.appendChild(carouselImageCover);	
							li.appendChild(carouselThumbnail);
							this.carousel.appendChild(li);
						var currentThumbnail = this.checkIfimageLoaded(li);
						currentThumbnail.then(
							function(data) {
								//success
								$(data).find('.cover').addClass('hidden');
							}, 
							function(error) {
								//image was unabled to load

							}
						);
					} else if (this.carouselMode==='vertical') {
						$(this.carouselWrapper).addClass('vertical');
						li.style.width = this.thumbnailWidth + 'px';
						li.style.height = this.thumbnailHeight + 'px';
						li.style.top = i*(this.thumbnailHeight+this.carouselImagesMargin) + 'px';

						var carouselImageCover = document.createElement('div');
							carouselImageCover.className = 'lightbox-carousel-image-cover cover';
						var loader = this.getLoader('loader');
							loader.style.top = (this.thumbnailHeight - 28)/2 + 'px';
							loader.style.left = (this.thumbnailWidth - 28)/2 + 'px';
							carouselImageCover.appendChild(loader);
						var carouselThumbnail = document.createElement('img');
							li.appendChild(carouselImageCover);	
							li.appendChild(carouselThumbnail);
							this.carousel.appendChild(li);
						var currentThumbnail = this.checkIfimageLoaded(li);
						currentThumbnail.then(
							function(data) {
								//success
								$(data).find('.cover').addClass('hidden');
							}, 
							function(error) {
								//image was unabled to load

							}
						);
					} else if (this.carouselMode==='map') {
						li.style.width = this.mapSize + 'px';
						li.style.height = this.mapSize + 'px';
						li.style.left = i*(this.mapSize+this.carouselImagesMargin) + this.carouselImagesMargin + 'px';
						li.style.top = this.carouselImagesMargin + 'px';
						li.className = 'map';
						this.carousel.appendChild(li);
					}
			}
			if (this.carouselMode==='map') {
				this.attachMapHover();
			} else if (this.carouselMode==='vertical') {
				if (this.carouselNextIcon.className.search('rotate')===-1) {
					this.carouselNextIcon.className = this.carouselNextIcon.className += ' rotate';
					this.carouselPrevIcon.className = this.carouselPrevIcon.className += ' rotate';	
				}
			}
			this.attachCarouselEvents();
		}.bind(this);

		this.attachCarouselEvents = function() {
			$(this.carouselWrapper).on('click', 'div.round-icon', function(event) {
				event.preventDefault();
				/* Act on the event */
				if (event.target.className.search('carousel-prev-icon')!==-1) {
					this.moveCarousel('prev');
				} else if (event.target.className.search('carousel-next-icon')!==-1) {
					this.moveCarousel('next');
				}
			}.bind(this));
		}.bind(this);

		this.moveCarousel = function(direction, showCurrent) {
			var stepX = 0;
			var stepY = 0;

			var firstElementPredictedPossitionX = 0;
			var firstElementPredictedPossitionY = 0;
			var lastElementPredictedPossitionX = 0;
			var lastElementPredictedPossitionY = 0;
			
			if (!showCurrent) {
				if (direction==='prev') {
					if (this.carouselMode==='vertical') {
						stepY = this.thumbnailHeight + this.carouselImagesMargin;
					} else if (this.carouselMode==='horizontal') {
						stepX = this.thumbnailWidth + this.carouselImagesMargin;
					}
				} else if (direction==='next') {
					if (this.carouselMode==='vertical') {
						stepY = (-1)*(this.thumbnailHeight + this.carouselImagesMargin);
					} else if (this.carouselMode==='horizontal') {
						stepX = (-1)*(this.thumbnailWidth + this.carouselImagesMargin);
					}
				}	
			} else {
				var currentImageX = parseInt($(this.carousel).find('li.selected').css('left'));
					currentImageY = parseInt($(this.carousel).find('li.selected').css('top'));
				if (!isNaN(currentImageX)) {
					stepX = ($(this.mainArea).width() - this.thumbnailWidth - 2*this.carouselImagesMargin)/2 - currentImageX;
				}
				if (!isNaN(currentImageY)) {
					stepY = ($(this.mainArea).height() - this.thumbnailHeight - 2*this.carouselImagesMargin)/2 - currentImageY;
				}
			}
			
			firstElementPredictedPossitionX = parseInt($(this.carousel).find('li').first().css('left')) + stepX;
			if (firstElementPredictedPossitionX > 0) {
				stepX = (-1)*parseInt($(this.carousel).find('li').first().css('left'))
			}
			firstElementPredictedPossitionY = parseInt($(this.carousel).find('li').first().css('top')) + stepY;
			if (firstElementPredictedPossitionY > 0) {
				stepY = (-1)*parseInt($(this.carousel).find('li').first().css('top'))
			}
			lastElementPredictedPossitionX = parseInt($(this.carousel).find('li').last().css('left')) + stepX;
			var lastElementAllowedX = $(this.carouselWrapper).width() - this.thumbnailWidth - 2*this.carouselImagesMargin
			if (lastElementPredictedPossitionX < lastElementAllowedX) {
				stepX = lastElementAllowedX - parseInt($(this.carousel).find('li').last().css('left'))
			}
			lastElementPredictedPossitionY = parseInt($(this.carousel).find('li').last().css('top')) + stepY;
			var lastElementAllowedY = $(this.carouselWrapper).height() - this.thumbnailHeight - 2*this.carouselImagesMargin;
			if (lastElementPredictedPossitionY < lastElementAllowedY) {
				console.log(stepY);
				stepY = lastElementAllowedY - parseInt($(this.carousel).find('li').last().css('top'))
				console.log(stepY);
			}


			$(this.carousel).find('li').each(function(index, el) {
				$(el).css({
					top: parseInt($(el).css('top')) + stepY,
					left: parseInt($(el).css('left')) + stepX
				});
			});
		}.bind(this);

		this.loadImageByIndex = function(index) {
			if (index!==undefined) { this.currentImageIndex = index; }
			this.hideMainImage();
			this.mainImageCoverTimer = setTimeout(function(){
				this.setMainImage();
				this.moveCarousel('', true);
			}.bind(this), this.mainImageCoverTimout);
		}.bind(this);

		this.setMainImage = function () {
			var item = $(this.carouselWrapper).find('li').eq(this.currentImageIndex)[0];
			this.mainImageWrapper.setAttribute('data-thumbnail', item.getAttribute('data-thumbnail'));
			this.mainImageWrapper.setAttribute('data-path', item.getAttribute('data-path'));
			this.mainImageWrapper.setAttribute('data-caption', item.getAttribute('data-caption'));
			this.mainCaption.innerHTML = item.getAttribute('data-caption');
			$(item).siblings('li').removeClass('selected');
			$(item).addClass('selected');
			var currentImageLoadingPromise = this.checkIfimageLoaded(this.mainImageWrapper, 'image');		
			currentImageLoadingPromise.then(
				function(data) {
					//success
					this.showMainImage();
				}.bind(this), 
				function(error) {
					//image was unabled to load
				}.bind(this)
			);
		}.bind(this);

		this.showMainImage = function () {
			this.imageLoaded = true;
			this.calculatePossitions();
			this.hideMainImage();
			this.mainImageCoverTimer = setTimeout(function(){
				$(this.mainAreaCover).addClass('hidden');
			}.bind(this), this.mainImageCoverTimout);
		}.bind(this);

		this.hideMainImage = function () {
			$(this.mainAreaCover).removeClass('hidden');
		}.bind(this);

		this.showNextImage = function() {
			this.currentImageIndex++;
			if (this.currentImageIndex >= this.currentImageCount) {
				this.currentImageIndex = 0;
			}
			this.loadImageByIndex();
		}.bind(this);

		this.showPrevImage = function() {
			this.currentImageIndex--;
			if (this.currentImageIndex < 0) {
				this.currentImageIndex = this.currentImageCount-1;
			}
			this.loadImageByIndex();
		}.bind(this);

		this.checkIfimageLoaded = function (item, mode) {
			if (mode!=='image') { mode = 'thumbnail'; }
			if (mode === 'thumbnail') {
				$(item).find('img').attr('src', $(item).attr('data-thumbnail'));
			} else {
				$(item).find('img').attr('src', $(item).attr('data-path'));
			}
			return new Promise(function(resolve, reject) {
				function checkIfLoaded (count) {
					count = count || 0;
					if (count*this.imageLoadStatusCheck > this.imageLoadingTimeout) {
						reject(item);
					}
					count ++;
					if (!$(item).find('img')[0].complete) {
			            setTimeout(function(){
			            	checkIfLoaded(count);
			            }, this.imageLoadStatusCheck);
			            return;
			        } else {
			        	resolve(item);
			        }
				};
				checkIfLoaded();
			}.bind(this));
		}.bind(this);

		// Close LightBox
		this.close = function (event) {
			setTimeout(function(){
				$(this.element).find('.round-icon').addClass('hidden');	
				setTimeout(function(){
					$(this.element).addClass('hidden');	
				}.bind(this), this.transitionDelay);
			
			}.bind(this), 10);
		}.bind(this);

		this.toggleFullscreen = function () {
			if ($(this.expandIcon).hasClass('sprite-expand-26')) {
				$(this.expandIcon).removeClass('sprite-expand-26').addClass('sprite-collapse-26');
				this.enterFullScreen();
			} else {
				$(this.expandIcon).removeClass('sprite-collapse-26').addClass('sprite-expand-26');
				this.exitFullScreen();
			}
		}.bind(this);

		this.enterFullScreen = function () {
			var elem = this.element;
			if (elem.requestFullscreen) {
				elem.requestFullscreen();
			} else if (elem.mozRequestFullScreen) {
				elem.mozRequestFullScreen();
			} else if (elem.webkitRequestFullscreen) {
				elem.webkitRequestFullscreen();
			}
		}.bind(this);

		this.exitFullScreen = function () {
			var elem = this.element;
			if (document.cancelFullScreen) {
		   		document.cancelFullScreen();
		    } else if (document.mozCancelFullScreen) {
		    	document.mozCancelFullScreen();
		    } else if (document.webkitCancelFullScreen) {
		    	document.webkitCancelFullScreen();
		    }
		}.bind(this);

		this.togglePlayPause = function () {
			if ($(this.playIcon).hasClass('sprite-play-32')) {
				$(this.playIcon).removeClass('sprite-play-32').addClass('sprite-pause-32');
			} else {
				$(this.playIcon).removeClass('sprite-pause-32').addClass('sprite-play-32');
			}
		}.bind(this);

		this.attachMapHover = function() {
			$(this.carousel).off('mouseenter').on('mouseenter', 'li', function(event) {
				if (this.currentHovered !== event.target) {
					$(this.mapToolTip).remove();
				}
				this.currentHovered = event.target;
				var target = event.target;
				var targetTop = $(target).offset().top*1;
				var targetLeft = $(target).offset().left*1;
				var mainAreaTop = $(this.mainArea).offset().top*1;
				var mainAreaLeft = $(this.mainArea).offset().left*1;

				this.mapToolTip = document.createElement('div');
				this.mapToolTip.className = 'map-tooltip';
				var toolTipImg = document.createElement('img');
				toolTipImg.src = $(target).attr('data-thumbnail');

				this.mapToolTip.appendChild(toolTipImg);

				this.mapToolTip.style.position = 'absolute';
				
				
				this.mapToolTip.style.height = this.thumbnailHeight + 'px';
				this.mapToolTip.style.width = this.thumbnailWidth + 'px';
				this.mapToolTip.style.top = targetTop - mainAreaTop - this.thumbnailHeight*1 - 8 + 'px';
				this.mapToolTip.style.left = targetLeft - mainAreaLeft - this.thumbnailWidth/2 -1 + 'px';
				this.mapToolTip.style.zIndex = 1002;

				this.mainArea.appendChild(this.mapToolTip);

			}.bind(this));

			$(this.carousel).off('mouseleave').on('mouseleave', 'li', function(event) {
				var target = event.target;

				var toolTipToRemove = $(this.mapToolTip);
				setTimeout(function(){
					toolTipToRemove.remove();
				}, 100);
				
			}.bind(this));

		}.bind(this);

		this.attachEvents = function () {
			$(this.element).find(this.closeIcon).on('click', function(event) {
				// event.preventDefault();
				/* Act on the event */
				this.close(event);
			}.bind(this));

			$(this.element).on('click', function(event) {
				if (event.target===this.element) {
					this.close(event);	
				}
			}.bind(this));			

			$(this.element).find(this.expandIcon).on('click', function(event) {
				// event.preventDefault();
				/* Act on the event */
				this.toggleFullscreen();
			}.bind(this));
			$(this.element).find(this.playIcon).on('click', function(event) {
				// event.preventDefault();
				/* Act on the event */
				this.togglePlayPause();
			}.bind(this));

			$(this.element).find(this.nextIcon).on('click', function(event) {
				// event.preventDefault();
				/* Act on the event */
				this.showNextImage();
			}.bind(this));

			$(this.element).find(this.prevIcon).on('click', function(event) {
				// event.preventDefault();
				/* Act on the event */
				this.showPrevImage();
			}.bind(this));

			$(this.carousel).on('click', function(event) {
				var targetIndex;
				if (this.carouselMode==='horizontal') {
					targetIndex = $(event.target).parents('li').attr('data-index');
				} else if (this.carouselMode==='map') {
					targetIndex = $(event.target).attr('data-index');
				} else if (this.carouselMode==='vertical') {
					targetIndex = $(event.target).parents('li').attr('data-index');
				}
				this.loadImageByIndex(targetIndex);
			}.bind(this));

			$(window).on('resize', function(event) {
				// event.preventDefault();
				/* Act on the event */
				this.hideMainImage();
				this.calculatePossitions();
				this.mainImageCoverTimer = setTimeout(function(){
					$(this.mainAreaCover).addClass('hidden');
				}.bind(this), this.mainImageCoverTimout);
			}.bind(this));

			$(window).on('keyup', function(event){
				// event.preventDefault();
				switch(event.keyCode) {
					case 37:
						this.showPrevImage();
						break;
					case 39:
						this.showNextImage();
						break;
					case 27:
						this.close();
						break;
					case 32:
						this.togglePlayPause();
						break;
				}
				return false;
			}.bind(this));
		}.bind(this);

		this.create();
		return this;
	}
})(creativeSolutionsjQuery);

