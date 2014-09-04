import os
from flask import render_template, redirect, session, url_for, request, send_from_directory, jsonify
from app import app
from werkzeug import secure_filename


@app.route('/',  methods = ['GET'])
@app.route('/index', methods = ['GET', 'POST'])
def index():
    return render_template('index.html',
        title = 'Home')

@app.route('/uploadajax', methods=['POST'])
def add_numbers():
   pass
