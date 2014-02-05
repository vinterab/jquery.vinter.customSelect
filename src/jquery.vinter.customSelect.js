/*! jquery.vinter.customSelect - v1.1.0 - 2013-09-02
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
			onChanged: undef,
			onInit: undef,
			onOpen: undef,
			onClose: undef,
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
				var options = e.data.options;

				self.off(settings.showEvent);
				self.addClass('s-active').find('ul').show();

				if (typeof settings.onOpen === 'function') {
					settings.onOpen(options);
				}

				self.on('click', '.' + settings.selectedClass, { options: options }, hideOptions);


				self.on('click', 'li', function (e) {

					var target = $(e.currentTarget),
						index = target.index();

					if (settings.includeActiveItem === false) {
						self.find('li').show().eq(index).hide();
					}

					self.find('.' + settings.selectedClass).html('<span>' + target.data('content') + '</span>');

					if (typeof settings.onChange === 'function') {
						settings.onChange(options[index]);
					}

					$(select)
						.find('option')
						.prop('selected', false)
						.eq(index)
						.prop('selected', true);

					self.find('.' + settings.selectedClass).trigger('click');

					if (typeof settings.onChanged === 'function') {
						settings.onChanged(options[index], index);
					}
				});

			}

			function getContent(option) {
				var html = '';

				if (option.data('img')) {
					html += '<img src="' + option.data('img') + '" alt="' + option.text() + '" />';
				}

				if (settings.hideText === false) {
					html += option.data('img') ? '<span>' + option.text() + '</span>' : option.text();
				}

				return html;
			}

			function init() {
				var wrapper = $('<div />').addClass(settings.wrapperClass);
				var options = select.find('option');

				var selected = select.find('option[selected]').length ? select.find('option[selected]').eq(0) : options.eq(0);

				wrapper.append($('<div />', {
					'class': settings.selectedClass,
					html: '<span>' + getContent(selected) + '</span>'
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
				select.addClass('visuallyhidden');
				self = wrapper;

				self.on(settings.showEvent, { options: options }, showOptions);

				select.on('change', function () {
					wrapper.find('li').eq(this.selectedIndex).trigger('click');
				});

				if (typeof settings.onInit === 'function') {
					settings.onInit(self, options);
				}
			}

			init();

		});
	};

}(jQuery));
