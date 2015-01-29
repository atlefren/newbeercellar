# -*- coding: utf-8 -*-

import json

from flask import render_template, abort
from flask_login import login_required
from flask.ext.login import current_user

from newbeercellar import app
from util import (get_or_create_default_cellar, cellars_for_user,
                  get_cellar, serialize_cellar)
from decorators import cellar_owner


@app.route('/')
def index():
    if not current_user.is_authenticated():
        return render_template('index.html')

    cellars = cellars_for_user(current_user.id)
    return render_template(
        'cellar_list.html',
        cellars=cellars
    )


def return_cellar(cellar_data, is_owner):
    return render_template(
        'cellar.html',
        bottles=json.dumps(cellar_data['bottles']),
        cellar_name=cellar_data['cellarName'],
        cellar_id=cellar_data['cellarId'],
        is_owner=is_owner
    )


def owns_cellar(cellar):
    if not current_user.is_authenticated():
        return False
    return cellar.user_id == current_user.id


@app.route('/cellar/<int:cellar_id>')
def view_cellar(cellar_id):
    cellar = get_cellar(cellar_id)
    is_owner = owns_cellar(cellar)
    if cellar.is_public or is_owner:
        return return_cellar(serialize_cellar(cellar), is_owner)
    if not current_user.is_authenticated():
        abort(401)
    abort(403)


@app.route('/cellar/<int:cellar_id>/edit')
@login_required
@cellar_owner
def edit_cellar(cellar_id):
    return "edit!"


@app.route('/defaultcellar')
@login_required
def defaultcellar():
    return return_cellar(get_or_create_default_cellar(current_user), True)
