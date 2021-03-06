# MIT License
# Copyright (c) 2019 Fabien Boucher

# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:

# The above copyright notice and this permission notice shall be included in
# all copies or substantial portions of the Software.

# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
# SOFTWARE.


from flask import Flask
from flask import request
from flask import jsonify
from flask_cors import CORS

from monocle import utils
from monocle.db.db import ELmonocleDB


app = Flask(__name__)
CORS(app)


@app.route("/api/0/query/<name>", methods=['GET'])
def query(name):
    repository_fullname = request.args.get('repository')
    params = utils.set_params(request.args)
    db = ELmonocleDB()
    result = db.run_named_query(
        name, repository_fullname,
        params)
    return jsonify(result)


def main():
    app.run(host='0.0.0.0', port=9876)


if __name__ == "__main__":
    main()
