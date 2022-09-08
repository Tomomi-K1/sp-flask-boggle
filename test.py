from unittest import TestCase
from app import app
from flask import session
from boggle import Boggle

# app.config['TESTING'] = True
# app.config['DEBUG_TB_HOSTS'] = ['dont-show-debug-toolbar']

class FlaskTests(TestCase):

    # TODO -- write tests for every view function / feature!
    
    def setUp(self):
        """Stuff to do before every test."""

        self.client = app.test_client()
    # we assign app.test_clients() to self.client
        app.config['TESTING'] = True
        app.config['DEBUG_TB_HOSTS'] = ['dont-show-debug-toolbar']


    def test_show_board(self):
        with self.client:
            resp = self.client.get('/')
            # html = resp.get_data(as_text = True)
            
            self.assertEqual(resp.status_code, 200)
            # self.assertIn('<button type="submit" id="start">Start the game!</button>', html)
            # answer from springboard
            self.assertIn('board', session)
            self.assertIsNone(session.get('highscore'))
            self.assertIsNone(session.get('nplays'))
            self.assertIn(b' <p>Your highest score is', resp.data)
            self.assertIn(b'Your Current Score is :', resp.data)
            self.assertIn (b'second(s) remaining !</p>' , resp.data)
            
            

    def test_check_answer(self):
        with self.client as client:
            with client.session_transaction() as session:
            # set the board session_transaction() method can be used if you want to access or set a value in the session before making a request
                session['board'] = [['C', 'A', 'T','T','T'],
                                    ['C', 'A', 'T','T','T'],
                                    ['C', 'A', 'T','T','T'],
                                    ['C', 'A', 'T','T','T'],
                                    ['C', 'A', 'T','T','T']]
        
        response = self.client.get('/check-answer?answer=cat')
        self.assertEqual(response.json['result'], 'ok')
        self.assertEqual(response.status_code, 200)
 
    def test_invalid_word(self):
        
        self.client.get('/')
        # why doesn't this use "with self.client"?
        resp = self.client.get('/check-answer?answer=impossible')
        #response data is sent by json
        self.assertEqual(resp.json['result'], 'not-on-board')

    def non_english_word(self):
        """Test if word is on the board"""

        self.client.get('/')
        response = self.client.get(
            '/check-answer?answer=fsjdakfkldsfjdslkfjdlksf')
        self.assertEqual(response.json['result'], 'not-word')


    # def test_store_user_data(self):
    #     with self.client as client:
    #         resp = self.client.post('/store-user-data', data = {'score':'10'})
    #         self.assertTrue(session['score'] == 10)
    #         self.assertEqual(resp.status_code, 200)

    
    
    # def test_session(self):
    #     with app.test_client() as client:
    #         resp = client.get('/')


 