import frappe
import json
def validate_pro(doc, method=None):
	if doc.workflow_state == "Approved Recommendation" and not doc.custom_recommendation_letter:
		frappe.throw("Please Attach Recommendation Letter")
	# elif doc.workflow_state == "Approved Recommendation" and not doc.custom_proforma_for_sadh_sangat:
	#     frappe.throw("Please Attach Proforma for Sadh Sangat ")
	# elif doc.workflow_state == "Approved Recommendation" and not doc.custom_land_details:
	#     frappe.throw("Please Attach Land Details")
	elif doc.workflow_state == "Approved Recommendation" and not doc.custom_site_plan:
		frappe.throw("Please Attach Site Plan")
	elif doc.workflow_state == "Planning & Designing Approved" and not doc.custom_standard_planning__designing:
		frappe.throw("Please Attach Standard Planning & Designing")
	# elif doc.workflow_state == "Planning & Designing Approved" and not doc.custom_boq_estimate:
	#     frappe.throw("Please Attach BOQ/ Estimate")
	elif doc.workflow_state == "Drawing Approved" and not doc.custom_drawing_covering_letter:
		frappe.throw("Please Attach Drawing Covering Letter")
	elif doc.workflow_state == "Drawing Approved" and not doc.custom_drawing_file_all_blocks:
		frappe.throw("Please Attach Drawing File (All Blocks)")
	elif doc.workflow_state == "Drawing Approved" and not doc.custom_govt_approved_drawing_file:
		frappe.throw("Please Attach Govt. Approved Drawing File")
	elif doc.workflow_state == "Financial Approved" and not doc.custom_govt_approval_letter:
		frappe.throw("Please Attach Govt. Approval Letter")
	# elif doc.workflow_state == "Financial Approved" and not doc.custom_financial_approval_form:
	#     frappe.throw("Please Attach Financial Approval Form")
	elif doc.workflow_state == "Construction Committee Approved" and not doc.custom_construction_committee_form:
		frappe.throw("Please Attach Construction Committee Form")
	elif doc.workflow_state == "Committee Approved" and not doc.custom_transfer_order_form:
		frappe.throw("Please Attach Transfer Order Form")
	elif doc.workflow_state == "Fund Transfer Completed" and not doc.custom_progress_photo:
		frappe.throw("Please Attach Progress Photo")
	# elif doc.workflow_state == "Fund Transfer Completed" and not doc.custom_expenditure_form:
	#     frappe.throw("Please Attach Expenditure Form")
	elif doc.workflow_state == "Work Completion Started" and not doc.custom_work_completion_certificate:
		frappe.throw("Please Attach Fund Transfer Completed")

# @frappe.whitelist()
# def create_or_update_land_details_doc(data):
# 	import json
# 	if isinstance(data, str):
# 		data = json.loads(data)

# 	docname = data.get('docname')

# 	if docname:
# 		doc = frappe.get_doc("Land Details", docname)
# 		doc.update(data)
# 		doc.save()
# 	else:
# 		doc = frappe.new_doc("Land Details")
# 		doc.update(data)
# 		doc.insert()
# 	return {
# 		"name": doc.name,
# 		"doctype": doc.doctype
# 	}

