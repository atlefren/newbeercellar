# -*- coding: utf-8 -*-
import os
from flask import Flask
from webassets.loaders import PythonLoader
from flask.ext.assets import Environment
from flask_googlelogin import GoogleLogin
from flask_login import LoginManager
from flask.ext.sqlalchemy import SQLAlchemy


app = Flask(__name__)

# load config
app.config.update(
    DEBUG=os.environ.get('DEBUG', False),
    SECRET_KEY=os.environ.get('SECRET_KEY', ''),
    GOOGLE_LOGIN_CLIENT_ID=os.environ.get('GOOGLE_LOGIN_CLIENT_ID', ''),
    GOOGLE_LOGIN_CLIENT_SECRET=os.environ.get('GOOGLE_LOGIN_CLIENT_SECRET', ''),
    GOOGLE_LOGIN_REDIRECT_URI=os.environ.get('GOOGLE_LOGIN_REDIRECT_URI', ''),
    SQLALCHEMY_DATABASE_URI=os.environ.get('SQLALCHEMY_DATABASE_URI', ''),
)

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
