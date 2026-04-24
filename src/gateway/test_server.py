import pytest
import sys
import os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from server import app

@pytest.fixture
def client():
    app.config['TESTING'] = True # nosemgrep
    with app.test_client() as client:
        yield client

def test_upload_route_exists(client):
    response = client.post('/upload')
    # Should not be 404
    assert response.status_code != 404

def test_download_route_exists(client):
    response = client.get('/download')
    assert response.status_code != 404
