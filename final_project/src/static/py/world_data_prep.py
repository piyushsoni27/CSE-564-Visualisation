# -*- coding: utf-8 -*-
"""
Created on Wed Apr 21 15:57:40 2021

@author: Piyush Soni
"""
import os

import pandas as pd
import numpy as np


root_path = os.path.split(os.path.split(os.path.dirname(__file__))[0])[0]
data_folder = os.path.join(root_path, 'data')

data_path = os.path.join(data_folder, "owid-covid-data.csv")
save_path = os.path.join(data_folder, "world-data.csv")


data = pd.read_csv(data_path)

def preprocess():
    global data
    data.fillna(0, inplace=True)
    data = data[~data['iso_code'].astype(str).str.startswith('OWID')]
    data.reset_index(drop=True, inplace=True)
    data.rename({"iso_code" : "id"}, axis="columns", inplace=True)
    
preprocess()

# dict_list = []

# dates = data.date.unique()

# for date in dates:
#     df = data.loc[data.date==date]
#     new_cases = df.new_cases_smoothed.sum()
#     new_deaths = df.new_deaths_smoothed.sum()
#     new_vaccinations = df.new_vaccinations_smoothed.sum()   
    
#     dict_ = {"date": date, "new_cases":new_cases, "new_deaths":new_deaths, "new_vaccinations":new_vaccinations}
    
#     dict_list.append(dict_)

groups = data.groupby(data.date)

new_cases = groups.new_cases_smoothed.sum()
new_deaths = groups.new_deaths_smoothed.sum()
new_vaccinations = groups.new_vaccinations_smoothed.sum()

df = pd.DataFrame({"new_cases":new_cases, "new_deaths":new_deaths, "new_vaccinations":new_vaccinations})

print(df.reset_index())
    
# world_daily = pd.DataFrame(dict_list, columns=['date','new_cases','new_deaths','new_vaccinations'])

# world_daily.sort_values(by=['date'], ignore_index=True, inplace=True)

# world_daily = world_daily.iloc[22:].reset_index()

df.to_csv(save_path)
