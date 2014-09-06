import os
from flask import Flask
from config import basedir
from flask_sqlalchemy import SQLAlchemy
app = Flask(__name__)
app.config.from_object('config')
db = SQLAlchemy(app)

from app import views, models
