import os
import sys
import time
import requests
import logging
import pytest

# Configurable base URL for the running FastAPI server
BASE_URL = os.environ.get("API_BASE_URL", "http://localhost:8000")

# Logging configuration
LOG_FILE = os.path.join(os.path.dirname(__file__), "test_results.log")
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s %(levelname)s %(message)s',
    handlers=[
        logging.FileHandler(LOG_FILE, mode='w', encoding='utf-8'),
        logging.StreamHandler(sys.stdout),
    ],
    force=True  # <--- This is the key!
)
logger = logging.getLogger()

def get_unique_email(base_email="testuser"):
    """Generate a unique email address by appending timestamp and random suffix"""
    timestamp = int(time.time() * 1000)  # Use milliseconds
    return f"{base_email}_{timestamp}@example.com"

def create_test_user(email=None, password="testpassword123"):
    if email is None:
        email = get_unique_email()
    resp = requests.post(f"{BASE_URL}/users/", json={"email": email, "password": password})
    assert resp.status_code == 200, f"Failed to create user: {resp.text}"
    return resp.json()

def get_user_token(email, password="testpassword123"):
    resp = requests.post(f"{BASE_URL}/token", data={"username": email, "password": password})
    assert resp.status_code == 200, f"Failed to get token: {resp.text}"
    return resp.json()["access_token"]


# Tests
def test_create_user():
    """Test user creation endpoint"""
    email = get_unique_email()
    user = create_test_user(email)
    assert user["email"] == email
    assert "id" in user

def test_login():
    """Test user login endpoint"""
    email = get_unique_email()
    create_test_user(email)
    token = get_user_token(email)
    assert token is not None

def test_get_users():
    """Test get users endpoint"""
    # Create a test user
    email = get_unique_email()
    created_user = create_test_user(email)
    token = get_user_token(email)
    
    # First verify we can get this specific user by ID
    response = requests.get(
        f"{BASE_URL}/users/{created_user['id']}",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    specific_user = response.json()
    assert specific_user["email"] == email
    
    # Now get all users with pagination to find our user
    found_user = False
    skip = 0
    limit = 10
    
    while not found_user:
        response = requests.get(
            f"{BASE_URL}/users/?skip={skip}&limit={limit}",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == 200
        users = response.json()
        
        if not users:  # No more users to check
            break
            
        found_user = any(u["email"] == email for u in users)
        if found_user:
            break
            
        skip += limit
    
    assert found_user, f"Created user {email} not found in any page of users list"

def test_get_user_by_id():
    """Test get user by ID endpoint"""
    email = get_unique_email()
    created_user = create_test_user(email)
    token = get_user_token(email)
    
    response = requests.get(
        f"{BASE_URL}/users/{created_user['id']}",
        headers={"Authorization": f"Bearer {token}"}
    )
    logger.info(f"Get user by id response: {response.status_code} {response.text}")
    assert response.status_code == 200
    user = response.json()
    assert user["email"] == email
    assert user["id"] == created_user["id"]

    # Try to get non-existent user
    response = requests.get(
        f"{BASE_URL}/users/999999",
        headers={"Authorization": f"Bearer {token}"}
    )
    logger.info(f"Get non-existent user response: {response.status_code} {response.text}")
    assert response.status_code == 404

def test_update_user():
    """Test update user endpoint"""
    email = get_unique_email()
    user = create_test_user(email)
    token = get_user_token(email)
    
    # Try to update with a new email
    new_email = get_unique_email("updated")
    response = requests.put(
        f"{BASE_URL}/users/{user['id']}",
        headers={"Authorization": f"Bearer {token}"},
        json={"email": new_email, "password": "newpassword123"}
    )
    assert response.status_code == 200, f"Failed to update user: {response.text}"
    updated_user = response.json()
    assert updated_user["email"] == new_email

    # Try to update non-existent user
    response = requests.put(
        f"{BASE_URL}/users/999999",
        headers={"Authorization": f"Bearer {token}"},
        json={"email": get_unique_email(), "password": "newpassword123"}
    )
    assert response.status_code == 401

def test_delete_user():
    """Test delete user endpoint"""
    # Create first user (to be deleted)
    email1 = get_unique_email("user1")
    user1 = create_test_user(email1)
    token1 = get_user_token(email1)
    
    # Create second user (to verify after deletion)
    email2 = get_unique_email("user2")
    user2 = create_test_user(email2)
    token2 = get_user_token(email2)
    
    # Delete the first user
    response = requests.delete(
        f"{BASE_URL}/users/{user1['id']}",
        headers={"Authorization": f"Bearer {token1}"}
    )
    assert response.status_code == 200
    assert response.json()["ok"] == True
    
    # Try to get the deleted user with second user's token
    response = requests.get(
        f"{BASE_URL}/users/{user1['id']}",
        headers={"Authorization": f"Bearer {token2}"}
    )
    assert response.status_code == 404

    # Try to delete again with second user's token
    response = requests.delete(
        f"{BASE_URL}/users/{user1['id']}",
        headers={"Authorization": f"Bearer {token2}"}
    )
    assert response.status_code == 404


class TestAPIs:
    def test_backend_running(self, client):
        """
        Test if backend is running
        
        Verifies:
            - Returns 200 status code
            - Response contains expected message
        """
        resp = client.get("/")
        assert resp.status_code == 200
        assert resp.json() == {"message": "Work In Progress"}

    def test_health_check(self, client):
        """
        Test health check endpoint
        
        Verifies:
            - Returns 200 status code
            - Response contains expected status
        """
        resp = client.get("/health")
        assert resp.status_code == 200
        assert resp.json() == {"status": "healthy"}

    def test_get_users(self, client):
        """
        Test get users endpoint
        
        Verifies:
            - Returns 200 status code
            - Response contains a list of users
            - Test user is present in the list
        """
        # Create a test user and get token
        email = get_unique_email("testuser3")
        password = "testpassword123"
        
        # First create the user
        create_resp = client.post(
            "/users/",
            json={"email": email, "password": password}
        )
        assert create_resp.status_code == 200, f"Failed to create user: {create_resp.text}"
        created_user = create_resp.json()
        assert created_user["email"] == email
        
        # Get token
        token_resp = client.post(
            "/token",
            data={"username": email, "password": password}
        )
        assert token_resp.status_code == 200, f"Failed to get token: {token_resp.text}"
        token_data = token_resp.json()
        token = token_data["access_token"]
        
        # Verify we can get the user we just created
        for _ in range(3):  # Retry a few times if needed
            resp = client.get(
                "/users/",
                headers={"Authorization": f"Bearer {token}"}
            )
            assert resp.status_code == 200, f"Failed to get users: {resp.text}"
            users = resp.json()
            assert isinstance(users, list), f"Expected list, got {type(users)}"
            
            # Find our user in the list
            our_user = next((u for u in users if u["email"] == email), None)
            if our_user is not None:
                break
        
        assert our_user is not None, f"Test user {email} not found in user list"
        user_id = our_user["id"]
        
        # Verify we can get this user by ID
        resp = client.get(
            f"/users/{user_id}",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert resp.status_code == 200, f"Failed to get user by ID: {resp.text}"
        user_data = resp.json()
        assert user_data["email"] == email

    def test_create_user(self, client):
        """Test user creation endpoint"""
        email = get_unique_email("testuser1")
        password = "testpassword123"
        
        resp = client.post(
            "/users/",
            json={"email": email, "password": password}
        )
        assert resp.status_code == 200
        user = resp.json()
        assert user["email"] == email

    def test_login(self, client):
        """Test login endpoint"""
        email = get_unique_email("testuser2")
        password = "testpassword123"
        
        # First create the user
        create_resp = client.post(
            "/users/",
            json={"email": email, "password": password}
        )
        assert create_resp.status_code == 200
        
        # Then try to login
        login_resp = client.post(
            "/token",
            data={"username": email, "password": password}
        )
        assert login_resp.status_code == 200
        token_data = login_resp.json()
        assert "access_token" in token_data