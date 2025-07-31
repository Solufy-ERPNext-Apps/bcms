import frappe
import json
from frappe.utils import money_in_words


@frappe.whitelist()
def workflow_state(docname, workflow_state):
	workflow_data = frappe.db.get_all("Workflow Transition", {"parent": "Project"}, ["state", "next_state"])
	workflow_state_map = {row.state: row.next_state for row in workflow_data}
	state = workflow_state_map.get(workflow_state)
	if state:
		proj_doc = frappe.get_doc("Project", docname)
		proj_doc.workflow_state = state
		proj_doc.save()
		return f"Workflow state updated to '{state}'"
	
@frappe.whitelist()
def reject_project(docname, workflow_state):
	workflow_data = frappe.db.get_all("Workflow Transition", {"parent": "Project"}, ["state", "next_state"])
	workflow_state_map = {row.next_state: row.state for row in workflow_data}
	if workflow_state in workflow_state_map:
		next_state = workflow_state_map.get(workflow_state)
		if next_state:
			frappe.db.set_value("Project", docname, "workflow_state", next_state)
			return f"Project '{docname}' has been rejected."
		else:
			return f"Cannot reject project '{docname}' from state '{workflow_state}'."
	else:
		return f"Project '{docname}' is not in a valid state for rejection."


@frappe.whitelist()
def get_amount_in_words(amount):
    try:
        if not amount:
            return ""
        amount = float(amount)
        default_currency = frappe.db.get_default("currency")
        return money_in_words(abs(amount), default_currency)
    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "Get Amount in Words Error")
        return ""