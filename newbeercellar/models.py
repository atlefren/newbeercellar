# -*- coding: utf-8 -*-
from datetime import datetime
from sqlalchemy import (Column, Integer, String, Numeric, ForeignKey, Text, Date)
from sqlalchemy.orm import relationship

from database import Base


class Cellar(Base):
    __tablename__ = 'cellars'
    id = Column(Integer, primary_key=True)
    name = Column(String)
    #user_id = Column(Integer, ForeignKey('user.id'), nullable=False)
    #user = relationship('User', lazy=False)
    bottles = relationship("Bottle")
    
    def __init__(self, name):
        self.name = name


def iso_or_none(date):
    if date is not None:
        return date.isoformat()
    return None

def parse_date(date):
    return date


class Bottle(Base):
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
    
    #user_id = Column(Integer, ForeignKey('user.id'), nullable=False)
    #user = relationship('User', lazy=False)

    def __init__(self, beer, cellar, data):
        self.beer = beer
        self.cellar = cellar
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
            "removed": iso_or_none(self.date_removed)
        }


class RbBrewery(Base):
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
            'name': self.name
        }


class RbBeer(Base):
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
            'brewery': self.brewery.name
        }