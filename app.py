# -*- coding: utf-8 -*-
import os, json
from flask import Flask, render_template, request, current_app, Response

from database import init_db
from models import RbBeer, RbBrewery


def create_views(app):
    @app.route('/')
    def index():
        return render_template('index.html')

    @app.route('/search/beer')
    def search():
        query = request.args.get('q')
        db = current_app.db_session
        res = db.query(RbBeer).filter(RbBeer.name.ilike('%' + query + '%'))

        brewery_id = request.args.get('brewery', None)
        if brewery_id:
            res = res.filter(RbBeer.brewery_id == brewery_id)
        x = [beer.serialize for beer in res.limit(10).all()]
        return Response(json.dumps(x), content_type='application/json')

    @app.route('/search/brewery')
    def search_brewery():
        query = request.args.get('q')
        db = current_app.db_session
        res = db.query(RbBrewery).filter(RbBrewery.name.ilike('%' + query + '%'))        
        x = [brewery.serialize for brewery in res.limit(10).all()]
        return Response(json.dumps(x), content_type='application/json')

    @app.route('/save', methods=['POST'])
    def save_item():
        data = request.json
        db = current_app.db_session
        brewery = db.query(RbBrewery).get(data['breweryId'])
        beer = db.query(RbBeer).get(data['beerId'])

        return_data = {
            "breweryName": brewery.name,
            "beerName": beer.name,
            "beerId": beer.id,
            "batchNo": data.get('batchNo', None),
            "brewDate": data.get('brewDate', None),
            "bbfDate": data.get('bbfDate', None),
            "size": data.get('size', None),
            "amount": data.get('amount', 1),
            "comment": data.get('comment', None),
        }
        return Response(json.dumps(return_data), content_type='application/json', status=201)
        #res = db.query(RbBrewery).filter(RbBrewery.name.ilike('%' + query + '%'))        
        #x = [brewery.serialize for brewery in res.limit(10).all()]
        #return Response(json.dumps(x), content_type='application/json')

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

