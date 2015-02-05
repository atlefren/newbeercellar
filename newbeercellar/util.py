# -*- coding: utf-8 -*-

from flask import current_app
from sqlalchemy.orm.exc import NoResultFound

from models import Cellar, User


def serialize_cellar(cellar):
    bottles = sorted(
        [bottle.serialize for bottle in cellar.bottles],
        key=lambda x: x["id"],
        reverse=True
    )
    print bottles
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


def get_cellar(cellar_id):
    return current_app.db_session.query(Cellar).get(cellar_id)


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
        cellar = Cellar('My Beer Cellar', user, is_default=True)
        current_app.db_session.add(cellar)
        current_app.db_session.commit()

    return serialize_cellar(cellar)


def cellars_for_user(user_id):
    return current_app.db_session.query(Cellar).filter(
        Cellar.user_id == user_id
    ).all()


def get_user_by_username(username):
    return current_app.db_session.query(User).filter(User.username == username).first()


def public_cellars_for_username(username):
    user = get_user_by_username(username)
    return current_app.db_session.query(Cellar).filter(
        Cellar.user_id == user.id,
        Cellar.is_public == True
    ).all()
