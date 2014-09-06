import os
import time
from flask import render_template, redirect, session, url_for, request, send_from_directory, jsonify
from app import app, db, models
from datetime import datetime, timedelta
from werkzeug import secure_filename

@app.route('/',  methods = ['GET'])
@app.route('/index', methods = ['GET', 'POST'])
def index():
    return render_template('index.html',
        title = 'Home')

@app.route('/uploadajax', methods=['POST'])
def add_numbers():
   pass

@app.route('/get_tasks', methods=['POST'])
def get_tasks():
	tasks = models.Task.query.filter(models.Task.user_id == request.form['user_id'])
	return jsonify(tasks=[task.serialize() for task in tasks])

@app.route('/create', methods=['POST'])
def create():
	timestamp = datetime.utcnow()
	due_date = datetime.fromtimestamp(float(request.form['due_date']))
	is_complete = request.form['is_complete']
	user_id = request.form['user_id']
	description = request.form['description']
	task = models.Task(
		description=description,
		timestamp=timestamp,
		is_complete=is_complete,
		user_id=user_id,
		due_date=due_date)
	print task.due_date
	db.session.add(task)
	db.session.commit()
	return jsonify(task=task.serialize())

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
	task = models.Task.query.filter(models.Task.task_id == request.form['task_id']).first()
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
