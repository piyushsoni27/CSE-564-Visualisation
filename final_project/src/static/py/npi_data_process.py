"""

Created on Sun May  2 20:01:35 2021

@author: Abhishek Bhattad
"""


import os
import glob

import pandas as pd

root_path = os.path.split(os.path.split(os.path.dirname(__file__))[0])[0]
data_folder = os.path.join(root_path, 'data')
open_path = os.path.join(data_folder, "COVID19_non-pharmaceutical-interventions_version2_utf8.csv")
save_path = os.path.join(data_folder, "bubble_npi.csv")

df = pd.read_csv(open_path)
df_new = df[['iso3','Country','Date','Measure_L1','Measure_L2','Measure_L3']]
df_new['Date'] = pd.to_datetime(df_new.Date)
df_new.rename(columns={'iso3':'id'},inplace=True)
df_new.replace("Case identification, contact tracing and related measures","Contact tracing",inplace=True)
df_new.replace("Healthcare and public health capacity","Public Healthcare",inplace=True)
df_new.replace("Returning to normal life","Ease of restrictions",inplace=True)

print(df_new['Measure_L1'])
df_new.to_csv(save_path, index=False, encoding='utf-8-sig')
