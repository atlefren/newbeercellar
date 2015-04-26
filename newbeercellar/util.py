# -*- coding: utf-8 -*-

from flask import current_app, flash
from sqlalchemy.orm.exc import NoResultFound
from sqlalchemy.sql import func

from models import Cellar, User, RbBeer, Bottle


def serialize_cellar(cellar):
    bottles = sorted(
        [bottle.serialize for bottle in cellar.bottles],
        key=lambda x: x["id"],
        reverse=True
    )
    return {
        "cellarId": cellar.id,
        "cellarName": cellar.name,
        "bottles": bottles
    }


def user_owns_cellar(user_id, cellar_id):
    try:
        current_app.db_session.query(Cellar).filter(
            Cellar.user_id == user_id,
            Cellar.id == cellar_id
        ).one()
        return True
    except NoResultFound:
        return False


def number_of_beers(beer, user):
    return current_app.db_session.query(func.sum(Bottle.amount))\
        .filter(Bottle.beer_id == beer.id)\
        .filter(Bottle.cellar_id == Cellar.id)\
        .filter(Cellar.user_id == user.id)\
        .scalar()


def get_cellar(cellar_id):
    return current_app.db_session.query(Cellar).get(cellar_id)


def cellars_with_beer(beer, user=None, exclude=True):
    res = current_app.db_session.query(Cellar) \
        .filter(Cellar.id == Bottle.cellar_id) \
        .filter(Bottle.beer_id == beer.id)
    if user:
        if exclude:
            res = res.filter(Cellar.user_id != user.id)
        else:
            res = res.filter(Cellar.user_id == user.id)
    if not user or exclude:
        res = res.filter(Cellar.is_public == True)
    return res.all()


def get_beer(beer_id):
    return current_app.db_session.query(RbBeer).get(beer_id)


def get_cellar_data(cellar_id):
    cellar = get_cellar(cellar_id)
    if cellar:
        return serialize_cellar(cellar)
    return None


def get_or_create_default_cellar(user):
    cellar = None
    try:
        cellar = current_app.db_session.query(Cellar).filter(
            Cellar.user_id == user.id,
            Cellar.is_default == True
        ).one()
    except NoResultFound:
        flash('created')
        cellar = Cellar('My Beer Cellar', user, is_default=True)
        current_app.db_session.add(cellar)
        current_app.db_session.commit()

    return cellar


def cellars_for_user(user_id):
    return current_app.db_session.query(Cellar).filter(
        Cellar.user_id == user_id
    ).all()


def update_cellar(cellar, name, is_public):
    cellar.name = name
    cellar.is_public = is_public
    current_app.db_session.add(cellar)
    current_app.db_session.commit()


def get_user_by_username(username):
    return current_app.db_session.query(User).filter(User.username == username).first()


def public_cellars_for_username(username):
    user = get_user_by_username(username)
    return current_app.db_session.query(Cellar).filter(
        Cellar.user_id == user.id,
        Cellar.is_public == True
    ).all()
