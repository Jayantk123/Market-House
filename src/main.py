from flask import Flask,request, render_template
import pickle
import numpy as np

app = Flask(__name__)

model=pickle.load(open('model.pkl','rb'))


@app.route('/')
def hello_world():
    return render_template("index.html")


@app.route('/predict',methods=['POST','GET'])
def predict():
   return "efff"

    # if output>str(0.5):
    #     return render_template('index.html',pred='The Forest is in Danger.\nProbability of fire occuring is {}'.format(output))
    # else:
    #     return render_template('index.html',pred='The Forest is safe.\n Probability of fire occuring is {}'.format(output))


if __name__ == '__main__':
    app.run(debug=True)