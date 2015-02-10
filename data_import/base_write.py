# -*- coding: utf-8 -*-

from sqlalchemy.orm.exc import NoResultFound
from sqlalchemy import exists

from newbeercellar.models import (RbBeer, RbBrewery)


class RbBeerImporter(object):

    def __init__(self, db):
        self.db = db
        self.new_beers = 0
        self.new_breweries = 0

    def brewery_exists(self, brewery_name):
        return self.db.session.query(
            exists().where(RbBrewery.name == brewery_name)
        ).scalar()

    def add_breweries(self, breweries):
        for brewery_name in breweries.keys():
            if not self.brewery_exists(brewery_name):
                brewery = RbBrewery(brewery_name)
                self.db.session.add(brewery)
        self.db.session.commit()

    def create_or_update_rb_beer(self, brewery, beer_data):
        try:
            beer = self.db.session.query(RbBeer).filter(
                RbBeer.name == beer_data['name']
            ).one()
            beer.rating = beer_data['num1']
            beer.num = beer_data['num2']
        except NoResultFound:
            beer = RbBeer(
                beer_data['ratebeer_id'],
                beer_data['name'],
                beer_data['short_name'],
                brewery,
                beer_data['rating'],
                beer_data['num']
            )
            self.new_beers += 1
        self.db.session.add(beer)

    def get_rb_brewery(self, name):
        try:
            return self.db.session.query(RbBrewery).filter(
                RbBrewery.name == name
            ).one()
        except NoResultFound:
            self.new_breweries += 1
            brewery = RbBrewery(name)
            self.db.session.add(brewery)
            self.db.session.commit()
            self.db.session.refresh(brewery)
            return brewery

    def add_beers(self, breweries):
        counter = 0
        for brewery_name, beers in breweries.items():
            brewery = self.get_rb_brewery(brewery_name)
            for beer in beers:
                self.create_or_update_rb_beer(brewery, beer)
                counter += 1
                if counter % 1000 == 0:
                    print 'commit at %s' % counter
                    self.db.session.commit()

        self.db.session.commit()

    def write_rb_data(self, breweries):

        print 'Adding %d breweries.' % len(breweries)
        self.add_breweries(breweries)

        print 'Importing beers.'
        self.add_beers(breweries)

        print 'Import complete.'
        print 'New breweries: %s' % self.new_breweries
        print 'New beers: %s' % self.new_beers


def write_rb_data(breweries, db):
    importer = RbBeerImporter(db)
    importer.write_rb_data(breweries)
