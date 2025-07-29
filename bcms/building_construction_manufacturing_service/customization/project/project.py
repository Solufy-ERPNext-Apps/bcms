import frappe
import json

@frappe.whitelist()
def workflow_state(docname, workflow_state):
	workflow_data = frappe.db.get_all("Workflow Transition", {"parent": "Project"}, ["state", "next_state"])
	workflow_state_map = {row.state: row.next_state for row in workflow_data}
	state = workflow_state_map.get(workflow_state)
	if state:
		frappe.db.set_value("Project", docname, "workflow_state", state)
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
