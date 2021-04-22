# -*- coding: utf-8 -*-
"""
Created on Thu Apr 22 00:14:51 2021

@author: Piyush Soni
"""

import os

import pandas as pd
import numpy as np


curr_dir = os.path.dirname(__file__)
data_path = os.path.join(curr_dir, os.path.join('data', "owid-covid-data.csv"))
save_path = os.path.join(curr_dir, os.path.join('data', "world-data.csv"))


data = pd.read_csv(data_path)

