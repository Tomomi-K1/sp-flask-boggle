from boggle import Boggle
from flask import Flask, request, render_template, redirect, session, jsonify
from flask_debugtoolbar import DebugToolbarExtension

boggle_game = Boggle()


app = Flask(__name__)
app.config['SECRET_KEY'] = "abc-dz"

debug = DebugToolbarExtension(app)

@app.route('/')
def show_board():
    session['board'] = boggle_game.make_board()
    return render_template('board.html', boggle_game = boggle_game)

@app.route('/check-answer', methods=['POST'])
def check_answer():
    answer = request.get_jason(silent = True)
    return {}


