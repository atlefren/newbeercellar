# -*- coding: utf-8 -*-

from flask import Flask
from webassets.loaders import PythonLoader
from flask.ext.assets import Environment
from flask_googlelogin import GoogleLogin
from flask_login import LoginManager

from database import init_db

# load config
app = Flask(__name__)


# load config
app.config.from_object('newbeercellar.settings')

# setup assetbundle
assets = Environment(app)
assets.debug = True if app.debug == 'True' else False
bundles = PythonLoader('newbeercellar.assetbundles').load_bundles()
for name, bundle in bundles.iteritems():
    assets.register(name, bundle)


# setup login stuff
login_manager = LoginManager()
login_manager.init_app(app)
googlelogin = GoogleLogin(app, login_manager)

# add various views
from newbeercellar import login
from newbeercellar import views
from newbeercellar import api

# init the database
(app.db_session, app.db_metadata, app.db_engine) = init_db(
    app.config['DATABASE_URL']
)
