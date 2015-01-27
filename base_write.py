# -*- coding: utf-8 -*-

from sqlalchemy.orm.exc import NoResultFound

from newbeercellar.database import init_db
from newbeercellar.models import (RbBeer, RbBrewery)


def get_database():
    return init_db()


def get_rb_brewery(name, db_session):
    try:
        return db_session.query(RbBrewery).filter(RbBrewery.name == name).one()
    except NoResultFound:
        brewery = RbBrewery(name)
        db_session.add(brewery)
        db_session.commit()
        db_session.refresh(brewery)
        return brewery


def create_or_update_rb_beer(db_session, ratebeer_id, name,
                             short_name, brewery, rating, num):
    try:
        beer = db_session.query(RbBeer).filter(RbBeer.name == name).one()
        beer.rating = rating
        beer.num = num
    except NoResultFound:
        beer = RbBeer(ratebeer_id, name, short_name, brewery, rating, num)
    db_session.add(beer)


def write_rb_data(breweries):
    db_session, db_metadata, db_engine = get_database()
    for brewery_name in breweries.keys():
        brewery = RbBrewery(brewery_name)
        db_session.add(brewery)
    db_session.commit()

    counter = 0
    for brewery_name, beers in breweries.items():
        brewery = get_rb_brewery(brewery_name, db_session)
        for beer in beers:
            create_or_update_rb_beer(
                db_session,
                beer["id"],
                beer["name"],
                beer["short_name"],
                brewery,
                beer["num1"],
                beer["num2"]
            )
            counter += 1
            if counter % 1000 == 0:
                print counter
    db_session.commit()
