(function($)
{
	$.fn.shadowthumb = function(options)
	{
		options = $.extend({ }, $.fn.shadowthumb.defaults, options);
		return this.each(function()
		{
			_this = $(this);
			_this.data('shadow-gallery-options', options);
			
			if (options.thumbnails)
			{
				// Set up thumbnails.
				var images = _this.filter('img').each(function()
				{
					// First pass; immediately as function is called. We do this a) so that at least
					// something has been done until the images have loaded and b) because Firefox
					// doesn't fire the 'load' event when navigating back.
					renderThumbnail(this, options.links, options);
					$(this).show();
					
					// Second pass: when image has loaded. This ensures that the width/height calculations
					// have been done correctly.
					$(this).load(function()
					{
						renderThumbnail(this, options.links, options);
					});
				});
			}
			
			if (options.shadowbox)
			{
				// Add Shadowbox relations.
				var container = _this.parent();
				if (!container.is('a'))
				{
					_this.wrap('<a href="' + _this.attr('src') + '"></a>');
					container = _this.parent();
				}

				if (container.attr('title') === undefined && _this.attr('title') !== undefined)
				{
					container.attr('title', _this.attr('title'));
				}
				
				var links = container.attr('rel', 'shadowbox[' + options.galleryId + ']');
				Shadowbox.setup($.makeArray(links), options.shadowboxOptions);
			}
		});
	};
	
	$.fn.shadowthumb.defaults =
	{
		links: true,
		thumbnails: true,
		shadowbox: true,
		shadowboxOptions: { },
		galleryId: 'shadow-gallery',
		thumbnailClass: 'thumbnail'
	};
	
	$.fn.renderThumbnails = function()
	{
		return this.filter('img').each(function()
		{
			renderThumbnail(this, false, this.data('shadow-gallery-options'));
		});
	};
	
	function renderThumbnail(image, links, options)
	{
		image = $(image);
		var container = image.parent();
		if (links)
		{
			if (container.is('a:not(.' + options.thumbnailClass + ')'))
			{
				// Don't bother generating thumbnails if a (non-generated) link's already provided.
				return;
			}
			
			if (!container.is('a.' + options.thumbnailClass))
			{
				// Generate a link to surround the image.
				image.wrap('<a href="' + image.attr('src') + '"></a>');
				container = image.parent().addClass(options.thumbnailClass);
			}
		}
		else
		{
			if (!container.is('.' + options.thumbnailClass))
			{
				// Generate an inert wrapper.
				image.wrap('<div></div>');
				container = image.parent().addClass(options.thumbnailClass);
			}
		}
		
		container.css({ 'display': 'block', 'overflow': 'hidden' });
		
		// Generate scaled thumbnails.
		var containerWidth = container.width();
		var containerHeight = container.height();
		var imageWidth = image.width();
		var imageHeight = image.height();
		var width = Math.ceil(imageWidth / imageHeight * containerHeight);
		var height = Math.ceil(imageHeight / imageWidth * containerWidth);
		if (imageWidth / imageHeight < containerWidth / containerHeight)
		{
			if (!isNaN(height))
			{
				image.css({ height: 'auto', width: containerWidth, marginTop: - (height - containerHeight) / 2, marginLeft: 0 });
			}
		}
		else
		{
			if (!isNaN(width))
			{
				image.css({ width: 'auto', height: containerHeight, marginLeft: - (width - containerWidth) / 2, marginTop: 0 });
			}
		}
	}
})(jQuery);
