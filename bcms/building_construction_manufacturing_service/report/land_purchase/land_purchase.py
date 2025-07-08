# Copyright (c) 2025, Shivangi and contributors
# For license information, please see license.txt

import frappe
from frappe.query_builder import DocType

def execute(filters=None):
    if not filters:
        filters = {}

    columns = get_columns()
    data = get_data(filters)

    return columns, data

def get_columns():
    return [
        {
            "label":"ID",
            "fieldname":"name",
            "fieldtype":"Link",
            "options":"Land Purchase",
            "width":80
        },
        {
            "label":"Zone",
            "fieldname":"zone",
            "fieldtype":"Link",
            "options":"Zone",
            "Width":150
        },
        {
            "label": "Survey Number", 
            "fieldname": "survey_number",
            "fieldtype": "Data", 
            "width": 120
        },
        {
            "label": "Location",
            "fieldname": "location_address",
            "fieldtype": "Data",
            "width": 200
        },
        {
            "label": "Ownership Type",
            "fieldname": "ownership_type",
            "fieldtype": "Select", 
            "width": 120
        },
        {
            "label": "GPS Coordinates",
            "fieldname": "gps_coordinates",
            "fieldtype": "Data",
            "width": 140
        },
        {
            "label": "Current Status",
            "fieldname": "currenct_status",
            "fieldtype": "Select", 
            "width": 120
        },
        {
            "label": "Total Area (sq ft)", 
            "fieldname": "total_area", 
            "fieldtype": "Float", 
            "width": 120
        },
        {
            "label": "Issue Date",
            "fieldname": "issue_date", 
            "fieldtype": "Date", 
            "width": 100
        },
        {
            "label": "Issuing Authority", 
            "fieldname": "issuing_authority",
            "fieldtype": "Data", 
            "width": 150
        },
        {
            "label": "Scan Quality",
            "fieldname": "scan_quality", 
            "fieldtype": "Select", 
            "width": 100
        },
        {
            "label": "Keywords", 
            "fieldname": "keywords", 
            "fieldtype": "Data", 
            "width": 200
        }
    ]


def get_data(filters):
    LandPurchase = DocType("Land Purchase")
    query = (
        frappe.qb.from_(LandPurchase)
        .select(
            LandPurchase.name,
            LandPurchase.zone,
            LandPurchase.survey_number,
            LandPurchase.location_address,
            LandPurchase.ownership_type,
            LandPurchase.gps_coordinates,
            LandPurchase.currenct_status,
            LandPurchase.total_area,
            LandPurchase.issue_date,
            LandPurchase.issuing_authority,
            LandPurchase.scan_quality,
        )
    )
    if filters.get("survey_number"):
        query = query.where(LandPurchase.survey_number == filters.get("survey_number"))
    if filters.get("ownership_type"):
        query = query.where(LandPurchase.ownership_type == filters.get("ownership_type"))
    if filters.get("current_status"):
        query = query.where(LandPurchase.currenct_status == filters.get("current_status"))
    if filters.get("from_date") and filters.get("to_date"):
        query = query.where(
            (LandPurchase.creation >= filters.get("from_date")) &
            (LandPurchase.creation <= filters.get("to_date"))
        )
    if filters.get("issuing_authority"):
        query = query.where(LandPurchase.issuing_authority.like(f"%{filters.get('issuing_authority')}%"))
    if filters.get("scan_quality"):
        query = query.where(LandPurchase.scan_quality == filters.get("scan_quality"))
    if filters.get("name"):
        query = query.where(LandPurchase.name == filters.get("name"))
    if filters.get("zone"):
        query = query.where(LandPurchase.zone == filters.get("zone"))



    return query.run(as_dict=True)
