from flask import Flask, render_template, jsonify, request
from solver import get_solution
import random

app = Flask(__name__)

current = []
solution = []

# Sudoku Generator
def valid(board, row, col, num):

    for i in range(9):
        if board[row][i] == num:
            return False

        if board[i][col] == num:
            return False

    sr = (row // 3) * 3
    sc = (col // 3) * 3

    for r in range(sr, sr + 3):
        for c in range(sc, sc + 3):
            if board[r][c] == num:
                return False

    return True


def generate_full_board():

    board = [[0] * 9 for _ in range(9)]

    def fill():
        for row in range(9):
            for col in range(9):

                if board[row][col] == 0:

                    numbers = list(range(1, 10))
                    random.shuffle(numbers)

                    for num in numbers:

                        if valid(board, row, col, num):
                            board[row][col] = num

                            if fill():
                                return True

                            board[row][col] = 0

                    return False

        return True

    fill()
    return board


def generate_puzzle(remove_cells=45):

    solved = generate_full_board()

    puzzle = [row[:] for row in solved]

    cells = [(r, c) for r in range(9) for c in range(9)]
    random.shuffle(cells)

    for i in range(remove_cells):
        r, c = cells[i]
        puzzle[r][c] = 0

    return puzzle, solved


# Routes


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/new")
def new():

    global current, solution

    current, solution = generate_puzzle(45)

    return jsonify({"board": current})


@app.route("/help", methods=["POST"])
def help_cell():

    data = request.get_json()

    r = data["row"]
    c = data["col"]

    return jsonify({"value": solution[r][c]})


@app.route("/solve")
def solve_board():
    return jsonify({"board": solution})


@app.route("/check", methods=["POST"])
def check():

    data = request.get_json()

    r = data["row"]
    c = data["col"]
    num = data["value"]

    if solution[r][c] == num:
        return jsonify({"ok": True})
    else:
        return jsonify({"ok": False})

if __name__ == "__main__":
    app.run(debug=True)