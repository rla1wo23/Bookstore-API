# app.py
import os
from flask import Flask, request, jsonify, render_template
from flask_mysqldb import MySQL
from dotenv import load_dotenv

app = Flask(__name__)

# 환경 변수 로드
load_dotenv()

# MySQL 설정 (환경 변수 사용), .env파일에 환경변수를 전부 저장했습니다.
app.config['MYSQL_HOST'] = os.getenv('MYSQL_HOST')
app.config['MYSQL_USER'] = os.getenv('MYSQL_USER')
app.config['MYSQL_PASSWORD'] = os.getenv('MYSQL_PASSWORD')
app.config['MYSQL_DB'] = os.getenv('MYSQL_DB')

mysql = MySQL(app)

#헬스체크를 수행하는 경로입니다.
@app.route('/')
def index():
    return render_template('index.html')

# 책 목록 조회하는 DB Get메소드입니다. (CRUD의 R)
@app.route('/books', methods=['GET'])
def get_books():
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM books")
    rows = cur.fetchall()
    result = []
    for row in rows:     #단순하게 행 조회 후 클라이언트에 리턴합니다.
        result.append({'id': row[0], 'title': row[1], 'author': row[2], 'price': float(row[3])})
    return jsonify(result)

#Post메소드입니다. (CRUD의 C)
@app.route('/books', methods=['POST'])
def add_book():
    data = request.get_json()
    cur = mysql.connection.cursor()
    cur.execute("INSERT INTO books (title, author, price) VALUES (%s, %s, %s)",
                (data['title'], data['author'], data['price']))
    mysql.connection.commit()
    return jsonify({'log': 'Book added successfully'}), 201

# 책 삭제 Delete 메소드입니다. (CRUD의 D)
@app.route('/books/<int:id>', methods=['DELETE'])
def delete_book(id):
    cur = mysql.connection.cursor()
    cur.execute("DELETE FROM books WHERE id = %s", [id])
    mysql.connection.commit()
    return jsonify({'log': 'Book deleted successfully'})
# 책 업데이트 (Update 메소드입니다. CRUD의 U)
@app.route('/books/<int:id>', methods=['PUT'])
def update_book(id):
    data = request.get_json()
    cur = mysql.connection.cursor()
    cur.execute("""
        UPDATE books
        SET title = %s, author = %s, price = %s
        WHERE id = %s
    """, (data['title'], data['author'], data['price'], id))
    mysql.connection.commit()
    return jsonify({'log': 'Book updated successfully'})

if __name__ == '__main__':
    app.run(debug=True)