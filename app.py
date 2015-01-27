# -*- coding: utf-8 -*-
import os, json
from flask import Flask, render_template, request, current_app, Response

from database import init_db
from models import RbBeer, RbBrewery, Bottle, Cellar


def get_cellar_data(cellar_id):
    cellar = current_app.db_session.query(Cellar).get(cellar_id)
    bottles = sorted(
        [bottle.serialize for bottle in cellar.bottles],
        key=lambda x: x["id"],
        reverse=True
    )
    return {"cellarName": cellar.name, "bottles": bottles}


def create_views(app):

    @app.route('/cellar/<int:cellar_id>')
    def view_cellar(cellar_id):
        cellar_data = get_cellar_data(cellar_id)
        return render_template(
            'cellar.html',
            bottles=json.dumps(cellar_data['bottles']),
            cellar_name=cellar_data['cellarName']
        )


def create_api(app, api_prefix):

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
        brewery = db.query(RbBrewery).get(data['breweryId'])
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
    create_api(app, '/api/v1')
    app.run(host='0.0.0.0', port=port, debug=True)
