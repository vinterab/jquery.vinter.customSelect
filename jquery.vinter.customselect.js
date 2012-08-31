/*! jquery.vinter.customSelect - v1.0.0 - 2012-08-31
* https://github.com/vinterab/jquery.vinter.customSelect/
* Copyright (c) 2012 Vinter AB; Licensed MIT */

(function ($, undef) {

	$.fn.customSelect = function (settings) {
		var defaults = {
			wrapperClass: 'ui-select-wrap',
			selectedClass: 's-selected',
			includeActiveItem: false,
			hideText: false,
			onChange: undef,
			onInit: undef,
			onOpened: undef,
			onClosed: undef,
			showEvent: 'click',
			hideEvent: 'click'
		};

		settings = $.extend(true, defaults, settings);

		return this.each(function () {

			var self, select = $(this);


			/**
			* Hide the options
			*
			* @method hideOptions
			*/
			function hideOptions(e) {

				var options = e.data.options;

				self.removeClass('s-active').find('ul').hide();
				self.on(settings.showEvent, { options: options }, showOptions);

				if (typeof settings.onClosed === 'function') {
					settings.onClosed(options);
				}

			}

			/**
			* Show the options
			*
			* @method showOptions
			*/
			function showOptions(e) {

				var html, tooltip, options = e.data.options;

				self.off(settings.showEvent);
				self.addClass('s-active').find('ul').show();

				if (typeof settings.onOpened === 'function') {
					settings.onOpened(options);
				}

				self.on('click', '.' + settings.selectedClass, {options: options}, hideOptions);

				self.on('click', 'li', function(e) {

					var target = $(e.currentTarget),
							index = target.index();

					if (settings.includeActiveItem === false) {
						self.find('li').show().eq(index).hide();
					}

					self.find('.' + settings.selectedClass).html(target.data('content'));

					if (typeof settings.onChange === 'function') {
						settings.onChange(options[index]);
					}

					$(select)
						.find('option').removeAttr('selected')
						.eq(index).attr('selected', 'selected');

					self.find('.' + settings.selectedClass).trigger('click');
				});

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
				var options = select.find('option');

				var selected = select.find('option[selected]').length ? select.find('option[selected]').eq(0) : options.eq(0);

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

				// Set select to new custom select jQuery object
				select.after(wrapper);
				select.hide();
				self = wrapper;

				self.on(settings.showEvent, { options: options }, showOptions);

				if (typeof settings.onInit === 'function') {
					settings.onInit(self, options);
				}
			}

			init();

		});
	};

} (jQuery));
