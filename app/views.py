import os
import time
import json
from flask import render_template, redirect, session, url_for, request, g, send_from_directory, jsonify, flash
from app import app, db, models, lm, oid
from datetime import datetime, timedelta
from werkzeug import secure_filename
from flask.ext.login import login_user, logout_user, current_user, login_required
from forms import LoginForm
from models import User

@app.route('/',  methods = ['GET'])
@app.route('/index', methods = ['GET', 'POST'])
def index():
    return render_template('index.html',
        title = 'Home')

@app.before_request
def before_request():
    g.user = current_user

#begin login manager functions

@lm.user_loader
def load_user(id):
	return User.query.get(int(id))

@app.route('/login', methods = ['GET', 'POST'])
@oid.loginhandler
def login():
    if g.user is not None and g.user.is_authenticated():
        return redirect(url_for('index'))
    form = LoginForm()
    if form.validate_on_submit():
        session['remember_me'] = form.remember_me.data
        return oid.try_login(form.openid.data, ask_for = ['nickname', 'email'])
    return render_template('login.html', 
        title = 'Sign In',
        form = form,
        providers = app.config['OPENID_PROVIDERS'])

@oid.after_login
def after_login(resp):
    if resp.email is None or resp.email == "":
        flash('Invalid login. Please try again.')
        return redirect(url_for('login'))
    user = User.query.filter_by(email = resp.email).first()
    if user is None:
        nickname = resp.nickname
        if nickname is None or nickname == "":
            nickname = resp.email.split('@')[0]
        user = User(name = nickname, email = resp.email)
        db.session.add(user)
        db.session.commit()
    session['user_id'] = user.id
    remember_me = False
    if 'remember_me' in session:
        remember_me = session['remember_me']
        session.pop('remember_me', None)
    login_user(user, remember = remember_me)
    return redirect(request.args.get('next') or url_for('index'))

@app.route('/get_tasks', methods=['GET'])
def get_tasks():
	print session['user_id']
	if session['user_id'] == "":
		return jsonify(tasks=[])
	tasks = models.Task.query.filter(models.Task.user_id == session['user_id'])
	return jsonify(tasks=[task.serialize() for task in tasks])

@app.route('/create', methods=['POST'])
def create():
	args = json.loads(request.data)
	timestamp = datetime.utcnow()
	due_date = datetime.fromtimestamp(float(args['due_date']))
	is_complete = args['is_complete']
	user_id = session['user_id']
	description = args['description']
	task = models.Task(
		description=description,
		timestamp=timestamp,
		is_complete=is_complete,
		user_id=user_id,
		due_date=due_date)
	db.session.add(task)
	db.session.commit()
	return jsonify(task_id=task.task_id)

@app.route('/edit_description', methods=['POST'])
def edit():
	task = models.Task.query.filter(models.Task.task_id == request.form['task_id'] ).first()
	task.description = request.form['description']
	db.session.commit()
	return task.description

@app.route('/move_date', methods=['POST'])
def move_date():
	task = models.Task.query.filter(models.Task.task_id == request.form['task_id'] ).first()
	task.due_date = datetime.fromtimestamp(float(request.form['new_date']))
	db.session.commit()
	javascript_time = time.mktime(task.due_date.timetuple()) * 1000
	return str(javascript_time)

@app.route('/delete', methods=['POST'])
def delete():
	args = json.loads(request.data)
	task = models.Task.query.filter(models.Task.task_id == args['task_id']).first()
	db.session.delete(task)
	db.session.commit()
	return jsonify(success=True)

@app.route('/mark', methods=['POST'])
def mark():
	task = models.Task.query.filter(models.Task.task_id == request.form['task_id']).first()
	task.is_complete = bool(request.form["is_complete"])
	db.session.commit()
	return jsonify(success=True)

@app.route('/next_week', methods=['POST'])
def next_week():
	task = models.Task.query.filter(models.Task.task_id == request.form['task_id'] ).first()
	print "time before"
	print task.due_date
	task.due_date = datetime.fromtimestamp(float(request.form['due_date'])) + timedelta(days=7)
	javascript_time = time.mktime(task.due_date.timetuple()) * 1000
	db.session.commit()
	return str(javascript_time)

@app.route('/star', methods=['POST'])
def star():
	task = models.Task.query.filter(models.Task.task_id == request.form['task_id']).first()
	task.starred = not task.starred
	db.session.commit()
	return str(task.starred)
