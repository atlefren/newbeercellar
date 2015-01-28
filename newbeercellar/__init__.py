# -*- coding: utf-8 -*-

import os
from flask import Flask
from webassets.loaders import PythonLoader
from flask.ext.assets import Environment

from database import init_db

app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY', 'development_fallback')
app.debug = os.environ.get('DEBUG', False)

assets = Environment(app)
assets.debug = True if app.debug == 'True' else False
bundles = PythonLoader('newbeercellar.assetbundles').load_bundles()

for name, bundle in bundles.iteritems():
    assets.register(name, bundle)


from newbeercellar import views
from newbeercellar import api

(app.db_session, app.db_metadata, app.db_engine) = init_db()


