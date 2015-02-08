# -*- coding: utf-8 -*-

from flask import Flask
from webassets.loaders import PythonLoader
from flask.ext.assets import Environment
from flask_googlelogin import GoogleLogin
from flask_login import LoginManager
from flask.ext.sqlalchemy import SQLAlchemy

# from database import init_db

# load config
app = Flask(__name__)

db = SQLAlchemy(app)

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

app.db_session = db.session
