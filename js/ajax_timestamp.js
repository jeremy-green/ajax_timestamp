/**
 * @file
 * A JavaScript file for the theme.
 *
 * In order for this JavaScript to be loaded on pages, see the instructions in
 * the README.txt next to this file.
 */

// JavaScript should be made compatible with libraries other than jQuery by
// wrapping it with an "anonymous closure". See:
// - https://drupal.org/node/1446420
// - http://www.adequatelygood.com/2010/3/JavaScript-Module-Pattern-In-Depth
(function ($, Drupal, window, document, undefined) {

// To understand behaviors, see https://drupal.org/node/756722#behaviors
Drupal.behaviors.ajax_timestamp = {
  attach: function(context, settings) {

    var ajaxTimestamp = {

      offsetMap: {
        'Y': 'getFullYear',
        'm': 'getMonth',
        'i': 'getMinutes'
      },

      browser: function() {
        $.getJSON('/ajax-timestamp')
          .then(function(data) {
            return data;
          })
          .done(function(data) {
            var classes = [],
                i = 0,
                date = data.date,
                prop;

            for (prop in date) {
              if (date.hasOwnProperty(prop)) {
                classes[i] = ajaxTimestamp.formatProperty(prop, date[prop]);
                i++;
              }
            }

            if (data.custom !== undefined) {
              classes = classes.concat(ajaxTimestamp.doCustom(data.custom));
            }

            if (data.offset) {
              classes = classes.concat(ajaxTimestamp.doOffset(date));
            }

            $('html').addClass(classes.join(' '));
          });
      },

      doCustom: function(custom) {
        var a = [],
            i = 0;
        for (prop in custom) {
          if (custom.hasOwnProperty(prop)) {
            if (prop.length === 1) {
              custom[prop] = prop + '-' + custom[prop];
            }
            a[i] = this.getMachineName(custom[prop]);
            i++;
          }
        }
        return a;
      },

      doOffset: function(date) {

        var map = this.offsetMap,
            d = new Date(),
            a = [];

        for (prop in map) {
          if (map.hasOwnProperty(prop) && date[prop] !== undefined) {
            var j = parseInt(d[map[prop]](), 10),
                p = parseInt(date[prop], 10);

            //php outputs month 1-12
            //js outputs month 0-11
            if (prop === 'm') {
              j += 1;
            }

            if (j != p) {
              a.push('off' + prop, 'off' + prop + '-' + (j-p).toString());
            }
          }
        }

        return a;
      },

      formatProperty: function(prop, value) {
        return this.getMachineName(prop) + '-' + this.getMachineName(value);
      },

      getMachineName: function(value) {
        return value.toLowerCase().replace(/[^a-z0-9-]+/gi, '-');
      }

    };

    ajaxTimestamp.browser();

  }

};

})(jQuery, Drupal, this, this.document);
