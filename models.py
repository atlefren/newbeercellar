# -*- coding: utf-8 -*-

from sqlalchemy import (Column, Integer, String, Numeric, ForeignKey)
from sqlalchemy.orm import relationship

from database import Base


class RbBrewery(Base):
    __tablename__ = 'rb_breweries'

    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)    

    def __init__(self, name):
        assert(name is not None)
        assert(name != "")
        self.name = name


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
