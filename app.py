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
    visit = session.get('visit', 0)
    highscore = session.get('highscore', 0)  
    return render_template('board.html', boggle_game = boggle_game, visit = visit, highscore =highscore)

@app.route('/check-answer')
def check_answer():
    """ check if user input is a valid answer """
    answer = request.args['answer']
    # check if answer is a valid word
    result = boggle_game.check_valid_word( session['board'], answer.lower())
    return jsonify({'result' : result})

@app.route('/store-user-data', methods = ['POST'])
def store_user_info():
    """ update the highest score in session """
    score = request.json['score']; 

    visit = session.get('visit', 0)
    highscore = session.get('highscore', 0)  
    
    session['visit'] = visit+1
    session['highscore'] = max(score, highscore)
    
    return jsonify(brokeRecord = score > highscore)
    
