from flask.ext.assets import Bundle

from newbeercellar import app

js_filters = []
css_filters = []

minify = not app.debug

if minify:
    # Use jsmin and cssmin when not running in debug
    js_filters.append('jsmin')
    css_filters.append('cssmin')


js_base = Bundle(
    'js/lib/jquery/dist/jquery.min.js',
    'js/lib/bootstrap/dist/js/bootstrap.min.js',
    output='gen/js_base.js' if minify else None
)


react_js = 'js/lib/react/react.js'
if minify:
    react_js = 'js/lib/react/react.min.js'

js_cellar = Bundle(
    js_base,
    'js/lib/underscore/underscore-min.js',
    'js/lib/momentjs/min/moment.min.js',
    react_js,
    Bundle(
        'js/src/Util.js',
        'js/lib/bootstrap-datepicker/js/bootstrap-datepicker.js',
        'js/src/gen/SearchHeader.js',
        'js/src/gen/QuickFilter.js',
        'js/src/gen/Autocomplete.js',
        'js/src/gen/BottleList.js',
        'js/src/gen/BottleCreator.js',
        'js/src/gen/TableHeader.js',
        'js/src/gen/CellarApp.js',
        filters=js_filters
    ),
    output='gen/js_cellar.js' if minify else None
)

css_base = Bundle(
    'js/lib/bootstrap/dist/css/bootstrap.min.css',
    Bundle(
        'css/base.css',
        'css/header.css',
        filters=css_filters
    ),
    filters=['cssrewrite'],
    output='gen/css_base.css'
)

css_cellar = Bundle(
    css_base,
    Bundle(
        'js/lib/bootstrap-datepicker/css/datepicker3.css',
        'css/clear-btn.css',
        'css/edit-btn.css',
        'css/autocomplete.css',
        'css/table.css',
        filters=css_filters
    ),
    filters=['cssrewrite'],
    output='gen/css_cellar.css'
)
