import logging
from logging.handlers import RotatingFileHandler

import os

from flask import Flask
from config import basedir
from flask_sqlalchemy import SQLAlchemy
app = Flask(__name__)

app.config.from_object('config')
db = SQLAlchemy(app)

handler = RotatingFileHandler('log/application.log', maxBytes=10000, backupCount=1)
handler.setLevel(logging.WARNING)
app.logger.addHandler(handler)

from app import views, models
