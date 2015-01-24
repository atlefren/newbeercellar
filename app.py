# -*- coding: utf-8 -*-
import os
from flask import Flask, render_template, request, jsonify, current_app

from database import init_db
from models import RbBeer, RbBrewery


def create_views(app):
    @app.route('/')
    def index():
        db = current_app.db_session
        beers = db.query(RbBeer).all()
        return render_template('index.html', beers=beers)

def create_app(debug):
    app = Flask(__name__)
    app.secret_key = os.environ.get('SECRET_KEY', 'development_fallback')
    app.debug = debug
    (app.db_session, app.db_metadata, app.db_engine) = init_db()
    return app


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app = create_app(os.environ.get('DEBUG', False))
    create_views(app)
    app.run(host='0.0.0.0', port=port, debug=True)

