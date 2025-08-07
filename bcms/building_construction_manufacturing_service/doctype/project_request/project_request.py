import frappe
from frappe.model.document import Document
from frappe.utils import get_link_to_form, format_date, money_in_words

class ProjectRequest(Document):
    def validate(self):
        pass

@frappe.whitelist()
def get_amount_in_words(amount):
    try:
        return money_in_words(amount)
    except Exception as e:
        frappe.throw(f"Error converting to words: {e}")

@frappe.whitelist()
def change_in_approve(docname,workflow_state):
	workflow_data = frappe.db.get_all("Workflow Transition", {"parent": "Project Request"}, ["state", "next_state"])
	workflow_state_map = {row.state: row.next_state for row in workflow_data}
	state = workflow_state_map.get(workflow_state)
	if state:
		frappe.db.set_value("Project Request", docname, "workflow_state", state)
		frappe.get_doc("Project Request", docname).validate()
		return f"Project Request is Approved"

@frappe.whitelist()
def reject_project(docname, workflow_state):
	workflow_data = frappe.db.get_all("Workflow Transition", {"parent": "Project Request"}, ["state", "next_state"])
	workflow_state_map = {row.next_state: row.state for row in workflow_data}
	if workflow_state in workflow_state_map:
		next_state = workflow_state_map.get(workflow_state)
		if next_state:
			frappe.db.set_value("Project Request", docname, "workflow_state", next_state)
			return f"Project Request is Rejected."
		else:
			return f"Cannot reject Project Request '{docname}' from state '{workflow_state}'."
	else:
		return f"Project Request '{docname}' is not in a valid state for rejection."