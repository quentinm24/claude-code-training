"""
calculator.py
-------------
Demo file for Module 4: Debugging and Self-Testing.

A simple calculator module used during the instructor demo.
The instructor will ask Claude to introduce a silent bug —
your job is to find it through tests, not by reading the code.

Functions:
    add(a, b)       -> a + b
    subtract(a, b)  -> a - b
    multiply(a, b)  -> a * b
    divide(a, b)    -> a / b  (raises ValueError if b == 0)
"""


def add(a, b):
    return a + b


def subtract(a, b):
    return a - b


def multiply(a, b):
    return a * b


def divide(a, b):
    if b == 0:
        raise ValueError("Cannot divide by zero")
    return a // b
