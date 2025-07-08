// Copyright (c) 2025, Shivangi and contributors
// For license information, please see license.txt

frappe.query_reports["Land Purchase"] = {
	"filters": [
		{
			fieldname: "name",
			label: "ID",
			fieldtype: "Link",
			options: "Land Purchase"
		},
		{
			"fieldname": "survey_number",
			"label": "Survey Number",
			"fieldtype": "Data"
		},
		{
			"fieldname":"zone",
			"label":"Zone",
			"fieldtype":"Link",
			"options":"Zone"
		},
		{
			"fieldname": "ownership_type",
			"label": "Ownership Type",
			"fieldtype": "Select",
			"options": "\nPrivate\nGovernment\nTrust"
		},
		{
			"fieldname": "current_status",
			"label": "Current Status",
			"fieldtype": "Select",
			"options": "\nFree\nLeased\nEncumbered"
		},
		{
			"fieldname": "from_date",
			"label": "From Date",
			"fieldtype": "Date"
		},
		{
			"fieldname": "to_date",
			"label": "To Date",
			"fieldtype": "Date"
		},
		{
			"fieldname": "issuing_authority",
			"label": "Issuing Authority",
			"fieldtype": "Data"
		},
		{
			"fieldname": "scan_quality",
			"label": "Scan Quality",
			"fieldtype": "Select",
			"options": "\nHigh\nMedium\nLow"
		},
		{
			"fieldname": "keywords",
			"label": "Keywords",
			"fieldtype": "Data"
		}
	]
};
