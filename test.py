from unittest import TestCase
from app import app
from flask import session
from boggle import Boggle

app.config['TESTING'] = True
app.config['DEBUG_TB_HOSTS'] = ['dont-show-debug-toolbar']

class FlaskTests(TestCase):

    # TODO -- write tests for every view function / feature!
    
    def test_show_board(self):
        with app.test_client() as client:
            resp = client.get('/')
            html = resp.get_data(as_text = True)

            self.assertEqual(resp.status_code, 200)
            self.assertIn('<button type="submit" id="start">Start the game!</button>', html)


    def test_check_answer(self):
        with app.test_client() as client:
            resp = client.post('/check-answer', data = { 'answer':'a'})

            self.assertEqual(resp.status_code, 200)
 
    def test_store_user_data(self):
        with app.test_client() as client:
            resp = client.post('/store-user-data', data = { 'score':'10'})

            self.assertEqual(resp.status_code, 200)
    
    # def test_session(self):
    #     with app.test_client() as client:
    #         resp = client.get('/')


 