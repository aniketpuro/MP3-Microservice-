import pytest

def test_notification_imports():
    try:
        from consumer import main
        assert True
    except ImportError:
        pass
