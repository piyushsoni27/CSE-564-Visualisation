from flask import Flask, redirect, url_for, render_template, jsonify, request
from sklearn.preprocessing import StandardScaler, MinMaxScaler
from sklearn.decomposition import PCA
import matplotlib.pyplot as plt 

import pandas as pd
import numpy as np
import json
import random

from sklearn.cluster import KMeans

app = Flask(__name__)
app.secret_key = "hello"

app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0

data = pd.read_csv("data/flights1987.csv")
data_original = data

sampleSize = 500

pca_projections = []
pca_val = dict({})
pca_model = []
squared_loadings = []

top_column_names = []

d_i = 2

cluster_count = 2


def preprocess():
    global data
    to_drop = ['UniqueCarrier', 'TailNum', 'AirTime', 'Origin', 'Dest', 'TaxiIn', 
               'TaxiOut', 'Cancelled', 'CancellationCode', 'Diverted', 'CarrierDelay',
               'WeatherDelay', 'NASDelay', 'SecurityDelay', 'LateAircraftDelay', 'Year', 'Month', 'DayofMonth', 'DayOfWeek']
    
    data.drop(data[to_drop], axis=1, inplace=True)
    
    data = data[data['DepTime'].notna()]
    data = data[data['ArrTime'].notna()]
    data = data[data['ActualElapsedTime'].notna()]
    data = data[data['ArrDelay'].notna()]
        
    scaler = StandardScaler()
    scaled_features = scaler.fit_transform(data)
    data = pd.DataFrame(scaled_features, index=data.index, columns=data.columns)
    
def generate_eigenValues():
    global data
    cov_mat = np.cov(data.T)
    eig_values, eig_vectors = np.linalg.eig(cov_mat)

    #Sorting Eigen Values
    idx = eig_values.argsort()[::-1]
    eig_values = eig_values[idx]
    eig_vectors = eig_vectors[:, idx]
    return eig_values, eig_vectors

def sampledata():
    global sampleSize, data
    data = data.sample(sampleSize, random_state=1)
    data.reset_index(inplace=True, drop=True)

def gen_squaredLoadings(d_i):
    global data

    local_squared_loadings = []
    [eigenValues, eigenVectors] = generate_eigenValues()

    ftrCount = len(eigenVectors)
    for ftrId in range(0, ftrCount):
        loadings = 0
        for compId in range(0, d_i):
            loadings = loadings + eigenVectors[compId][ftrId] * eigenVectors[compId][ftrId]
        local_squared_loadings.append(loadings)

    return local_squared_loadings

def calc_PCA():
    global pca_projections
    global pca_val
    global pca_model
    
    pca_model = PCA(n_components = len(data.columns))
    pca_projections = pca_model.fit_transform(data)
    
    # return pca_val

@app.route("/top_features")
def get_top_4_loadings():
    
    global top_column_names
        
    loadings = dict(zip(list(data.columns), squared_loadings))
    top_loadings = {k: v for k, v in sorted(loadings.items(), key=lambda item: item[1], reverse=True)[:4]}
    
    top_column_names = list(top_loadings.keys())
    return json.dumps(top_loadings)

@app.route("/scattermatrix", methods=["POST" , "GET"])
def get_SM_data():
    global cluster_count
    
    if(request.method == 'POST'):
        cluster_count = int(request.get_json())
    # print("herhhhhhh")
    # print(cluster_count)
    top_attr_data = data[top_column_names]
    kmeans = KMeans(n_clusters=cluster_count, random_state=0).fit(top_attr_data)
    top_attr_data['class'] = kmeans.labels_
    SM_data = top_attr_data.to_dict(orient="records")
    # print(SM_data)
    return json.dumps(SM_data)

@app.route("/scree" , methods=['GET', 'POST'])
def scree_plot():
    global pca_val
    global d_i
    global squared_loadings
    
    if(request.method == 'POST'):
        d_i = int(request.get_json())
        squared_loadings = gen_squaredLoadings(d_i)
    
    pca_val['x'] = list(range(1,len(pca_model.explained_variance_ )+1))
    pca_val['y'] = pca_model.explained_variance_ratio_.tolist()
    
    
    pca_val_df = pd.DataFrame(pca_val)
    pca_val_df['cumsum'] = pca_val_df['y'].cumsum()
    # print(pca_val_df)
    return json.dumps(pca_val_df.to_dict(orient="records"))

@app.route("/biplot", methods=['GET'])
def biPlot():
    pca_biplot = {}
    minmax_scaler = MinMaxScaler(feature_range = (-1, 1))
    
    pca_biplot['x'] = pca_projections[:, 0]
    pca_biplot['y'] = pca_projections[:, 1]
    
    pca_biplot_df =  pd.DataFrame(minmax_scaler.fit_transform(pd.DataFrame(pca_biplot)), columns=['x', 'y']).to_dict("records")
    return json.dumps(pca_biplot_df) 

@app.route("/biplotaxis")
def get_biplot_axis():
    biplot_axis = {}
    minmax_scaler = MinMaxScaler(feature_range = (-1, 1))
    biplot_axis['x'] = pca_model.components_[0, :]
    biplot_axis['y'] = pca_model.components_[1, :]
    # print(pca_model.components_)
    # print(biplot_axis)
    
    biplot_axis_df = pd.DataFrame(minmax_scaler.fit_transform(pd.DataFrame(biplot_axis)), columns=['x', 'y']).to_dict("records")
    
    # print(biplot_axis_df)
    return json.dumps(biplot_axis_df) 

@app.route("/")
def home():
    global d_i
    global cluster_count
    d_i = 2

    cluster_count = 2
    return render_template("index.html")


if(__name__ == "__main__"):
    preprocess()
    sampledata()
    # print(data.columns)
    calc_PCA()
    biPlot()
    get_biplot_axis()
    # gen_squaredLoadings()
    squared_loadings = gen_squaredLoadings(d_i)
    get_top_4_loadings()
    
    
    app.config['TEMPLATES_AUTO_RELOAD'] = True
    app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0
    app.run(debug=True)