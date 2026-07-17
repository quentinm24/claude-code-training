"""
test_calculator.py
------------------
Pytest suite for calculator.py.

Run with: pytest test_calculator.py -v
"""

import pytest

from calculator import add, subtract, multiply, divide


# ── add ──────────────────────────────────────────────────────────────────────

def test_add_positive_numbers():
    assert add(2, 3) == 5


def test_add_negative_numbers():
    assert add(-2, -3) == -5


def test_add_mixed_sign():
    assert add(-5, 3) == -2


def test_add_zero():
    assert add(0, 0) == 0
    assert add(5, 0) == 5


def test_add_floats():
    assert add(2.5, 0.5) == 3.0


# ── subtract ─────────────────────────────────────────────────────────────────

def test_subtract_positive_numbers():
    assert subtract(5, 3) == 2


def test_subtract_negative_numbers():
    assert subtract(-5, -3) == -2


def test_subtract_mixed_sign():
    assert subtract(-5, 3) == -8


def test_subtract_zero():
    assert subtract(0, 0) == 0
    assert subtract(5, 0) == 5


def test_subtract_result_negative():
    assert subtract(3, 5) == -2


def test_subtract_floats():
    assert subtract(2.5, 0.5) == 2.0


# ── multiply ─────────────────────────────────────────────────────────────────

def test_multiply_positive_numbers():
    assert multiply(4, 3) == 12


def test_multiply_negative_numbers():
    assert multiply(-4, -3) == 12


def test_multiply_mixed_sign():
    assert multiply(-4, 3) == -12


def test_multiply_by_zero():
    assert multiply(5, 0) == 0
    assert multiply(0, 0) == 0


def test_multiply_by_one():
    assert multiply(7, 1) == 7


def test_multiply_floats():
    assert multiply(2.5, 4) == 10.0


# ── divide ───────────────────────────────────────────────────────────────────

def test_divide_positive_numbers():
    assert divide(6, 3) == 2


def test_divide_negative_numbers():
    assert divide(-6, -3) == 2


def test_divide_mixed_sign():
    assert divide(-6, 3) == -2


def test_divide_by_one():
    assert divide(7, 1) == 7


def test_divide_zero_numerator():
    assert divide(0, 5) == 0


def test_divide_non_exact_result():
    assert divide(7, 2) == 3.5


def test_divide_negative_non_exact_result():
    assert divide(-7, 2) == -3.5


def test_divide_floats():
    assert divide(5.0, 2.0) == 2.5


def test_divide_by_zero_raises():
    with pytest.raises(ValueError):
        divide(5, 0)


def test_divide_zero_by_zero_raises():
    with pytest.raises(ValueError):
        divide(0, 0)
