# -*- coding: utf-8 -*-

from flask import current_app
from models import Cellar


def get_cellar_data(cellar_id):
    cellar = current_app.db_session.query(Cellar).get(cellar_id)
    if cellar:
        bottles = sorted(
            [bottle.serialize for bottle in cellar.bottles],
            key=lambda x: x["id"],
            reverse=True
        )
        return {"cellarName": cellar.name, "bottles": bottles}
    return None
