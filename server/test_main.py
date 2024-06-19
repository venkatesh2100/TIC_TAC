import unittest
from main import create_board, make_move, check_winner, check_draw

class TestTicTacToe(unittest.TestCase):
    
    def setUp(self):
        self.board = create_board()

    def test_create_board(self):
        self.assertEqual(self.board, [[' ' for _ in range(3)] for _ in range(3)])

    def test_make_move(self):
        self.assertTrue(make_move(self.board, 0, 0, 'X'))
        self.assertEqual(self.board[0][0], 'X')
        self.assertFalse(make_move(self.board, 0, 0, 'O'))
        self.assertEqual(self.board[0][0], 'X')

    def test_check_winner(self):
        self.board = [
            ['X', 'X', 'X'],
            [' ', 'O', ' '],
            [' ', 'O', ' ']
        ]
        self.assertTrue(check_winner(self.board, 'X'))
        self.assertFalse(check_winner(self.board, 'O'))

        self.board = [
            ['X', 'O', ' '],
            ['X', 'O', ' '],
            ['X', ' ', ' ']
        ]
        self.assertTrue(check_winner(self.board, 'X'))
        self.assertFalse(check_winner(self.board, 'O'))

        self.board = [
            ['X', 'O', 'O'],
            [' ', 'X', ' '],
            ['O', ' ', 'X']
        ]
        self.assertTrue(check_winner(self.board, 'X'))
        self.assertFalse(check_winner(self.board, 'O'))

    def test_check_draw(self):
        self.board = [
            ['X', 'O', 'X'],
            ['X', 'O', 'O'],
            ['O', 'X', 'X']
        ]
        self.assertTrue(check_draw(self.board))
        
        self.board[2][2] = ' '
        self.assertFalse(check_draw(self.board))

if __name__ == '__main__':
    unittest.main()
