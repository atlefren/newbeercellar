# -*- coding: utf-8 -*-
from datetime import datetime
import re

from sqlalchemy import (Column, Integer, String, Numeric, ForeignKey, Text,
                        Date, DateTime, Boolean)
from sqlalchemy.orm import relationship
from flask_login import UserMixin

from newbeercellar import db


RATEBEER_BASE_URL = "http://www.ratebeer.com/beer"


class User(db.Model, UserMixin):
    __tablename__ = "users"
    id = Column('user_id', Integer, primary_key=True)
    name = Column('name', String(50), unique=False)
    username = Column('username', String(50), unique=True)
    email = Column('email', String(50), unique=True)
    google_id = Column('google_id', String(50), unique=True, index=True)
    registered_on = Column('registered_on', DateTime)

    def __init__(self, name=None, google_id=None, email=None, username=None):
        self.name = name
        self.username = username
        self.email = email
        self.google_id = google_id
        self.registered_on = datetime.utcnow()


class Cellar(db.Model):
    __tablename__ = 'cellars'
    id = Column(Integer, primary_key=True)
    name = Column(String)
    user_id = Column(Integer, ForeignKey('users.user_id'), nullable=False)
    user = relationship('User', lazy=False)
    bottles = relationship("Bottle")
    is_default = Column(Boolean, default=False)
    is_public = Column(Boolean, default=True)

    def __init__(self, name, user, is_default=False):
        self.name = name
        self.user = user
        self.is_default = is_default


def iso_or_none(date):
    if date is not None:
        return date.isoformat()
    return None


def parse_date(date):
    return date


class Bottle(db.Model):
    __tablename__ = 'bottles'

    id = Column(Integer, primary_key=True)
    amount = Column(Integer, nullable=False, default=1)
    size = Column(Numeric, nullable=True)
    comment = Column(Text, nullable=True)
    batch_no = Column(String, nullable=True)
    brew_date = Column(Date, nullable=True)
    best_before_date = Column(Date, nullable=True)
    date_added = Column(Date, nullable=False, default=datetime.now)
    date_removed = Column(Date, nullable=True)

    beer_id = Column(Integer, ForeignKey('rb_beers.id'), nullable=False)
    beer = relationship('RbBeer', lazy=False)

    cellar_id = Column(Integer, ForeignKey('cellars.id'), nullable=False)
    cellar = relationship('Cellar', lazy=False)

    def __init__(self, beer, cellar, data):
        self.beer = beer
        self.cellar = cellar
        self.update(data)

    def update(self, data):
        self.amount = data.get('amount', None)
        self.size = data.get('size', None)
        self.comment = data.get('comment', None)
        self.batch_no = data.get('batchNo', None)
        self.brew_date = parse_date(data.get('brewDate', None))
        self.best_before_date = parse_date(data.get('bbfDate', None))

    @property
    def serialize(self):
        return {
            "id": self.id,
            "breweryId": self.beer.brewery.id,
            "breweryName": self.beer.brewery.name,
            "beerId": self.beer.id,
            "beerName": self.beer.name,
            "batchNo": self.batch_no,
            "brewDate": iso_or_none(self.brew_date),
            "bbfDate": iso_or_none(self.best_before_date),
            "size": self.size,
            "amount": self.amount,
            "comment": self.comment,
            "added": iso_or_none(self.date_added),
            "removed": iso_or_none(self.date_removed),
            'ratebeerUrl': self.beer.ratebeer_url,
        }


class RbBrewery(db.Model):
    __tablename__ = 'rb_breweries'

    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)

    def __init__(self, name):
        assert(name is not None)
        assert(name != "")
        self.name = name

    @property
    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
        }


class RbBeer(db.Model):
    __tablename__ = 'rb_beers'

    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)
    ratebeer_id = Column(Integer)
    short_name = Column(String(255), nullable=False)
    brewery_id = Column(Integer, ForeignKey("rb_breweries.id"), nullable=False)
    brewery = relationship("RbBrewery", lazy=False)
    rating = Column(Numeric, nullable=False)
    num = Column(Numeric, nullable=True)

    def __init__(self, ratebeer_id, name, short_name, brewery, rating, num):
        assert(brewery is not None)
        self.ratebeer_id = ratebeer_id
        self.name = name
        self.short_name = short_name
        self.brewery = brewery
        self.rating = rating
        self.num = num

    @property
    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'brewery': self.brewery.name,
            "breweryId": self.brewery.id,
        }

    @property
    def ratebeer_url(self):
        fixed_name = re.sub(
            '[^A-Za-z0-9\-]+',
            '',
            self.short_name.replace(' ', '-')
        )
        return "%s/%s/%s/" % (RATEBEER_BASE_URL, fixed_name, self.ratebeer_id)
