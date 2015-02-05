# -*- coding: utf-8 -*-

import simplejson as json

from flask import request, Response, current_app
from flask.ext.login import current_user
from flask_login import login_required

from models import RbBeer, RbBrewery, Bottle, Cellar
from newbeercellar import app
from util import get_cellar_data

api_prefix = '/api/v1'


def generate_error(status_code, message):
    return Response(
        json.dumps({"message": message}),
        content_type='application/json',
        status=status_code
    )


def get_limit():
    limit = request.args.get('limit', 10, type=int)
    return limit if limit <= 100 else 100


@app.route(api_prefix + '/search/beer/')
def search():
    query = request.args.get('q')
    db = current_app.db_session
    res = db.query(RbBeer).filter(RbBeer.name.ilike('%' + query + '%'))

    brewery_id = request.args.get('brewery', None)
    if brewery_id:
        res = res.filter(RbBeer.brewery_id == brewery_id)
    x = [beer.serialize for beer in res.limit(get_limit()).all()]
    return Response(json.dumps(x), content_type='application/json')


@app.route(api_prefix + '/search/brewery/')
def search_brewery():
    query = request.args.get('q')
    db = current_app.db_session
    res = db.query(RbBrewery).filter(RbBrewery.name.ilike('%' + query + '%'))
    x = [brewery.serialize for brewery in res.limit(get_limit()).all()]
    return Response(json.dumps(x), content_type='application/json')


@app.route(api_prefix + '/cellar/<int:cellar_id>/add/', methods=['POST'])
@login_required
def save_bottle(cellar_id):
    db = current_app.db_session
    cellar = db.query(Cellar).get(cellar_id)

    if cellar.user_id != current_user.id:
        return generate_error(403, 'Not your cellar!')

    data = request.json

    beer = db.query(RbBeer).get(data['beerId'])

    bottle = Bottle(beer, cellar, data)
    db.add(bottle)
    db.commit()

    return_data = bottle.serialize
    return Response(
        json.dumps(return_data),
        content_type='application/json',
        status=201
    )


@app.route(api_prefix + '/bottle/<int:bottle_id>/', methods=['PUT', 'DELETE'])
@login_required
def edit_bottle(bottle_id):
    db = current_app.db_session
    bottle = db.query(Bottle).get(bottle_id)

    if request.method == 'DELETE':
        db.delete(bottle)
        db.commit()
        return Response(status=204)

    data = request.json

    bottle.update(data)
    db.add(bottle)
    db.commit()
    return_data = bottle.serialize
    return Response(
        json.dumps(return_data),
        content_type='application/json',
        status=200
    )


@app.route(api_prefix + '/cellar/<int:cellar_id>')
def cellar_data(cellar_id):
    cellar_data = get_cellar_data(cellar_id)
    return Response(
        json.dumps(cellar_data),
        content_type='application/json'
    )
