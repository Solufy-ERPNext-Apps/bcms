# Copyright (c) 2025, Shivangi and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
import json
from datetime import date
from frappe import _
class LandPurchase(Document):
        def before_save(self):
            # When zone is selected in Land Purchase, fetch zonal incharge
            if self.zone:
                zonal_incharge = frappe.db.get_value("Zone", self.zone, "zonal_incharge")
                self.zonal_incharge = zonal_incharge or ""
            if not self.zonal_incharge:
                frappe.throw(_("Please select a Zonal Incharge before saving the Zone."))
        def validate(self):
            if self.zone:
                zonal_incharge = frappe.db.get_value("Zone", self.zone, "zonal_incharge")
            email = frappe.db.get_value("Employee", zonal_incharge, "personal_email")
            if not email:
                frappe.throw(_(f"Personal Email is not set for Zonal Incharge: {zonal_incharge} in Adhikari (Employee) record."))
            self.zonal_incharge_email = email



    # lat and long through open map
            def get_location(self):
                if self.latitude and self.longitude:
                    geojson = {
                    "type": "FeatureCollection",
                    "features": [
                {
                    "type": "Feature",
                    "properties": {},
                    "geometry": {
                    "type": "Point",
                    "coordinates": [
                        float(self.longitude),  
                        float(self.latitude) 
                            ]
                        }
                    }
                ]
            }

                self.db_set("map", json.dumps(geojson)) 
                self.db_set("location",json.dumps(geojson)) 

   