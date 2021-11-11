from unittest import TestCase
from app import app
from flask import session
from boggle import Boggle


class FlaskTests(TestCase): 

    def setUp(self):
        """Stuff to do before every test."""

    app.config['TESTING'] = True

    def test_homepage(self):
        """test for information in the session and html is displayed"""
        with app.test_client() as client:
            res = client.get('/')
            
            self.assertEqual(res.status_code, 200)
            self.assertIsNone(session.get('highscore'))
            self.assertIsNone(session.get('num_plays'))
            self.assertIn(b'<p>High Score:', res.data)
            self.assertIn(b'Score:', res.data)
            self.assertIn(b'Seconds Left:', res.data)
            
    def test_valid_word(self):
        """Test if the word is valid """ 
        with app.test_client() as client:
            with client.session_transaction() as sess:
                sess['board'] = [['O', 'L', 'D', 'A', 'O'],
                                 ['O', 'L', 'D', 'A', 'O'],
                                 ['O', 'L', 'D', 'A', 'O'],
                                 ['O', 'L', 'D', 'A', 'O'],
                                 ['O', 'L', 'D', 'A', 'O']]
    def test_invalid_word(self):
        """Test if word is in the dictionary"""

        self.client.get('/')
        response = self.client.get('/check-word?word=delicious')
        self.assertEqual(response.json['result'], 'not-on-board')

    def non_english_word(self):
        """Test if word is on the board"""

        self.client.get('/')
        response = self.client.get(
            '/check-word?word=fkfkfkfkffkfk')
        self.assertEqual(response.json['result'], 'not-word')
