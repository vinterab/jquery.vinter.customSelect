(function ($, undef) {

	$.fn.customSelect = function (settings) {
		var defaults = {
			wrapperClass: 'ui-select-wrap',
			selectedClass: 's-selected',
			includeActiveItem: false,
			hideText: false,
			onChange: undef,
			showEvent: 'click',
			hideEvent: 'click'
		};

		settings = $.extend(true, defaults, settings);

		return this.each(function () {

			var self = $(this);

			/**
			* Hide the options
			*
			* @method hideOptions
			*/
			function hideOptions() {

				self.removeClass('s-active').find('ul').hide();
				self.on(settings.showEvent, showOptions);

			}

			/**
			* Show the options
			*
			* @method showOptions
			*/
			function showOptions() {

				var html, tooltip;

				//self.on(settings.hideEvent, hideTooltip);
				self.off(settings.showEvent);
				self.addClass('s-active').find('ul').show();

				self.on('click', '.' + settings.selectedClass, hideOptions);

				self.on('click', 'li', function(e) {

					var target = $(e.currentTarget);

					if (settings.includeActiveItem === false) {
						self.find('li').show().eq(target.index()).hide();
					}

					self.find('.' + settings.selectedClass).html(target.data('content'));

					if (typeof settings.onChange === 'function') {
						var option = $('<option />', {
							selected: 'selected',
							value: target.data('value'),
							text: target.data('text')
						});
						settings.onChange(option[0]);
					}

					hideOptions();
				});

			}

			/**
			* Hide the tooltip and restore the title attribute
			*
			* @method hideTooltip
			*/
			function hideTooltip() {

				var title = self.data("original-title");

				if (title.length > 0) {
					self.attr("title", title);
				}

				self.find('.' + settings.tooltipClass).remove();
			}

			function getContent(option) {
				var html = '';

				if (option.data('img')) {
					html += '<img src="' + option.data('img') + '" alt="' + option.text() + '" />';
				}

				if (settings.hideText === false) {
					html += option.text();
				}

				return html;
			}

			function init() {
				var wrapper = $('<div />').addClass(settings.wrapperClass);
				var options = self.find('option');

				var selected = self.find('option[selected]').length ? self.find('option[selected]').eq(0) : options.eq(0);

				wrapper.append($('<div />', {
					'class': settings.selectedClass,
					html: getContent(selected)
				}));

				var ul = $('<ul>');

				for (var i = 0, length = options.length, option, li; i < length; i++) {

					option = $(options[i]);					
					li = $('<li />', {
						data: {
							value: option.attr('value'),
							content: getContent(option),
							text: option.text()
						},
						html: getContent(option)
					});

					ul.append(li);

					if (settings.includeActiveItem === false && i === selected.index()) {
						li.hide();
					}
				}

				wrapper.append(ul);

				// Set self to new custom select jQuery object
				self.after(wrapper);
				self.remove();
				self = wrapper;

				self.on(settings.showEvent, showOptions);
			}

			init();

		});
	};

} (jQuery));