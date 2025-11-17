# Simple Flask app to receive bookings (example)
# pip install flask psycopg2-binary
from flask import Flask, request, jsonify
import os
import psycopg2

app = Flask(__name__)

@app.route('/book', methods=['POST'])
def book():
    data = request.get_json()
    if not data:
        return jsonify({'status':'error','message':'No data'}), 400
    # Example insert into PostgreSQL - supply your credentials via env vars
    db_url = os.getenv('SITESEE_PG_DSN')
    if not db_url:
        return jsonify({'status':'error','message':'DB DSN not configured'}), 500
    try:
        conn = psycopg2.connect(db_url)
        cur = conn.cursor()
        cur.execute("INSERT INTO bookings (external_id, name, email, date, time, guests, notes) VALUES (%s,%s,%s,%s,%s,%s,%s)", (
            data.get('id'), data.get('name'), data.get('email'), data.get('date'), data.get('time'), data.get('guests'), data.get('notes')
        ))
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({'status':'ok'})
    except Exception as e:
        return jsonify({'status':'error','message':str(e)}), 500

if __name__ == '__main__':
    app.run(port=5001)
