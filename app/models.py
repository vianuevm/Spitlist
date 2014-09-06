from app import db
from sqlalchemy import Column
from sqlalchemy import DateTime, func

FALSE = 0
TRUE = 1

class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String(65))
    email = db.Column(db.String(120), unique = True)
    tasks = db.relationship('Task')

    def is_authenticated(self):
        return True

    def is_active(self):
        return True

    def is_anonymous(self):
        return False

    def get_id(self):
        return unicode(self.id)

    def __repr__(self):
        return '<User %r>' % (self.name)

class Task(db.Model):
    __tablename__ = 'task'
    task_id = db.Column(db.Integer, primary_key = True)
    description = db.Column(db.String(65))
    due_date = Column(DateTime, default=func.now())
    is_complete = db.Column(db.SmallInteger, default = False)
    timestamp = db.Column(db.DateTime)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))


    def __repr__(self):
        return '<Task %r>' % (self.due_date)