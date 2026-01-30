"""
Test Suite for MarketEdge Global

This module contains unit tests for the main application.
"""

import unittest
import sys
import os

# Add src to path for imports
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'src'))

from main import main

class TestMain(unittest.TestCase):
    """Test cases for the main module."""
    
    def test_main_runs_without_error(self):
        """Test that main function runs without error."""
        try:
            # Capture output instead of printing to console
            import io
            from contextlib import redirect_stdout
            
            f = io.StringIO()
            with redirect_stdout(f):
                main()
            
            output = f.getvalue()
            self.assertIn("Welcome to MarketEdge Global!", output)
            self.assertIn("This is a new repository initialized with files from Git.", output)
        except Exception as e:
            self.fail(f"main() raised {type(e).__name__} unexpectedly!")

if __name__ == '__main__':
    unittest.main()
