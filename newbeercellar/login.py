from flask import current_app, redirect, url_for, session
from flask.ext.login import login_user, logout_user
from flask_googlelogin import USERINFO_EMAIL_SCOPE

from newbeercellar import login_manager, app, googlelogin
from models import User
from util import get_or_create_default_cellar


@app.route("/login")
def login():
    return redirect(
        googlelogin.login_url(scopes=[USERINFO_EMAIL_SCOPE])
    )


login_manager.unauthorized_handler(login)


@app.route('/logout')
def logout():
    logout_user()
    session.clear()
    return redirect(url_for('index'))


@login_manager.user_loader
def load_user(userid):
    return current_app.db_session.query(User).get(userid)


@app.route('/oauth2callback')
@googlelogin.oauth2callback
def create_or_update_user(token, userinfo, **params):
    if params.get('error', False):
        return redirect(url_for('index'))

    db = current_app.db_session
    user = db.query(User).filter(User.google_id == userinfo['id']).first()
    if user:
        user.name = userinfo['name']

    else:
        user = User(
            google_id=userinfo['id'],
            name=userinfo['name'],
            email=userinfo['email'],
            username=userinfo['email'].split('@')[0].replace('.', '')
        )

    db.add(user)
    db.commit()
    db.flush()
    login_user(user)
    cellar = get_or_create_default_cellar(user)
    return redirect(url_for(
        'view_cellar',
        username=user.username,
        cellar_id=cellar.id
    ))
