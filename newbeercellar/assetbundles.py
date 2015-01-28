from flask.ext.assets import Bundle

js_cellar = Bundle(
    'js/lib/jquery/dist/jquery.js',
    'js/lib/underscore/underscore-min.js',
    'js/lib/react/react.js',
    'js/lib/momentjs/min/moment.min.js',
    'js/src/Util.js',
    'js/lib/bootstrap-datepicker/js/bootstrap-datepicker.js',
    'js/src/gen/SearchHeader.js',
    'js/src/gen/QuickFilter.js',
    'js/src/gen/Autocomplete.js',
    'js/src/gen/BottleList.js',
    'js/src/gen/BottleCreator.js',
    'js/src/gen/TableHeader.js',
    'js/src/gen/CellarApp.js',
    output='gen/js_cellar.js'
)

css_base = Bundle(
    'js/lib/bootstrap/dist/css/bootstrap.css',
    'css/header.css',
    filters=['cssrewrite'],
    output='gen/css_base.css'
)

css_cellar = Bundle(
    css_base,
    'js/lib/bootstrap-datepicker/css/datepicker3.css',
    'css/clear-btn.css',
    'css/edit-btn.css',
    'css/table.css',
    filters=['cssrewrite'],
    output='gen/css_cellar.css'
)
