from flask import current_app, redirect, url_for, session
from flask.ext.login import login_user, logout_user, current_user

from newbeercellar import login_manager, app, googlelogin
from models import User


@app.route("/login")
def login():
    return redirect(googlelogin.login_url())


@app.route('/logout')
def logout():
    logout_user()
    session.clear()
    print current_user.is_authenticated()
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
        )

    db.add(user)
    db.commit()
    db.flush()
    login_user(user)
    return redirect(url_for('defaultcellar'))
