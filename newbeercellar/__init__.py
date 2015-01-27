# -*- coding: utf-8 -*-

import os
from flask import Flask

from database import init_db


app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY', 'development_fallback')
app.debug = os.environ.get('DEBUG', False)
(app.db_session, app.db_metadata, app.db_engine) = init_db()

from newbeercellar import views
from newbeercellar import api
