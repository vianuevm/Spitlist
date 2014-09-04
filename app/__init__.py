import os
from flask import Flask
from config import basedir

app = Flask(__name__)

from app import views, models
