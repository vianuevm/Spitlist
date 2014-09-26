# import logging
# from logging.handlers import RotatingFileHandler

import os

from flask.ext.login import LoginManager
from flask.ext.openid import OpenID

from flask import Flask
from config import basedir
from flask_sqlalchemy import SQLAlchemy
app = Flask(__name__)

app.config.from_object('config')
db = SQLAlchemy(app)

# handler = RotatingFileHandler('log/application.log', maxBytes=10000, backupCount=1)
# handler.setLevel(logging.WARNING)
# app.logger.addHandler(handler)

#begin login manager code
lm = LoginManager()
lm.init_app(app)
oid = OpenID(app, os.path.join(basedir, 'tmp'))
lm.login_view = 'login'

from app import views, models

if not app.debug and os.environ.get('HEROKU') is None:
    import logging
    from logging.handlers import RotatingFileHandler
    file_handler = RotatingFileHandler('tmp/microblog.log', 'a', 1 * 1024 * 1024, 10)
    file_handler.setLevel(logging.INFO)
    file_handler.setFormatter(logging.Formatter('%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'))
    app.logger.addHandler(file_handler)
    app.logger.setLevel(logging.INFO)
    app.logger.info('microblog startup')

if os.environ.get('HEROKU') is not None:
    import logging
    stream_handler = logging.StreamHandler()
    app.logger.addHandler(stream_handler)
    app.logger.setLevel(logging.INFO)
    app.logger.info('microblog startup')
