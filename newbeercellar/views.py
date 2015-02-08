# -*- coding: utf-8 -*-

import simplejson as json

from flask import render_template, abort, redirect, url_for
from flask_login import login_required
from flask.ext.login import current_user

from newbeercellar import app
from util import (get_or_create_default_cellar, cellars_for_user,
                  get_cellar, serialize_cellar, get_user_by_username,
                  public_cellars_for_username)
from decorators import cellar_owner


@app.route('/')
def index():
    if not current_user.is_authenticated():
        return render_template('index.html')
    return redirect(url_for('cellar_list', username=current_user.username))


@app.route('/<string:username>/cellars/')
def cellar_list(username):
    user = get_user_by_username(username)
    if user == current_user:
        cellars = cellars_for_user(current_user.id)
    else:
        cellars = public_cellars_for_username(username)
    return render_template(
        'cellar_list.html',
        cellars=cellars,
        username=username
    )


def return_cellar(cellar_data, is_owner, username):
    return render_template(
        'cellar.html',
        bottles=json.dumps(cellar_data['bottles']),
        cellar_name=cellar_data['cellarName'],
        cellar_id=cellar_data['cellarId'],
        is_owner=is_owner,
        username=username
    )


def owns_cellar(cellar):
    if not current_user.is_authenticated():
        return False
    return cellar.user_id == current_user.id


@app.route('/<string:username>/cellars/<int:cellar_id>')
def view_cellar(username, cellar_id):
    cellar = get_cellar(cellar_id)
    is_owner = owns_cellar(cellar)
    if cellar.is_public:
        if cellar.user.username == username:
            return return_cellar(serialize_cellar(cellar), is_owner, username)
        else:
            abort(404)
    if is_owner:
        return return_cellar(serialize_cellar(cellar), is_owner, username)
    if not current_user.is_authenticated():
        abort(401)
    abort(403)


@app.route('/<string:username>/cellars/<int:cellar_id>/edit')
@login_required
@cellar_owner
def edit_cellar(username, cellar_id):
    return "edit cellar"


@app.route('/profile')
@login_required
def edit_profile():
    return "edit profile"


@app.route('/<string:username>/defaultcellar')
@login_required
def defaultcellar(username):
    return return_cellar(
        get_or_create_default_cellar(current_user),
        True,
        username
    )
