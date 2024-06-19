from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def create_board():
    board = [[' ' for _ in range(3)] for _ in range(3)]
    return board

def check_winner(board, player):
    for row in board:
        if all([cell == player for cell in row]):
            return True
    for col in range(3):
        if all([board[row][col] == player for row in range(3)]):
            return True
    if all([board[i][i] == player for i in range(3)]) or all([board[i][2 - i] == player for i in range(3)]):
        return True
    return False      

def check_draw(board):
    return all([cell != ' ' for row in board for cell in row])

def make_move(board, row, col, player):
    if board[row][col] == ' ':
        board[row][col] = player
        return True
    return False

def minimax(board, depth, is_maximizing, ai_player, human_player):
    if check_winner(board, ai_player):
        return 1
    if check_winner(board, human_player):
        return -1
    if check_draw(board):
        return 0

    if is_maximizing:
        best_score = -float('inf')
        for row in range(3):
            for col in range(3):
                if board[row][col] == ' ':
                    board[row][col] = ai_player
                    score = minimax(board, depth + 1, False, ai_player, human_player)
                    board[row][col] = ' '
                    best_score = max(score, best_score)
        return best_score
    else:
        best_score = float('inf')
        for row in range(3):
            for col in range(3):
                if board[row][col] == ' ':
                    board[row][col] = human_player
                    score = minimax(board, depth + 1, True, ai_player, human_player)
                    board[row][col] = ' '
                    best_score = min(score, best_score)
        return best_score

def get_best_move(board, ai_player, human_player):
    best_score = -float('inf')
    best_move = None
    for row in range(3):
        for col in range(3):
            if board[row][col] == ' ':
                board[row][col] = ai_player
                score = minimax(board, 0, False, ai_player, human_player)
                board[row][col] = ' '
                if score > best_score:
                    best_score = score
                    best_move = (row, col)
    return best_move

@app.route('/move', methods=['POST'])
def move():
    data = request.json
    board = data['board']
    player = data['player']

    if player == 'Player 1':
        row, col = data['move']
        make_move(board, row, col, 'X')
        winner = 'Player 1' if check_winner(board, 'X') else None
    elif player == 'Player 2':
        row, col = data['move']
        make_move(board, row, col, 'O')
        winner = 'Player 2' if check_winner(board, 'O') else None
    else:
        row, col = get_best_move(board, 'O', 'X')
        make_move(board, row, col, 'O')
        winner = 'AI' if check_winner(board, 'O') else None

    return jsonify({
        'board': board, 
        'winner': winner, 
        'draw': check_draw(board)
    })

if __name__ == '__main__':
    app.run(debug=True)
