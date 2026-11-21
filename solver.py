from copy import deepcopy

def valid(board,row,col,num):

    for i in range(9):
        if board[row][i]==num:
            return False

    for i in range(9):
        if board[i][col]==num:
            return False

    sr=(row//3)*3
    sc=(col//3)*3

    for r in range(sr,sr+3):
        for c in range(sc,sc+3):
            if board[r][c]==num:
                return False

    return True


def solve(board):

    for row in range(9):
        for col in range(9):

            if board[row][col]==0:

                for num in range(1,10):

                    if valid(board,row,col,num):

                        board[row][col]=num

                        if solve(board):
                            return True

                        board[row][col]=0

                return False

    return True


def get_solution(board):

    temp=deepcopy(board)
    solve(temp)
    return temp