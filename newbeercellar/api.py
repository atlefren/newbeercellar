# -*- coding: utf-8 -*-

import json

from flask import request, Response, current_app

from models import RbBeer, RbBrewery, Bottle, Cellar
from newbeercellar import app
from util import get_cellar_data

api_prefix = '/api/v1'


@app.route(api_prefix + '/search/beer/')
def search():
    query = request.args.get('q')
    db = current_app.db_session
    res = db.query(RbBeer).filter(RbBeer.name.ilike('%' + query + '%'))

    brewery_id = request.args.get('brewery', None)
    if brewery_id:
        res = res.filter(RbBeer.brewery_id == brewery_id)
    x = [beer.serialize for beer in res.limit(10).all()]
    return Response(json.dumps(x), content_type='application/json')


@app.route(api_prefix + '/search/brewery/')
def search_brewery():
    query = request.args.get('q')
    db = current_app.db_session
    res = db.query(RbBrewery).filter(RbBrewery.name.ilike('%' + query + '%'))
    x = [brewery.serialize for brewery in res.limit(10).all()]
    return Response(json.dumps(x), content_type='application/json')


@app.route(api_prefix + '/cellar/<int:cellar_id>/add/', methods=['POST'])
def save_bottle(cellar_id):
    data = request.json
    db = current_app.db_session
    beer = db.query(RbBeer).get(data['beerId'])
    cellar = db.query(Cellar).get(cellar_id)

    bottle = Bottle(beer, cellar, data)
    db.add(bottle)
    db.commit()

    return_data = bottle.serialize
    return Response(
        json.dumps(return_data),
        content_type='application/json',
        status=201
    )


@app.route(api_prefix + '/cellar/<int:cellar_id>')
def cellar_data(cellar_id):
    cellar_data = get_cellar_data(cellar_id)
    return Response(
        json.dumps(cellar_data),
        content_type='application/json'
    )
