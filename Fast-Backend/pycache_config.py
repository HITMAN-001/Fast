import os
import sys

# Set a centralized location for __pycache__ directories
os.environ['PYTHONPYCACHEPREFIX'] = os.path.join(os.path.dirname(os.path.abspath(__file__)), '.cache')
