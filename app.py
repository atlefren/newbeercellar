# -*- coding: utf-8 -*-
import os, json
from flask import Flask, render_template, request, current_app, Response

from database import init_db
from models import RbBeer, RbBrewery, Bottle, Cellar


def create_views(app):

    @app.route('/cellar/<int:cellar_id>')
    def view_cellar(cellar_id):
        cellar = current_app.db_session.query(Cellar).get(cellar_id)
        bottles = [bottle.serialize for bottle in cellar.bottles]
        return render_template('index.html', bottles=json.dumps(bottles))

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
    def save_bottle():
        data = request.json
        db = current_app.db_session
        brewery = db.query(RbBrewery).get(data['breweryId'])
        beer = db.query(RbBeer).get(data['beerId'])

        cellar = db.query(Cellar).get(1)

        bottle = Bottle(beer, cellar, data)
        db.add(bottle)
        db.commit()
        
        return_data = bottle.serialize
        return Response(
            json.dumps(return_data),
            content_type='application/json',
            status=201
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
    app.run(host='0.0.0.0', port=port, debug=True)

