# -*- coding: utf-8 -*-

import json

from flask import render_template, abort
from flask_login import login_required
from flask.ext.login import current_user

from newbeercellar import app
from util import (get_cellar_data, get_or_create_default_cellar,
                  cellars_for_user)
from decorators import cellar_owner


@app.route('/')
def index():
    if not current_user.is_authenticated():
        return render_template(
            'index.html'
        )
    cellars = cellars_for_user(current_user.id)
    return render_template(
        'cellar_list.html',
        cellars=cellars
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


@app.route('/cellar/<int:cellar_id>/edit')
@login_required
@cellar_owner
def edit_cellar(cellar_id):
    return "edit!"


@app.route('/defaultcellar')
@login_required
def defaultcellar():
    return return_cellar(get_or_create_default_cellar(current_user))
