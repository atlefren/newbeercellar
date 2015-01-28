# -*- coding: utf-8 -*-

import json

from flask import render_template, abort
from flask_login import login_required
from flask.ext.login import current_user

from newbeercellar import app
from util import get_cellar_data, get_or_create_default_cellar


@app.route('/')
def index():
    return render_template(
        'index.html'
    )


def return_cellar(cellar_data):
    return render_template(
        'cellar.html',
        bottles=json.dumps(cellar_data['bottles']),
        cellar_name=cellar_data['cellarName'],
        cellar_id=cellar_data['cellarId'],
    )


@app.route('/cellar/<int:cellar_id>')
@login_required
def view_cellar(cellar_id):
    cellar_data = get_cellar_data(cellar_id)
    if cellar_data:
        return return_cellar(cellar_data)
    abort(404)


@app.route('/defaultcellar')
@login_required
def defaultcellar():
    return return_cellar(get_or_create_default_cellar(current_user))
