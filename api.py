from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from werkzeug.security import generate_password_hash, check_password_hash
from bson.objectid import ObjectId
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Configure MongoDB connection
app.config["MONGO_URI"] = "mongodb://localhost:27017/room_allotment_system"
mongo = PyMongo(app)

# Collections
teachers_collection = mongo.db.teachers
students_collection = mongo.db.students

@app.route('/register/teacher', methods=['POST'])
def register_teacher():
    data = request.json
    required_fields = ['fullName', 'email', 'teacherId', 'department', 'contactNumber', 'password']
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Missing required fields'}), 400

    # Validate courses field if present
    courses = data.get('courses', [])
    if not isinstance(courses, list) or len(courses) > 3:
        return jsonify({'error': 'You can add a maximum of 3 subjects'}), 400

    # Check if email or teacherId already exists
    if teachers_collection.find_one({'email': data['email']}) or teachers_collection.find_one({'teacherId': data['teacherId']}):
        return jsonify({'error': 'Teacher with given email or ID already exists'}), 400

    password_hash = generate_password_hash(data['password'])

    teacher = {
        'fullName': data['fullName'],
        'email': data['email'],
        'teacherId': data['teacherId'],
        'department': data['department'],
        'contactNumber': data['contactNumber'],
        'courses': courses,
        'passwordHash': password_hash
    }

    teachers_collection.insert_one(teacher)
    return jsonify({'message': 'Teacher registered successfully'}), 201

@app.route('/register/student', methods=['POST'])
def register_student():
    data = request.json
    required_fields = ['fullName', 'email', 'studentId', 'course', 'password']
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Missing required fields'}), 400

    # Check if email or studentId already exists
    if students_collection.find_one({'email': data['email']}) or students_collection.find_one({'studentId': data['studentId']}):
        return jsonify({'error': 'Student with given email or ID already exists'}), 400

    password_hash = generate_password_hash(data['password'])

    student = {
        'fullName': data['fullName'],
        'email': data['email'],
        'studentId': data['studentId'],
        'course': data['course'],
        'passwordHash': password_hash
    }

    students_collection.insert_one(student)
    return jsonify({'message': 'Student registered successfully'}), 201

@app.route('/login/teacher', methods=['POST'])
def login_teacher():
    data = request.json
    teacherId = data.get('teacherId')
    password = data.get('password')
    if not teacherId or not password:
        return jsonify({'message': 'Teacher ID and password are required'}), 400

    teacher = teachers_collection.find_one({'teacherId': teacherId})
    if not teacher:
        return jsonify({'message': 'Invalid teacher ID or password'}), 401

    if not check_password_hash(teacher['passwordHash'], password):
        return jsonify({'message': 'Invalid teacher ID or password'}), 401

    return jsonify({
        'message': 'Teacher login successful',
        'teacherId': teacher['teacherId'],
        'fullName': teacher['fullName']
    })

@app.route('/login/student', methods=['POST'])
def login_student():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    if not email or not password:
        return jsonify({'message': 'Email and password are required'}), 400

    student = students_collection.find_one({'email': email})
    if not student:
        return jsonify({'message': 'Invalid email or password'}), 401

    if not check_password_hash(student['passwordHash'], password):
        return jsonify({'message': 'Invalid email or password'}), 401

    return jsonify({
        'message': 'Student login successful',
        'studentId': student['studentId'],
        'fullName': student['fullName']
    })

@app.route('/profile/teacher/<teacherId>', methods=['GET'])
def get_teacher_profile(teacherId):
    teacher = teachers_collection.find_one({'teacherId': teacherId}, {'_id': 0, 'passwordHash': 0})
    if not teacher:
        return jsonify({'error': 'Teacher not found'}), 404
    return jsonify(teacher)

@app.route('/profile/teacher/<teacherId>', methods=['PUT'])
def update_teacher_profile(teacherId):
    data = request.json
    # Prevent updating teacherId and passwordHash here for simplicity
    update_fields = {k: v for k, v in data.items() if k in ['fullName', 'email', 'department', 'contactNumber', 'courses']}
    if not update_fields:
        return jsonify({'error': 'No valid fields to update'}), 400
    result = teachers_collection.update_one({'teacherId': teacherId}, {'$set': update_fields})
    if result.matched_count == 0:
        return jsonify({'error': 'Teacher not found'}), 404
    return jsonify({'message': 'Teacher profile updated successfully'})

@app.route('/profile/student/<studentId>', methods=['GET'])
def get_student_profile(studentId):
    student = students_collection.find_one({'studentId': studentId}, {'_id': 0, 'passwordHash': 0})
    if not student:
        return jsonify({'error': 'Student not found'}), 404
    return jsonify(student)

@app.route('/profile/student/<studentId>', methods=['PUT'])
def update_student_profile(studentId):
    data = request.json
    # Prevent updating studentId and passwordHash here for simplicity
    update_fields = {k: v for k, v in data.items() if k in ['fullName', 'email', 'course']}
    if not update_fields:
        return jsonify({'error': 'No valid fields to update'}), 400
    result = students_collection.update_one({'studentId': studentId}, {'$set': update_fields})
    if result.matched_count == 0:
        return jsonify({'error': 'Student not found'}), 404
    return jsonify({'message': 'Student profile updated successfully'})

@app.route('/profile/')
def profile():
    # Database se data uthana
    profile_data = teachers_collection.find_one()
    if not profile_data:
        return jsonify({'error': 'Profile not found'}), 404
    return jsonify(profile_data)

@app.route('/profile', methods=['GET'])
def get_profile():
    # Get the teacherId from the request
    teacherId = request.args.get('teacherId')

    # Fetch the teacher's profile from the database
    profile_data = teachers_collection.find_one({'teacherId': teacherId}, {'_id': 0, 'passwordHash': 0})

    if not profile_data:
        return jsonify({'error': 'Profile not found'}), 404
    
    # Agar profile nahi mila toh error return karo    
    
    # Template me bhejna
    return render_template('profile.html', profile=profile_data)

if __name__ == '__main__':
    app.run(debug=True, use_reloader=False, threaded=False)
