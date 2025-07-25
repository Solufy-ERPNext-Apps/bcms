import frappe
import json
# def validate_pro(doc, method=None):
# 	if doc.workflow_state == "Approved Recommendation" and not doc.custom_recommendation_letter:
# 		frappe.throw("Please Attach Recommendation Letter")
# 	# elif doc.workflow_state == "Approved Recommendation" and not doc.custom_proforma_for_sadh_sangat:
# 	#     frappe.throw("Please Attach Proforma for Sadh Sangat ")
# 	# elif doc.workflow_state == "Approved Recommendation" and not doc.custom_land_details:
# 	#     frappe.throw("Please Attach Land Details")
# 	elif doc.workflow_state == "Approved Recommendation" and not doc.custom_site_plan:
# 		frappe.throw("Please Attach Site Plan")
# 	elif doc.workflow_state == "Planning & Designing Approved" and not doc.custom_standard_planning__designing:
# 		frappe.throw("Please Attach Standard Planning & Designing")
# 	# elif doc.workflow_state == "Planning & Designing Approved" and not doc.custom_boq_estimate:
# 	#     frappe.throw("Please Attach BOQ/ Estimate")
# 	elif doc.workflow_state == "Drawing Approved" and not doc.custom_drawing_covering_letter:
# 		frappe.throw("Please Attach Drawing Covering Letter")
# 	elif doc.workflow_state == "Drawing Approved" and not doc.custom_drawing_file_all_blocks:
# 		frappe.throw("Please Attach Drawing File (All Blocks)")
# 	elif doc.workflow_state == "Drawing Approved" and not doc.custom_govt_approved_drawing_file:
# 		frappe.throw("Please Attach Govt. Approved Drawing File")
# 	elif doc.workflow_state == "Financial Approved" and not doc.custom_govt_approval_letter:
# 		frappe.throw("Please Attach Govt. Approval Letter")
# 	# elif doc.workflow_state == "Financial Approved" and not doc.custom_financial_approval_form:
# 	#     frappe.throw("Please Attach Financial Approval Form")
# 	elif doc.workflow_state == "Construction Committee Approved" and not doc.custom_construction_committee_form:
# 		frappe.throw("Please Attach Construction Committee Form")
# 	elif doc.workflow_state == "Committee Approved" and not doc.custom_transfer_order_form:
# 		frappe.throw("Please Attach Transfer Order Form")
# 	elif doc.workflow_state == "Fund Transfer Completed" and not doc.custom_progress_photo:
# 		frappe.throw("Please Attach Progress Photo")
# 	# elif doc.workflow_state == "Fund Transfer Completed" and not doc.custom_expenditure_form:
# 	#     frappe.throw("Please Attach Expenditure Form")
# 	elif doc.workflow_state == "Work Completion Started" and not doc.custom_work_completion_certificate:
# 		frappe.throw("Please Attach Fund Transfer Completed")


@frappe.whitelist()
def workflow_state(docname,method=None):
	doc = frappe.get_doc("Project", docname)
	state = None
	if doc.workflow_state == "Project Request":
		state = "Land Clearance"
		frappe.db.set_value("Project", docname, "workflow_state", state)
	elif doc.workflow_state == "Land Clearance":
		state = "Planning & Designing"
		frappe.db.set_value("Project", docname, "workflow_state", state)
	elif doc.workflow_state == "Planning & Designing":
		state = "Drawing Approval"
		frappe.db.set_value("Project", docname, "workflow_state", state)
	elif doc.workflow_state == "Drawing Approval":
		state = "Member Incharge (Financial Approval)"
		frappe.db.set_value("Project", docname, "workflow_state", state)
	elif doc.workflow_state == "Member Incharge (Financial Approval)":
		state = "Secretary (Financial Approval)"
		frappe.db.set_value("Project", docname, "workflow_state", state)
	elif doc.workflow_state == "Secretary (Financial Approval)":
		state = "Member Incharge A&F(Financial Approval)"
		frappe.db.set_value("Project", docname, "workflow_state", state)
	elif doc.workflow_state == "Member Incharge A&F(Financial Approval)":
		state = "Financial Approval"
		frappe.db.set_value("Project", docname, "workflow_state", state)
	elif doc.workflow_state == "Financial Approval":
		state = "Construction Committee Formed"
		frappe.db.set_value("Project", docname, "workflow_state", state)
	elif doc.workflow_state == "Construction Committee Formed":
		state = "Start of Sub Process for Fund Transfer"
		frappe.db.set_value("Project", docname, "workflow_state", state)
	elif doc.workflow_state == "Start of Sub Process for Fund Transfer":
		state = "100% Fund Transfer"
		frappe.db.set_value("Project", docname, "workflow_state", state)
	elif doc.workflow_state == "100% Fund Transfer":
		state = "Work completion Certificate"
		frappe.db.set_value("Project", docname, "workflow_state", state)
	elif doc.workflow_state == "Work completion Certificate":
		state = "Work Completed"
		frappe.db.set_value("Project", docname, "workflow_state", state)

	if state:
		return f"Workflow state updated to '{state}'"
@frappe.whitelist()
def reject_project(docname):
	doc = frappe.get_doc("Project", docname)

	reverse_map = {
		"Land Clearance": "Project Request",
		"Planning & Designing": "Land Clearance",
		"Drawing Approval": "Planning & Designing",
		"Member Incharge (Financial Approval)": "Drawing Approval",
		"Secretary (Financial Approval)": "Member Incharge (Financial Approval)",
		"Member Incharge A&F(Financial Approval)": "Secretary (Financial Approval)",
		"Financial Approval": "Member Incharge A&F(Financial Approval)",
		"Construction Committee Formed": "Financial Approval",
		"Start of Sub Process for Fund Transfer": "Construction Committee Formed",
		"100% Fund Transfer": "Start of Sub Process for Fund Transfer",
		"Work completion Certificate": "100% Fund Transfer",
		"Work Completed": "Work completion Certificate"
	}

	current_state = doc.workflow_state
	previous_state = reverse_map.get(current_state)

	if previous_state:
		frappe.db.set_value("Project", docname, "workflow_state", previous_state)
		return f"Workflow state rerve to '{previous_state}'"
