# -*- coding: utf-8 -*-

import simplejson as json

from flask import render_template, abort, redirect, url_for, request, flash
from flask_login import login_required
from flask.ext.login import current_user

from newbeercellar import app
from util import (cellars_for_user, get_cellar, serialize_cellar,
                  get_user_by_username, public_cellars_for_username,
                  update_cellar, get_beer, cellars_with_beer, number_of_beers)
from decorators import cellar_owner


@app.route('/')
def index():
    if not current_user.is_authenticated():
        return render_template('index.html')
    return redirect(url_for('cellar_list', username=current_user.username))


@app.route('/beer/<int:beer_id>')
def beer(beer_id):
    beer = get_beer(beer_id)
    user = None
    own_cellars = None
    amount = None
    if current_user.is_authenticated():
        user = current_user
        own_cellars = cellars_with_beer(beer, user, exclude=False)
        amount = number_of_beers(beer, user)
    cellars = cellars_with_beer(beer, user)

    return render_template(
        'beer.html',
        beer=beer,
        cellars=cellars,
        own_cellars=own_cellars,
        amount=amount
    )


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


@app.route('/<string:username>/cellars/<int:cellar_id>/edit', methods=['GET', 'POST'])
@login_required
@cellar_owner
def edit_cellar(username, cellar_id):
    cellar = get_cellar(cellar_id)
    if request.method == 'POST':
        is_public = True if request.form.get('is_public') == 'on' else False
        name = request.form.get('cellar_name')
        update_cellar(cellar, name, is_public)
        flash('Cellar updated')
    return render_template('edit_cellar.html', cellar=cellar)


@app.route('/profile')
@login_required
def edit_profile():
    return "edit profile"
