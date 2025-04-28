from api import app
from waitress import serve

if __name__ == '__main__':
    # Run the Flask app using Waitress production server on port 5000
    serve(app, host='0.0.0.0', port=5000)
