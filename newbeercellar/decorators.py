from functools import wraps
from flask.ext.login import current_user
from flask import abort

from util import user_owns_cellar


def cellar_owner(func):
    @wraps(func)
    def decorated_view(*args, **kwargs):
        cellar_id = kwargs.get('cellar_id')
        if user_owns_cellar(current_user.id, cellar_id):
            return func(*args, **kwargs)
        abort(403)
    return decorated_view
