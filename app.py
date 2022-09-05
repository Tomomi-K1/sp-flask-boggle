from boggle import Boggle
from flask import Flask, request, render_template, redirect, session, jsonify, flash
from flask_debugtoolbar import DebugToolbarExtension

boggle_game = Boggle()


app = Flask(__name__)
app.config['SECRET_KEY'] = "abc-dz"

debug = DebugToolbarExtension(app)


@app.route('/')
def show_board():
    """setting up sessions & show board"""
    session['board'] = boggle_game.make_board()
    session['visit'] = session.get('visit', 0)+1
    session['score'] = session.get('score', 0)  
    return render_template('board.html', boggle_game = boggle_game)

@app.route('/check-answer', methods=['POST'])
def check_answer():
    """ check if user input is a valid answer """
    answer = request.get_json()
    # check if answer is a valid word
    result = boggle_game.check_valid_word( session['board'], answer['answer'].lower())
    return {'result' : f'{result}'}

@app.route('/store-user-data', methods = ['POST'])
def store_user_info():
    """ update the highest score in session """
    data = request.get_json(); 
    # import pdb
    # pdb.set_trace()
    if session['score'] < data['score']:
        session['score'] = data['score']
        return {'highest': f"session['score']"}
    
