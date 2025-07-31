# Copyright (c) 2025, Shivangi and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class AdditionalFundRequest(Document):
    pass
@frappe.whitelist()
def change_in_approve(docname,workflow_state):
	workflow_data = frappe.db.get_all("Workflow Transition", {"parent": "Additional Fund Request"}, ["state", "next_state"])
	workflow_state_map = {row.state: row.next_state for row in workflow_data}
	state = workflow_state_map.get(workflow_state)
	if state:
		frappe.db.set_value("Additional Fund Request", docname, "workflow_state", state)
		# proj_doc = frappe.get_doc("Additional Fund Request", docname)
		# proj_doc.workflow_state = state
		# proj_doc.save()
		return f"Workflow state updated to '{state}'"

@frappe.whitelist()
def reject_project(docname, workflow_state):
	workflow_data = frappe.db.get_all("Workflow Transition", {"parent": "Additional Fund Request"}, ["state", "next_state"])
	workflow_state_map = {row.next_state: row.state for row in workflow_data}
	if workflow_state in workflow_state_map:
		next_state = workflow_state_map.get(workflow_state)
		if next_state:
			frappe.db.set_value("Additional Fund Request", docname, "workflow_state", next_state)
			return f"Additional Fund Request '{docname}' has been rejected."
		else:
			return f"Cannot reject Additional Fund Request '{docname}' from state '{workflow_state}'."
	else:
		return f"Additional Fund Request '{docname}' is not in a valid state for rejection."


	# def on_validate(self):
		# if self.workflow_state == "Completed":
		#     existing_amount = frappe.db.get_value("Additional Fund Request", self.project, "custom_additional_require_amount") or 0
		#     new_amount = existing_amount + self.amount
		#     frappe.db.set_value("Project", self.project, "custom_additional_require_amount", new_amount)
		#     frappe.db.set_value("Project", self.project, "custom_additional_require_amount_in_words", self.get_amount_in_words(new_amount))